import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";

// Stripe v20 removed current_period_start/end from Subscription type,
// but they still exist in the API response. Extract them safely.
function getSubscriptionPeriod(sub: Stripe.Subscription) {
  const raw = sub as unknown as {
    current_period_start?: number;
    current_period_end?: number;
  };
  return {
    start: raw.current_period_start
      ? new Date(raw.current_period_start * 1000).toISOString()
      : null,
    end: raw.current_period_end
      ? new Date(raw.current_period_end * 1000).toISOString()
      : null,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription as string
          );
          const period = getSubscriptionPeriod(subscription);
          await supabase
            .from("featured_subscriptions")
            .update({
              stripe_subscription_id: subscription.id,
              status: "active",
              current_period_start: period.start,
              current_period_end: period.end,
            })
            .eq("stripe_checkout_session_id", session.id);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const paidSubId = (invoice as unknown as { subscription?: string }).subscription;
        if (paidSubId) {
          const subscription = await getStripe().subscriptions.retrieve(paidSubId);
          const period = getSubscriptionPeriod(subscription);
          await supabase
            .from("featured_subscriptions")
            .update({
              status: "active",
              current_period_start: period.start,
              current_period_end: period.end,
            })
            .eq("stripe_subscription_id", paidSubId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const failedSubId = (invoice as unknown as { subscription?: string }).subscription;
        if (failedSubId) {
          await supabase
            .from("featured_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", failedSubId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          canceled: "expired",
          unpaid: "past_due",
        };
        let newStatus = statusMap[subscription.status] || "expired";

        // If cancel_at_period_end, mark as cancelled (still featured until period end)
        if (subscription.cancel_at_period_end && subscription.status === "active") {
          newStatus = "cancelled";
        }

        const period = getSubscriptionPeriod(subscription);
        await supabase
          .from("featured_subscriptions")
          .update({
            status: newStatus,
            current_period_start: period.start,
            current_period_end: period.end,
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from("featured_subscriptions")
          .update({ status: "expired" })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }
    }

    // Revalidate homepage so featured tools update
    revalidatePath("/");
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
