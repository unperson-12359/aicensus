import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerChildren, StaggerItem, PageTransition } from "@/components/motion";

export const metadata: Metadata = {
  title: "Pricing — AiCensus",
  description:
    "AiCensus is free for builders and tool browsers. Get a featured listing for your AI tool with priority placement and a featured badge.",
  alternates: { canonical: "/pricing" },
};

const freePlan = {
  name: "Free",
  description: "For builders and tool browsers",
  price: "$0",
  period: "forever",
  features: [
    "Browse the full AI tools directory",
    "Create your portfolio page",
    "Add unlimited projects",
    "Live project previews",
    "Contact form on your profile",
    "Appear in the portfolio gallery",
    "Submit tools for listing",
  ],
  cta: "Get Started",
  href: "/signup",
};

const featuredPlan = {
  name: "Featured",
  description: "For AI tool makers who want visibility",
  price: "$9.99",
  period: "/month",
  features: [
    "Everything in Free",
    "Priority homepage placement",
    "Featured badge on your listing",
    "Higher search ranking",
    "Category page prominence",
    "Direct support",
    "Cancel anytime",
  ],
  cta: "Get Featured",
  href: "/get-featured",
};

export default function PricingPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Pricing
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              AiCensus is free for everyone. Tool makers can get featured
              placement with a monthly subscription.
            </p>
          </div>
        </FadeIn>

        {/* Pricing cards */}
        <StaggerChildren className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {/* Free plan */}
          <StaggerItem>
            <Card className="flex h-full flex-col border-border/50">
              <CardHeader className="pb-2">
                <p className="font-display text-lg font-semibold">
                  {freePlan.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {freePlan.description}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">
                    {freePlan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {freePlan.period}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {freePlan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href={freePlan.href}>
                    <Button variant="outline" className="w-full">
                      {freePlan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Featured plan */}
          <StaggerItem>
            <Card className="relative flex h-full flex-col border-white/40 bg-white/[0.03]">
              <div className="absolute -top-3 left-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Popular
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <p className="font-display text-lg font-semibold">
                  {featuredPlan.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {featuredPlan.description}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">
                    {featuredPlan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {featuredPlan.period}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {featuredPlan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href={featuredPlan.href}>
                    <Button className="w-full">
                      {featuredPlan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerChildren>

        {/* FAQ section */}
        <FadeIn delay={0.3}>
          <div className="mx-auto mt-20 max-w-2xl">
            <h2 className="text-center font-display text-2xl font-bold">
              Pricing FAQ
            </h2>
            <div className="mt-8 space-y-6">
              {[
                {
                  q: "Is there really a free plan?",
                  a: "Yes. Browsing the directory, creating a portfolio, and adding projects are free with no catch. We don't show ads or sell your data.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We use Stripe for payments, which supports all major credit and debit cards.",
                },
                {
                  q: "Can I cancel the Featured plan anytime?",
                  a: "Yes. Cancel anytime from your Stripe billing portal. Your featured placement stays active until the end of your billing period.",
                },
                {
                  q: "Do I need to pay to submit a tool?",
                  a: "No. Submitting a tool for review is free. The Featured plan is optional and gives your tool extra visibility.",
                },
              ].map((item) => (
                <div key={item.q}>
                  <h3 className="text-sm font-medium text-foreground">
                    {item.q}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
