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
            <em className="italic text-white/50">Get featured.</em>
          </h2>
          <p className="mt-4 max-w-xl font-serif text-base italic leading-relaxed text-white/70 sm:text-lg">
            Priority homepage placement, featured badge, higher search ranking,
            category prominence — cancel anytime.
          </p>
        </div>
        <div className="flex lg:col-span-4 lg:justify-end">
          <Link href="/get-featured" className="w-full">
            <Button size="lg" className="w-full">
              <Star className="mr-1.5 h-4 w-4" />
              Get featured
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}
