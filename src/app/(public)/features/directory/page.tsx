import Link from "next/link";
import { ArrowRight, Shield, BarChart3, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";
import { GeometricDecor, sectionShapes } from "@/components/shared/geometric-decor";
import { BentoToolGrid } from "@/components/tools/bento-tool-grid";
import { getFeaturedTools } from "@/lib/queries/tools";
import type { ToolWithCategory } from "@/lib/types/database";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI Tools Directory — Find the Right Tool Without the Noise | AiCensus",
  description:
    "156+ curated AI tools with honest reviews, real pricing, and pros & cons. No sponsored rankings. Browse by category and find tools for your exact workflow.",
};

const benefits = [
  {
    icon: Shield,
    title: "Curated, not scraped",
    description:
      "Every tool is reviewed by humans. No SEO spam, no fake entries, no pay-to-play rankings. Just tools that actually work.",
  },
  {
    icon: BarChart3,
    title: "Honest comparisons",
    description:
      "Real pricing tiers, pros & cons, and use case breakdowns. We tell you what a tool is actually good at — and what it's not.",
  },
  {
    icon: FolderOpen,
    title: "16 categories",
    description:
      "From coding assistants to design tools to writing helpers — browse by what you need and find tools for your exact workflow.",
  },
];

export default async function DirectoryFeaturePage() {
  let featuredTools: { tools: ToolWithCategory[]; count: number } = {
    tools: [],
    count: 0,
  };

  try {
    featuredTools = await getFeaturedTools(4);
  } catch {
    // Supabase not configured yet
  }

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
              Directory
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl lg:text-6xl">
              Find the right AI tool —{" "}
              <span className="text-gradient-primary">without the noise.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              156+ curated tools with honest reviews, real pricing, and pros &
              cons. No sponsored rankings. No SEO spam. Just tools that work.
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/tools">
                <Button size="lg" className="glow-sm">
                  Explore AI Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Browse Categories
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

      {/* Featured tools preview */}
      {featuredTools.tools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl">
                A few of our 156+ tools
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                From ChatGPT to niche coding assistants — every tool is
                reviewed and categorized.
              </p>
            </div>
          </FadeIn>
          <div className="mt-12">
            <BentoToolGrid tools={featuredTools.tools} featuredCount={1} />
          </div>
          <FadeIn delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                href="/tools"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all 156+ tools <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </section>
      )}

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center sm:p-12">
            <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl">
              Stop Googling.{" "}
              <span className="text-gradient-primary">Start building.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Find the right AI tool in minutes, not hours. Every listing is
              curated and reviewed by humans.
            </p>
            <div className="mt-8">
              <Link href="/tools">
                <Button size="lg" className="glow-sm">
                  Explore AI Tools
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
