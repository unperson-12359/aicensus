import Link from "next/link";
import { ArrowRight, FileText, FolderOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";
import { GeometricDecor, sectionShapes } from "@/components/shared/geometric-decor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Your AI Tool — Get in Front of Builders | AiCensus",
  description:
    "AiCensus is where people discover their next AI tool. Submit yours for free and get a full listing with description, pricing, and pros & cons.",
};

const benefits = [
  {
    icon: FileText,
    title: "Detailed listing",
    description:
      "Full profile with description, screenshots, pricing tiers, and pros & cons. Your tool gets the presentation it deserves.",
  },
  {
    icon: FolderOpen,
    title: "Category placement",
    description:
      "Show up in the right category when builders are browsing. From coding to design to writing — we match you to the right audience.",
  },
  {
    icon: TrendingUp,
    title: "Organic discovery",
    description:
      "Each tool gets its own SEO-optimized page that ranks in search. Builders find you through Google, not just our directory.",
  },
];

const steps = [
  {
    step: "1",
    title: "Submit your tool",
    description: "Fill out a short form with your tool's details, pricing, and what makes it useful.",
  },
  {
    step: "2",
    title: "We review it",
    description: "Our team checks every submission for quality. No bots, no spam, no fake tools.",
  },
  {
    step: "3",
    title: "You're listed",
    description: "Your tool goes live with its own page, shows up in categories, and starts getting traffic.",
  },
];

export default function SubmitFeaturePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Submit a Tool
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl lg:text-6xl">
              Built an AI tool?{" "}
              <span className="text-gradient-primary">
                Get it in front of builders.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              AiCensus is where people discover their next tool. Submit yours
              for free and reach developers, designers, and makers who are
              actively looking.
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="mt-8">
              <Link href="/submit">
                <Button size="lg" className="glow-sm">
                  Submit Your Tool — Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <GeometricDecor shapes={sectionShapes} />
        <StaggerChildren className="grid gap-8 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <StaggerItem key={benefit.title}>
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl">
              How it works
            </h2>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((item) => (
            <StaggerItem key={item.step}>
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-sm font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center sm:p-12">
            <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl">
              Your tool deserves{" "}
              <span className="text-gradient-primary">an audience.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Join the growing AiCensus directory. Free to submit, free to be
              listed. No catch.
            </p>
            <div className="mt-8">
              <Link href="/submit">
                <Button size="lg" className="glow-sm">
                  Submit Your Tool — Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
