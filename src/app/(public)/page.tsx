import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCardFeatured } from "@/components/tools/tool-card-featured";
import { ToolCard } from "@/components/tools/tool-card";
import { CategoryCard } from "@/components/categories/category-card";
import { JsonLd } from "@/components/shared/json-ld";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  RevealText,
  AnimatedCounter,
} from "@/components/motion";
import { HowItWorks } from "@/components/home/how-it-works";
import { TopTicker } from "@/components/home/top-ticker";
import { SectionRail } from "@/components/home/section-rail";
import { ChapterHeading } from "@/components/home/chapter-heading";
import { getFeaturedTools } from "@/lib/queries/tools";
import {
  getCategoriesWithToolCount,
  type CategoryWithCount,
} from "@/lib/queries/categories";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600;

export const metadata = {
  title: "AiCensus — The curated directory of AI tools",
  description:
    "151 handpicked AI tools across 19 categories. Verified reviews, honest comparisons, transparent pricing.",
  openGraph: {
    title: "AiCensus — The curated directory of AI tools",
    description:
      "151 handpicked AI tools across 19 categories. Verified reviews, honest comparisons, transparent pricing.",
  },
};

const sections = [
  { id: "ch-hero", label: "Top" },
  { id: "ch-01", label: "Directory" },
  { id: "ch-02", label: "Picks" },
  { id: "ch-03", label: "Map" },
  { id: "ch-04", label: "Flow" },
  { id: "ch-05", label: "Join" },
];

const tickerItems = [
  "151 verified AI tools",
  "19 categories",
  "Reviewed by humans",
  "No affiliate noise",
  "Free forever",
  "Updated weekly",
  "EST. 2026",
];

export default async function HomePage() {
  let featuredTools: { tools: ToolWithCategory[]; count: number } = {
    tools: [],
    count: 0,
  };
  let categories: CategoryWithCount[] = [];

  try {
    [featuredTools, categories] = await Promise.all([
      getFeaturedTools(6),
      getCategoriesWithToolCount(),
    ]);
  } catch {
    // Supabase not configured yet
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AiCensus",
    url: siteUrl,
    description:
      "The curated directory of AI tools — handpicked, reviewed, priced.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AiCensus",
    url: siteUrl,
    logo: `${siteUrl}/opengraph-image`,
    description: "The curated directory of AI tools.",
  };

  const heroFeature = featuredTools.tools[0];
  const secondaryFeatures = featuredTools.tools.slice(1, 5);

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />

      <TopTicker items={tickerItems} />
      <SectionRail sections={sections} />

      {/* ─────────── HERO ─────────── */}
      <section
        id="ch-hero"
        className="relative flex min-h-[62vh] items-center overflow-hidden lg:min-h-[68vh]"
      >
        <div className="pointer-events-none absolute inset-0 bento-grid-pattern opacity-30" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden pr-2 sm:pr-10 lg:pr-16"
        >
          <span className="select-none font-serif italic text-[28vw] leading-none text-white/[0.035] sm:text-[24vw] lg:text-[20vw]">
            Ai
          </span>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-16 lg:items-center">
          <div className="lg:col-span-8">
            <FadeIn>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                § 00 · A verified directory · est. 2026
              </p>
            </FadeIn>

            <div className="mt-5 sm:mt-6">
              <RevealText delay={0.1}>
                <h1 className="font-serif text-[clamp(2.25rem,8vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-foreground">
                  Find AI{" "}
                  <em className="font-serif italic text-white">tools.</em>
                </h1>
              </RevealText>
              <RevealText delay={0.25}>
                <h1 className="font-serif text-[clamp(2.25rem,8vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-white/45">
                  Build <em className="font-serif italic">without</em> noise.
                </h1>
              </RevealText>
            </div>

            <FadeIn delay={0.55} direction="up">
              <p className="mt-5 max-w-xl font-serif text-base italic leading-relaxed text-white/75 sm:mt-6 sm:text-lg">
                The curated index of 151 AI tools — reviewed, compared, priced.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.6} className="lg:col-span-4">
            <div className="flex flex-col gap-4">
              <form action="/tools" method="GET" className="relative" role="search">
                <label htmlFor="hero-search" className="sr-only">
                  Search AI tools
                </label>
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  id="hero-search"
                  name="q"
                  type="search"
                  placeholder="Search AI tools…"
                  className="h-10 w-full rounded-full border-white/15 bg-black/60 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/40"
                />
              </form>

              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Link href="/tools" className="flex-1">
                  <Button size="default" className="w-full">
                    Browse tools
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/categories" className="flex-1">
                  <Button size="default" variant="outline" className="w-full">
                    Explore categories
                  </Button>
                </Link>
              </div>

              <Link
                href="/stacks"
                className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white sm:text-[11px]"
              >
                or build from a → recipe
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                <div>
                  <div className="font-serif text-2xl italic sm:text-3xl">
                    <AnimatedCounter target={151} />
                  </div>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                    Tools
                  </p>
                </div>
                <div>
                  <div className="font-serif text-2xl italic sm:text-3xl">
                    <AnimatedCounter target={19} />
                  </div>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                    Cats
                  </p>
                </div>
                <div>
                  <div className="font-serif text-2xl italic text-white/80 sm:text-3xl">
                    Free
                  </div>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                    Forever
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────── § 01 — DIRECTORY (tight) ─────────── */}
      <section
        id="ch-01"
        className="relative border-t border-white/10 py-10 sm:py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="01" label="The directory" />
          </FadeIn>

          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end sm:mt-8">
            <div className="lg:col-span-7">
              <RevealText>
                <h2 className="font-serif text-[clamp(1.75rem,4.5vw,3.25rem)] font-normal leading-[1] tracking-[-0.03em]">
                  151 tools.{" "}
                  <em className="italic text-white/50">Handpicked.</em>
                </h2>
              </RevealText>
              <FadeIn delay={0.15}>
                <p className="mt-3 max-w-xl font-serif text-base italic leading-relaxed text-white/70">
                  Every tool tested by a human. No scraping, no affiliate
                  grift, no pay-to-rank.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.2} className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bento-tile p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Reviewed
                  </p>
                  <p className="mt-1 font-serif text-xl italic sm:text-2xl">
                    100%
                  </p>
                </div>
                <div className="bento-tile p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Scraped
                  </p>
                  <p className="mt-1 font-serif text-xl italic sm:text-2xl">
                    0%
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────── § 02 — FEATURED ─────────── */}
      {featuredTools.tools.length > 0 && (
        <section
          id="ch-02"
          className="relative border-t border-white/10 py-10 sm:py-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <ChapterHeading num="02" label="Editor's picks" />
            </FadeIn>

            <div className="mt-6 flex items-end justify-between gap-4 sm:mt-8">
              <RevealText>
                <h2 className="font-serif text-[clamp(1.75rem,4.5vw,3.25rem)] font-normal leading-[1] tracking-[-0.03em]">
                  Featured <em className="italic text-white/50">now</em>.
                </h2>
              </RevealText>
              <Link
                href="/tools"
                className="group shrink-0 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white sm:text-[11px]"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <StaggerChildren className="mt-6 grid gap-3 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[1fr]">
              {heroFeature && (
                <StaggerItem className="lg:col-span-8 lg:row-span-2">
                  <ToolCardFeatured tool={heroFeature} />
                </StaggerItem>
              )}
              {secondaryFeatures.slice(0, 2).map((tool) => (
                <StaggerItem key={tool.id} className="lg:col-span-4">
                  <ToolCard tool={tool} />
                </StaggerItem>
              ))}
              {secondaryFeatures.slice(2, 4).map((tool) => (
                <StaggerItem key={tool.id} className="lg:col-span-6">
                  <ToolCard tool={tool} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* ─────────── § 03 — MAP ─────────── */}
      {categories.length > 0 && (
        <section
          id="ch-03"
          className="relative overflow-hidden border-t border-white/10 py-10 sm:py-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-start overflow-hidden pl-2 sm:pl-6"
          >
            <span className="select-none font-serif italic text-[18vw] leading-none text-white/[0.025] sm:text-[16vw]">
              map
            </span>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <ChapterHeading num="03" label="The map" />
            </FadeIn>

            <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-12 lg:items-start lg:gap-8">
              <div className="lg:col-span-4 lg:sticky lg:top-20 lg:self-start">
                <RevealText>
                  <h2 className="font-serif text-[clamp(1.75rem,4.5vw,3.25rem)] font-normal leading-[1] tracking-[-0.03em]">
                    Browse by{" "}
                    <em className="italic text-white/50">category</em>.
                  </h2>
                </RevealText>
                <FadeIn delay={0.15}>
                  <p className="mt-3 font-serif text-base italic leading-relaxed text-white/70">
                    From writing to code to video — every vertical, mapped.
                  </p>
                  <Link
                    href="/categories"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white sm:text-[11px]"
                  >
                    All categories
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </FadeIn>
              </div>

              <StaggerChildren className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:col-span-8 lg:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => (
                  <StaggerItem key={category.id}>
                    <CategoryCard category={category} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── § 04 — FLOW ─────────── */}
      <section
        id="ch-04"
        className="relative border-t border-white/10 py-10 sm:py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="04" label="The flow" />
          </FadeIn>

          <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="lg:col-span-4">
              <RevealText>
                <h2 className="font-serif text-[clamp(1.75rem,4.5vw,3.25rem)] font-normal leading-[1] tracking-[-0.03em]">
                  How it <em className="italic text-white/50">works</em>.
                </h2>
              </RevealText>
              <FadeIn delay={0.15}>
                <p className="mt-3 font-serif text-base italic leading-relaxed text-white/70">
                  Three steps from landing here to shipping with the right
                  tool.
                </p>
              </FadeIn>
            </div>
            <div className="lg:col-span-8">
              <HowItWorks />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── § 05 — FINAL CTA ─────────── */}
      <section
        id="ch-05"
        className="relative border-t border-white/10 py-10 sm:py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="05" label="Start" />
          </FadeIn>

          <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-8">
              <RevealText>
                <h2 className="font-serif text-[clamp(2rem,5.5vw,4.25rem)] font-normal leading-[0.98] tracking-[-0.035em]">
                  Find your{" "}
                  <em className="italic text-white/50">stack</em>.
                </h2>
              </RevealText>
              <FadeIn delay={0.15}>
                <p className="mt-4 max-w-xl font-serif text-base italic leading-relaxed text-white/70">
                  Browse the index. Build from a recipe. All free.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.25} className="lg:col-span-4">
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Link href="/tools" className="flex-1">
                  <Button size="default" className="w-full">
                    Browse tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/stacks" className="flex-1">
                  <Button size="default" variant="outline" className="w-full">
                    Browse stacks
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
