import type { Metadata } from "next";
import { ShieldCheck, Search, BarChart3, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/shared/json-ld";
import { FadeIn, RevealText, StaggerChildren, StaggerItem, PageTransition } from "@/components/motion";
import { GeometricDecor, aboutHeroShapes, sectionShapes } from "@/components/shared/geometric-decor";

export const metadata: Metadata = {
  title: "About AiCensus — Our Mission",
  description:
    "AiCensus is the trusted directory of AI tools. We verify, review, and compare AI products so you can make informed decisions.",
  openGraph: {
    title: "About AiCensus — Our Mission",
    description:
      "AiCensus is the trusted directory of AI tools. We verify, review, and compare AI products so you can make informed decisions.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About AiCensus — Our Mission",
    description:
      "We verify, review, and compare AI products so you can make informed decisions.",
  },
  alternates: {
    canonical: "/about",
  },
};

const pillars = [
  {
    icon: ShieldCheck,
    title: "Verified Reviews",
    description:
      "Every tool we feature is tested by our team. We verify claims, test functionality, and provide honest assessments you can trust.",
  },
  {
    icon: Search,
    title: "Signal Over Noise",
    description:
      "The AI landscape is overwhelming. We cut through the hype and surface the tools that actually deliver value for your workflow.",
  },
  {
    icon: BarChart3,
    title: "Real Comparisons",
    description:
      "Side-by-side pricing breakdowns, honest pros & cons, and clear use cases. Make decisions based on facts, not marketing.",
  },
  {
    icon: Layers,
    title: "Ecosystem Thinking",
    description:
      "AI tools don't exist in isolation. We map how tools work together to help you build the right AI stack for your needs.",
  },
];

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AiCensus",
    url: siteUrl,
    logo: `${siteUrl}/opengraph-image`,
    description:
      "AiCensus is the trusted directory of AI tools. We verify, review, and compare AI products so you can make informed decisions.",
    foundingDate: "2026",
    knowsAbout: [
      "Artificial Intelligence",
      "AI Tools",
      "AI Software Reviews",
      "Machine Learning",
    ],
  };

  return (
    <>
    <JsonLd data={organizationJsonLd} />
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Hero */}
        <div className="relative">
          <GeometricDecor shapes={aboutHeroShapes} />
          <RevealText>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
              Our mission
            </p>
          </RevealText>
          <RevealText delay={0.1}>
            <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl md:text-5xl">
              The trusted <em className="italic text-white/60">intelligence layer</em> for AI.
            </h1>
          </RevealText>

          <FadeIn delay={0.3}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Thousands of AI tools launch every month. AiCensus exists to help
              you find the ones that actually work — verified, reviewed, and
              compared without the noise.
            </p>
          </FadeIn>
        </div>

        {/* Pillars */}
        <div className="relative">
        <GeometricDecor shapes={sectionShapes} />
        <StaggerChildren className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <Card className="bento-tile transition-all duration-300 hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <pillar.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <h3 className="mt-3 font-semibold tracking-tight">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
        </div>

        {/* Roadmap teaser */}
        <FadeIn className="mt-10">
          <div className="bento-tile p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] sm:text-3xl">
              What&apos;s coming <em className="italic text-white/60">next</em>.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              AiCensus is evolving into a full AI ecosystem intelligence platform.
            </p>
            <StaggerChildren className="mt-6 grid gap-3 sm:grid-cols-3" staggerDelay={0.12}>
              <StaggerItem>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="tracking-accent text-white/50">Phase 2</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    AI Product Verification Lab — standardized benchmarks and
                    performance testing
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="tracking-accent text-white/50">Phase 3</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    AI Ecosystem Map — visualize how AI tools, agents, and models
                    connect
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="tracking-accent text-white/50">Phase 4</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    AI Stack Builder — find the optimal AI tool combination for your
                    goals
                  </p>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
    </>
  );
}
