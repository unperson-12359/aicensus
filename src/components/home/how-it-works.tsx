"use client";

import { Search, Rocket, Eye } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";

const steps = [
  {
    icon: Search,
    title: "Find the right tool",
    description:
      "Browse 156+ AI tools with honest reviews, pricing, and pros & cons. No sponsored rankings.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Rocket,
    title: "Build something with it",
    description:
      "Use AI tools to code, design, or launch. Deploy to Vercel, Netlify — anywhere free.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Eye,
    title: "Get discovered",
    description:
      "Add your project to the AiCensus portfolio. Get a public profile, live preview, and direct messages from collaborators.",
    color: "text-neon",
    bg: "bg-neon/10",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-display sm:text-2xl">
            From discovery to recognition
          </h2>
        </div>
      </FadeIn>

      <StaggerChildren className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <StaggerItem key={step.title}>
            <div className="relative rounded-lg border border-border/40 bg-card p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${step.bg}`}
                >
                  <step.icon className={`h-4 w-4 ${step.color}`} />
                </div>
                <span className="text-sm font-mono text-muted-foreground/50">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
