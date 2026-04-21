"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

export function ForToolMakers() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <FadeIn>
        <div className="bento-tile grid gap-6 p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <p className="tracking-accent text-white/50">For tool makers</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-hero leading-[0.95] sm:text-5xl lg:text-6xl">
              Built an AI tool?
              <br />
              <span className="text-white/50">Get listed.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              AiCensus is where builders look for tools. Submit yours for free —
              get a detailed listing with description, pros &amp; cons, pricing,
              and category placement.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
            <Link href="/submit" className="w-full sm:w-auto lg:w-full">
              <Button variant="outline" size="lg" className="w-full">
                Submit your tool
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/get-featured" className="w-full sm:w-auto lg:w-full">
              <Button size="lg" className="w-full">
                <Star className="mr-1.5 h-4 w-4" />
                Get featured
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
