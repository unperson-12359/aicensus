"use client";

import { ShieldCheck, Layers, Heart, Users } from "lucide-react";
import { FadeIn } from "@/components/motion";

const trustItems = [
  { icon: ShieldCheck, text: "Curated by humans" },
  { icon: Layers, text: "156+ verified tools" },
  { icon: Heart, text: "Free forever" },
  { icon: Users, text: "Open to everyone" },
];

export function TrustStrip() {
  return (
    <section>
      <FadeIn>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustItems.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <item.icon className="h-4 w-4 text-primary/70" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
