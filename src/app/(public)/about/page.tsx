import type { Metadata } from "next";
import { ShieldCheck, Search, BarChart3, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          The trusted{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            intelligence layer
          </span>{" "}
          for AI
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Thousands of AI tools launch every month. AiCensus exists to help you
          find the ones that actually work. We verify, review, and compare AI
          products so you can make informed decisions without the noise.
        </p>
      </div>

      {/* Pillars */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <pillar.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {pillar.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roadmap teaser */}
      <div className="mt-16 rounded-2xl border border-border/50 bg-card p-8 text-center">
        <h2 className="text-2xl font-bold">What&apos;s coming next</h2>
        <p className="mt-3 text-muted-foreground">
          AiCensus is evolving into a full AI ecosystem intelligence platform.
        </p>
        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-semibold text-primary">Phase 2</p>
            <p className="mt-1 text-sm text-muted-foreground">
              AI Product Verification Lab — standardized benchmarks and
              performance testing
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-semibold text-accent">Phase 3</p>
            <p className="mt-1 text-sm text-muted-foreground">
              AI Ecosystem Map — visualize how AI tools, agents, and models
              connect
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-semibold text-neon">Phase 4</p>
            <p className="mt-1 text-sm text-muted-foreground">
              AI Stack Builder — find the optimal AI tool combination for your
              goals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
