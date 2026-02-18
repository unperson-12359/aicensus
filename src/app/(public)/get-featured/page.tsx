import { ArrowRight, Star, Eye, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeometricDecor, sectionShapes } from "@/components/shared/geometric-decor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Featured — AiCensus",
  description:
    "Get your AI tool featured on the AiCensus homepage. Maximum visibility, more traffic, cancel anytime.",
};

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/dRm7sLfgaeG927B1ZK5Vu00";

const benefits = [
  {
    icon: Star,
    title: "Homepage spotlight",
    description:
      "Your tool appears in the Featured Tools section — the first thing visitors see.",
  },
  {
    icon: Eye,
    title: "Maximum visibility",
    description:
      "Featured tools get larger cards and priority placement above all other listings.",
  },
  {
    icon: TrendingUp,
    title: "More traffic",
    description:
      "Direct clicks from our homepage to your tool. Cancel anytime.",
  },
];

const included = [
  "Featured placement on homepage",
  "Larger card with priority positioning",
  "Direct link to your tool's website",
  "Cancel anytime — no lock-in",
];

export default function GetFeaturedPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Featured Placement
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl">
          Get your tool in front of{" "}
          <span className="text-gradient-primary">every visitor.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Featured tools appear on the AiCensus homepage — the first thing
          builders see. Monthly subscription. Cancel anytime.
        </p>
      </div>

      {/* Benefits */}
      <div className="relative mt-12">
        <GeometricDecor shapes={sectionShapes} />
        <div className="grid gap-6 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-border/50 bg-card p-5 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 font-semibold">{benefit.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Card */}
      <div className="mt-12 rounded-2xl border border-border/50 bg-card p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Ready to get featured?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Subscribe today and our team will set up your featured listing within
          24–48 hours.
        </p>

        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
          {included.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <a href={STRIPE_PAYMENT_LINK} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="glow-sm text-base">
              Subscribe Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Secure payment via Stripe. Cancel your subscription anytime.
        </p>
      </div>

      {/* How it works */}
      <div className="mt-16 text-center">
        <h2 className="font-display text-xl font-bold">How it works</h2>
        <div className="mx-auto mt-6 grid max-w-2xl gap-6 sm:grid-cols-3">
          <div>
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              1
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Subscribe via our secure Stripe payment page
            </p>
          </div>
          <div>
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              2
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              We set up your featured listing within 24–48 hours
            </p>
          </div>
          <div>
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              3
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your tool appears on the homepage for all visitors to see
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
