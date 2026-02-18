"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, FolderOpen, Globe, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";

const benefits = [
  {
    icon: FolderOpen,
    title: "Detailed listing",
    description: "Full profile with description, pros & cons, and pricing",
  },
  {
    icon: BarChart3,
    title: "Category placement",
    description: "Show up where builders are browsing by use case",
  },
  {
    icon: Globe,
    title: "Organic traffic",
    description: "Get discovered through search and directory browsing",
  },
];

export function ForToolMakers() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <FadeIn>
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl">
            Built an AI tool?{" "}
            <span className="text-gradient-primary">Get listed.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
            AiCensus is where builders look for tools. Submit yours for free and
            get in front of the right audience.
          </p>
        </div>
      </FadeIn>

      <StaggerChildren className="mt-10 grid gap-6 sm:grid-cols-3">
        {benefits.map((benefit) => (
          <StaggerItem key={benefit.title}>
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 font-medium">{benefit.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.3}>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/features/submit">
            <Button variant="outline" size="lg">
              Submit Your Tool <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/get-featured">
            <Button size="lg" className="glow-sm">
              <Star className="mr-2 h-4 w-4" />
              Get Featured
            </Button>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
