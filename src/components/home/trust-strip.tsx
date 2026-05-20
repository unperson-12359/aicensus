"use client";

import { FadeIn } from "@/components/motion";

const stats = [
  { value: "200+", label: "Verified tools" },
  { value: "100%", label: "Human curated" },
  { value: "Free", label: "Forever" },
  { value: "Open", label: "To everyone" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-background">
      <FadeIn>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:px-6">
                <div className="font-display text-3xl font-bold tracking-hero sm:text-4xl">
                  {stat.value}
                </div>
                <p className="mt-1.5 tracking-accent text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
