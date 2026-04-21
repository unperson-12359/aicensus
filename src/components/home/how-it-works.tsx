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
    description:
      "Add your project to the AiCensus portfolio. Get a public profile and direct messages.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <FadeIn>
        <div>
          <p className="tracking-accent text-white/50">The flow</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-hero sm:text-5xl lg:text-6xl">
            How it works
          </h2>
        </div>
      </FadeIn>

      <StaggerChildren className="mt-10 grid gap-3 sm:gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <StaggerItem key={step.num}>
            <div className="bento-tile h-full p-6 sm:p-7">
              <span className="font-display text-5xl font-bold tracking-hero text-white/25 sm:text-6xl">
                {step.num}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
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
