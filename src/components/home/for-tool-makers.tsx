"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

export function ForToolMakers() {
  return (
    <FadeIn>
      <div className="bento-tile grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-10">
        <div className="lg:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
            For tool makers
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.875rem,5.5vw,3.75rem)] font-normal leading-[0.95] tracking-[-0.035em]">
            Built an AI tool?
            <br />
            <em className="italic text-white/50">Get listed.</em>
          </h2>
          <p className="mt-4 max-w-xl font-serif text-base italic leading-relaxed text-white/70 sm:text-lg">
            Free listing with full description, pros &amp; cons, pricing, and
            category placement. Get featured for priority homepage spots.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:col-span-4 lg:flex-col">
          <Link href="/submit" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Submit your tool
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/get-featured" className="flex-1">
            <Button size="lg" className="w-full">
              <Star className="mr-1.5 h-4 w-4" />
              Get featured
            </Button>
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}
