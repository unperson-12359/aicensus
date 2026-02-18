import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  submitterName: z.string().min(1),
  submitterEmail: z.string().email(),
  toolName: z.string().min(1),
  toolWebsite: z.string().url(),
  toolTagline: z.string().optional(),
  toolDescription: z.string().optional(),
  toolPricingModel: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const priceId = process.env.STRIPE_FEATURED_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Featured pricing not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const data = bodySchema.parse(body);

    // Create or find Stripe customer
    const existingCustomers = await getStripe().customers.list({
      email: data.submitterEmail,
      limit: 1,
    });

    const customer =
      existingCustomers.data[0] ??
      (await getStripe().customers.create({
        email: data.submitterEmail,
        name: data.submitterName,
        metadata: { tool_name: data.toolName },
      }));

    // Create Checkout Session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";

    const session = await getStripe().checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      success_url: `${siteUrl}/get-featured/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/get-featured?cancelled=true`,
      metadata: {
        tool_name: data.toolName,
        tool_website: data.toolWebsite,
      },
      subscription_data: {
        metadata: {
          tool_name: data.toolName,
          tool_website: data.toolWebsite,
        },
      },
    });

    // Store pending subscription
    const supabase = createAdminClient();
    await supabase.from("featured_subscriptions").insert({
      stripe_customer_id: customer.id,
      stripe_checkout_session_id: session.id,
      tool_name: data.toolName,
      tool_website: data.toolWebsite,
      tool_tagline: data.toolTagline || null,
      tool_description: data.toolDescription || null,
      tool_pricing_model: data.toolPricingModel || null,
      submitter_name: data.submitterName,
      submitter_email: data.submitterEmail,
      status: "pending",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
