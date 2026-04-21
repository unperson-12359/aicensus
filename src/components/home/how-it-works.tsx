"use client";

import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";

const steps = [
  {
    num: "01",
    title: "Search the index",
    description:
      "Filter by category, pricing, or keyword. Every tool is tagged, reviewed, and tested.",
  },
  {
    num: "02",
    title: "Compare, side-by-side",
    description:
      "Pros, cons, pricing, integrations — laid out so you can pick without the marketing spin.",
  },
  {
    num: "03",
    title: "Pick and build",
    description:
      "Direct links to the tool. No affiliate redirects, no paywall for recommendations.",
  },
];

export function HowItWorks() {
  return (
    <StaggerChildren className="mt-12 grid gap-3 sm:gap-4 md:grid-cols-3">
      {steps.map((step) => (
        <StaggerItem key={step.num}>
          <FadeIn>
            <div className="bento-tile h-full p-6 sm:p-7">
              <span className="font-serif italic text-6xl font-normal tracking-hero text-white/25 sm:text-7xl">
                {step.num}
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </FadeIn>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
