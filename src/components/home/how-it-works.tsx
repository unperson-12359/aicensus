"use client";

import { StaggerChildren, StaggerItem } from "@/components/motion";

const steps = [
  {
    num: "01",
    title: "Search the index",
    description:
      "Filter by category, pricing, keyword. Every tool tagged and reviewed.",
  },
  {
    num: "02",
    title: "Compare side-by-side",
    description:
      "Pros, cons, pricing — laid out without marketing spin.",
  },
  {
    num: "03",
    title: "Pick and build",
    description:
      "Direct links, no paywall for picks. Some links support the site — ratings stay editorial.",
  },
];

export function HowItWorks() {
  return (
    <StaggerChildren className="grid gap-3 sm:gap-4 md:grid-cols-3">
      {steps.map((step) => (
        <StaggerItem key={step.num}>
          <div className="bento-tile h-full p-5 sm:p-6">
            <span className="font-serif italic text-5xl font-normal leading-none tracking-hero text-white/25 sm:text-6xl">
              {step.num}
            </span>
            <h3 className="mt-4 text-base font-semibold tracking-tight sm:text-lg">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
