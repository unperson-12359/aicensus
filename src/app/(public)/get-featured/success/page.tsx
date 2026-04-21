import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful — AiCensus",
};

export default function GetFeaturedSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <CheckCircle2 className="h-8 w-8 text-foreground" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">
        Payment received!
      </h1>
      <p className="mt-4 text-muted-foreground">
        Thank you for getting featured on AiCensus. Our team will review your
        tool and set up your listing within 24-48 hours. You&apos;ll receive a
        confirmation email from Stripe.
      </p>
      <div className="mt-4 rounded-lg border border-border/50 bg-card p-4 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">What happens next:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-left">
          <li>1. We create your tool listing with the info you provided</li>
          <li>2. Your tool appears in the Featured section on the homepage</li>
          <li>
            3. You stay featured as long as your subscription is active
          </li>
        </ul>
      </div>
      <div className="mt-8">
        <Link href="/">
          <Button variant="outline">
            Back to Homepage <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
