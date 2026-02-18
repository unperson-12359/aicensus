import Link from "next/link";
import { ArrowRight, User, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";
import { GeometricDecor, sectionShapes } from "@/components/shared/geometric-decor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Builder Portfolio — AiCensus",
  description:
    "Showcase your AI-built projects to the world. Get a free public profile at aicensus.xyz/portfolio/your-name. No domain needed. No audience required.",
};

const benefits = [
  {
    icon: User,
    title: "Free public profile",
    description:
      "Get aicensus.xyz/portfolio/your-name with your bio, links, and project gallery. No domain to buy, no hosting to set up.",
  },
  {
    icon: Eye,
    title: "Get discovered",
    description:
      "Show up in the AiCensus portfolio gallery. Other builders, collaborators, and potential clients can find your work.",
  },
  {
    icon: MessageSquare,
    title: "Receive messages",
    description:
      "Visitors can contact you directly through your portfolio. No need to share your email publicly.",
  },
];

const examples = [
  { name: "Alex Chen", role: "Full-Stack Developer", projects: 4 },
  { name: "Sara Kim", role: "AI Product Designer", projects: 7 },
  { name: "Jordan Lee", role: "Indie Maker", projects: 3 },
];

export default function PortfolioFeaturePage() {
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
              Portfolio
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl lg:text-6xl">
              Showcase your AI-built projects{" "}
              <span className="text-gradient-primary">to the world.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              No domain. No audience. No gatekeepers. Create a free portfolio,
              add your projects, and let the work speak for itself.
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="glow-sm">
                  Create Your Portfolio — Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg">
                  Browse Portfolios
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

      {/* Example portfolios */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl">
              Join builders already on AiCensus
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Developers, designers, and indie makers use AiCensus to showcase
              what they&apos;ve built with AI tools.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-3">
          {examples.map((example) => (
            <StaggerItem key={example.name}>
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-primary/15 to-accent/15" />
                <div className="px-5 pb-5 pt-0">
                  <div className="-mt-8 mb-3 flex h-14 w-14 items-center justify-center rounded-lg border-2 border-background bg-muted text-lg font-bold text-muted-foreground">
                    {example.name.charAt(0)}
                  </div>
                  <p className="font-semibold">{example.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {example.role}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {example.projects} projects showcased
                  </p>
                </div>
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
              Ready to show your work?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              It takes less than 2 minutes to set up. Add projects whenever
              you&apos;re ready.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="glow-sm">
                  Get Started — Free
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
