import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Tag,
  MousePointerClick,
  Activity,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, RevealText, StaggerChildren, StaggerItem, PageTransition } from "@/components/motion";
import { GeometricDecor, aboutHeroShapes, sectionShapes } from "@/components/shared/geometric-decor";

export const metadata: Metadata = {
  title: "How We Rate AI Tools — Methodology",
  description:
    "The AiCensus editor rating is an editorial score out of 5, based on hands-on review of output quality, pricing fairness, ease of use, reliability, privacy practices, and pace of development.",
  openGraph: {
    title: "How We Rate AI Tools — AiCensus Methodology",
    description:
      "What the AiCensus editor rating means, the criteria behind it, and how scores are assigned and revisited.",
    url: "/how-we-rate",
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Rate AI Tools — AiCensus Methodology",
    description:
      "What the AiCensus editor rating means and how scores are assigned.",
  },
  alternates: {
    canonical: "/how-we-rate",
  },
};

const criteria = [
  {
    icon: Sparkles,
    title: "Output quality",
    description:
      "Does the tool actually do what it claims? We judge the quality and consistency of its core output against what a reasonable user would expect.",
  },
  {
    icon: Tag,
    title: "Pricing fairness",
    description:
      "We weigh the price against the value delivered, and reward generous free tiers. A great tool with a predatory pricing model scores lower.",
  },
  {
    icon: MousePointerClick,
    title: "Ease of use",
    description:
      "Onboarding, interface clarity, and how quickly a new user can get a real result — without reading a manual.",
  },
  {
    icon: Activity,
    title: "Reliability & track record",
    description:
      "Uptime history, stability under load, and whether the company has a track record of keeping its product — and its users' work — available.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & data practices",
    description:
      "How the tool handles your data: training-on-your-input policies, retention, deletion controls, and clarity of its privacy terms.",
  },
  {
    icon: Rocket,
    title: "Pace of development",
    description:
      "Is the tool actively maintained and improving? Stalled products lose ground to fast-moving competitors, and the score reflects that.",
  },
];

export default function HowWeRatePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Hero */}
        <div className="relative">
          <GeometricDecor shapes={aboutHeroShapes} />
          <RevealText>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
              Methodology
            </p>
          </RevealText>
          <RevealText delay={0.1}>
            <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl md:text-5xl">
              How we <em className="italic text-white/60">rate</em>.
            </h1>
          </RevealText>

          <FadeIn delay={0.3}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every tool page on AiCensus shows an editor rating — a score out
              of 5 assigned by our editorial team. This page explains exactly
              what that number means, what goes into it, and just as
              importantly, what it doesn&apos;t.
            </p>
          </FadeIn>
        </div>

        {/* What the score means */}
        <FadeIn className="mt-10">
          <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] sm:text-3xl">
            What the score <em className="italic text-white/60">means</em>.
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              The editor rating is the AiCensus editorial team&apos;s overall
              assessment of a tool, on a scale of 1 to 5. A 4.7 means
              &ldquo;our editors consider this one of the strongest options in
              its category right now&rdquo; — nothing more, and nothing less.
            </p>
            <p>
              It is <strong className="text-foreground">not a user review score</strong>.
              We don&apos;t aggregate crowd ratings, and it is{" "}
              <strong className="text-foreground">not a lab measurement</strong>.
              We don&apos;t run standardized benchmark harnesses on these
              tools (yet — that&apos;s on{" "}
              <Link href="/about" className="underline decoration-white/30 underline-offset-2 hover:text-foreground">
                our roadmap
              </Link>
              ). The number is an informed editorial opinion, and you should
              read it that way.
            </p>
          </div>
        </FadeIn>

        {/* Criteria */}
        <div className="relative mt-10">
          <GeometricDecor shapes={sectionShapes} />
          <FadeIn>
            <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] sm:text-3xl">
              What we <em className="italic text-white/60">look at</em>.
            </h2>
          </FadeIn>
          <StaggerChildren className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {criteria.map((criterion) => (
              <StaggerItem key={criterion.title}>
                <Card className="bento-tile h-full transition-all duration-300 hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <criterion.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <h3 className="mt-3 font-semibold tracking-tight">{criterion.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {criterion.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        {/* How scores are assigned */}
        <FadeIn className="mt-10">
          <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] sm:text-3xl">
            How scores get <em className="italic text-white/60">assigned</em>.
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              An editor reviews each tool before it&apos;s listed, using it
              hands-on where practical — signing up, running real tasks through
              it, and comparing the experience against alternatives in the same
              category. Where hands-on access isn&apos;t possible (enterprise
              plans, gated betas), we base the assessment on documentation,
              verified public demonstrations, and the tool&apos;s track record,
              and we&apos;re more conservative with the score.
            </p>
            <p>
              The criteria above aren&apos;t plugged into a formula. They&apos;re
              the checklist our editors argue about; the final number is a
              judgment call, not a calculation. Tools are never able to pay for
              a higher rating.
            </p>
          </div>
        </FadeIn>

        {/* Revisiting scores */}
        <FadeIn className="mt-10">
          <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] sm:text-3xl">
            When scores <em className="italic text-white/60">change</em>.
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              AI tools move fast, so ratings are living numbers. We revisit a
              score when a tool ships a major update, changes its pricing or
              free tier, has a notable reliability or privacy incident, or when
              the competitive landscape shifts enough that the old score no
              longer reflects reality. There&apos;s no fixed review calendar —
              updates are driven by what actually changes.
            </p>
            <p>
              Think a rating is off?{" "}
              <Link href="/contact" className="underline decoration-white/30 underline-offset-2 hover:text-foreground">
                Tell us
              </Link>
              . Specific, experience-based feedback from real users is one of
              the strongest signals we use when deciding what to re-review.
            </p>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
