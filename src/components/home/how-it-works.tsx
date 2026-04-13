"use client";

import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";

const steps = [
  {
    num: "01",
    title: "Find the right tool",
    description: "Browse 156+ AI tools with honest reviews, pricing, and pros & cons.",
  },
  {
    num: "02",
    title: "Build something with it",
    description: "Use AI tools to code, design, or launch. Deploy anywhere free.",
  },
  {
    num: "03",
    title: "Get discovered",
    description: "Add your project to the AiCensus portfolio. Get a public profile and direct messages.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <h2 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          How it works
        </h2>
      </FadeIn>

      <StaggerChildren className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border/40 md:grid-cols-3">
        {steps.map((step) => (
          <StaggerItem key={step.num}>
            <div className="bg-card p-5 sm:p-6 h-full">
              <span className="font-display text-3xl font-bold text-primary sm:text-4xl">
                {step.num}
              </span>
              <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
