"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

export function ForToolMakers() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Built an AI tool?{" "}
            <span className="text-gradient-primary uppercase">Get listed.</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            AiCensus is where builders look for tools. Submit yours for free — get a detailed listing with description, pros & cons, pricing, and category placement.
          </p>
          <div className="mt-6 flex gap-2">
            <Link href="/submit">
              <Button variant="outline">
                Submit Your Tool <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/get-featured">
              <Button>
                <Star className="mr-1.5 h-3.5 w-3.5" />
                Get Featured
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
