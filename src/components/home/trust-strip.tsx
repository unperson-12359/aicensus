"use client";

import { FadeIn } from "@/components/motion";

const stats = [
  { value: "156+", label: "Verified Tools" },
  { value: "100%", label: "Human Curated" },
  { value: "Free", label: "Forever" },
  { value: "Open", label: "To Everyone" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border/40">
      <FadeIn>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border/40">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:px-6">
                <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
                <p className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
