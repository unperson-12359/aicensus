import type { Metadata } from "next";
import { ShieldCheck, Search, BarChart3, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, RevealText, StaggerChildren, StaggerItem, PageTransition } from "@/components/motion";
import { GeometricDecor, aboutHeroShapes, sectionShapes } from "@/components/shared/geometric-decor";

export const metadata: Metadata = {
  title: "About AiCensus — Our Mission",
  description:
    "AiCensus is the trusted directory of AI tools. We verify, review, and compare AI products so you can make informed decisions.",
};

const pillars = [
  {
    icon: ShieldCheck,
    title: "Verified Reviews",
    description:
      "Every tool we feature is tested by our team. We verify claims, test functionality, and provide honest assessments you can trust.",
  },
  {
    icon: Search,
    title: "Signal Over Noise",
    description:
      "The AI landscape is overwhelming. We cut through the hype and surface the tools that actually deliver value for your workflow.",
  },
  {
    icon: BarChart3,
    title: "Real Comparisons",
    description:
      "Side-by-side pricing breakdowns, honest pros & cons, and clear use cases. Make decisions based on facts, not marketing.",
  },
  {
    icon: Layers,
    title: "Ecosystem Thinking",
    description:
      "AI tools don't exist in isolation. We map how tools work together to help you build the right AI stack for your needs.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="relative text-center">
          <GeometricDecor shapes={aboutHeroShapes} />
          <RevealText>
            <p className="font-display text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Our Mission
            </p>
          </RevealText>
          <RevealText delay={0.15}>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-hero sm:text-6xl lg:text-7xl">
              The trusted
            </h1>
          </RevealText>
          <RevealText delay={0.3}>
            <h1 className="font-display text-5xl font-bold tracking-hero text-gradient-primary sm:text-6xl lg:text-7xl">
              intelligence layer
            </h1>
          </RevealText>
          <RevealText delay={0.45}>
            <h1 className="font-display text-5xl font-bold tracking-hero sm:text-6xl lg:text-7xl">
              for AI
            </h1>
          </RevealText>

          <FadeIn delay={0.7}>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
              Thousands of AI tools launch every month. AiCensus exists to help you
              find the ones that actually work. We verify, review, and compare AI
              products so you can make informed decisions without the noise.
            </p>
          </FadeIn>
        </div>

        {/* Pillars */}
        <div className="relative">
        <GeometricDecor shapes={sectionShapes} />
        <StaggerChildren className="mt-16 grid gap-6 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <Card className="border-border/50 transition-all duration-300 hover:-translate-y-1 hover:glow-sm">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <pillar.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
        </div>

        {/* Roadmap teaser */}
        <FadeIn className="mt-16">
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
            <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl">
              What&apos;s coming{" "}
              <span className="text-gradient-neon">next</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              AiCensus is evolving into a full AI ecosystem intelligence platform.
            </p>
            <StaggerChildren className="mt-8 grid gap-4 text-left sm:grid-cols-3" staggerDelay={0.15}>
              <StaggerItem>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="font-display font-semibold text-primary">Phase 2</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    AI Product Verification Lab — standardized benchmarks and
                    performance testing
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="font-display font-semibold text-accent">Phase 3</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    AI Ecosystem Map — visualize how AI tools, agents, and models
                    connect
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="font-display font-semibold text-neon">Phase 4</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    AI Stack Builder — find the optimal AI tool combination for your
                    goals
                  </p>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
