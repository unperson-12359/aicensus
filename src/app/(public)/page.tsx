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
import { ForToolMakers } from "@/components/home/for-tool-makers";
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
    "156 handpicked AI tools across 16 categories. Verified reviews, honest comparisons, transparent pricing.",
  openGraph: {
    title: "AiCensus — The curated directory of AI tools",
    description:
      "156 handpicked AI tools across 16 categories. Verified reviews, honest comparisons, transparent pricing.",
  },
};

const sections = [
  { id: "ch-hero", label: "Top" },
  { id: "ch-01", label: "Directory" },
  { id: "ch-02", label: "Picks" },
  { id: "ch-03", label: "Map" },
  { id: "ch-04", label: "Flow" },
  { id: "ch-05", label: "Makers" },
  { id: "ch-06", label: "Join" },
];

const tickerItems = [
  "156 verified AI tools",
  "16 categories",
  "Reviewed by humans",
  "No affiliate noise",
  "Submit yours free",
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";

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
        className="relative flex min-h-[92vh] items-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bento-grid-pattern opacity-30" />

        {/* Ghost watermark */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden pr-6 sm:pr-12 lg:pr-16"
        >
          <span className="select-none font-serif italic text-[40vw] leading-none text-white/[0.035] sm:text-[32vw]">
            Ai
          </span>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
              § 00 · A verified directory · est. 2026
            </p>
          </FadeIn>

          <div className="mt-8">
            <RevealText delay={0.1}>
              <h1 className="font-serif text-[clamp(3.25rem,11vw,11rem)] font-normal leading-[0.92] tracking-[-0.04em] text-foreground">
                Find AI{" "}
                <em className="font-serif italic text-white">tools.</em>
              </h1>
            </RevealText>
            <RevealText delay={0.25}>
              <h1 className="mt-1 font-serif text-[clamp(3.25rem,11vw,11rem)] font-normal leading-[0.92] tracking-[-0.04em] text-white/45">
                Build <em className="font-serif italic">without</em> noise.
              </h1>
            </RevealText>
          </div>

          <FadeIn delay={0.55} direction="up">
            <p className="mt-10 max-w-xl font-serif text-xl italic leading-relaxed text-white/75 sm:text-2xl">
              The curated index of 156 AI tools — reviewed, compared, priced.
            </p>
          </FadeIn>

          <FadeIn delay={0.7} direction="up">
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <form
                action="/tools"
                method="GET"
                className="relative flex-1 sm:max-w-md"
                role="search"
              >
                <label htmlFor="hero-search" className="sr-only">
                  Search AI tools
                </label>
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  id="hero-search"
                  name="q"
                  type="search"
                  placeholder="Search AI tools…"
                  className="h-11 rounded-full border-white/15 bg-black/60 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/40"
                />
              </form>
              <div className="flex gap-2">
                <Link href="/tools" className="flex-1 sm:flex-none">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse tools
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/submit" className="flex-1 sm:flex-none">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Submit yours
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.9}>
            <div className="mt-16 flex items-end gap-10 sm:gap-14">
              <div>
                <div className="font-serif text-5xl italic sm:text-6xl">
                  <AnimatedCounter target={156} suffix="+" />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  AI tools
                </p>
              </div>
              <div className="h-14 w-px bg-white/15" />
              <div>
                <div className="font-serif text-5xl italic sm:text-6xl">
                  <AnimatedCounter target={16} />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Categories
                </p>
              </div>
              <div className="hidden h-14 w-px bg-white/15 sm:block" />
              <div className="hidden sm:block">
                <div className="font-serif text-5xl italic text-white/80 sm:text-6xl">
                  Free
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Forever
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Scroll hint */}
        <FadeIn delay={1.1}>
          <div className="absolute bottom-6 right-6 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 sm:flex">
            <span>Scroll</span>
            <span className="block h-6 w-px animate-scroll-line bg-white/30" />
          </div>
        </FadeIn>
      </section>

      {/* ─────────── § 01 — DIRECTORY ─────────── */}
      <section
        id="ch-01"
        className="relative border-t border-white/10 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="01" label="The directory" />
          </FadeIn>

          <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <RevealText>
                <h2 className="font-serif text-[clamp(2.5rem,8vw,7rem)] font-normal leading-[0.95] tracking-[-0.035em]">
                  156 tools.
                  <br />
                  <em className="italic text-white/50">Handpicked.</em>
                </h2>
              </RevealText>
            </div>
            <FadeIn delay={0.2} className="lg:col-span-5">
              <p className="font-serif text-xl italic leading-relaxed text-white/70 sm:text-2xl">
                Every tool is tested by a human before it ships. No scraping,
                no affiliate grift, no pay-to-rank.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bento-tile p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Reviewed
                  </p>
                  <p className="mt-2 font-serif text-3xl italic">100%</p>
                </div>
                <div className="bento-tile p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Scraped
                  </p>
                  <p className="mt-2 font-serif text-3xl italic">0%</p>
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
          className="relative border-t border-white/10 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <ChapterHeading num="02" label="Editor's picks" />
            </FadeIn>

            <div className="mt-12 flex items-end justify-between gap-4">
              <RevealText>
                <h2 className="font-serif text-[clamp(2.5rem,7vw,6rem)] font-normal leading-[0.95] tracking-[-0.035em]">
                  Featured <em className="italic text-white/50">now</em>.
                </h2>
              </RevealText>
              <Link
                href="/tools"
                className="group shrink-0 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <StaggerChildren className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[1fr]">
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

      {/* ─────────── § 03 — MAP (Categories) ─────────── */}
      {categories.length > 0 && (
        <section
          id="ch-03"
          className="relative border-t border-white/10 py-24 sm:py-32"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-start overflow-hidden pl-4 sm:pl-10"
          >
            <span className="select-none font-serif italic text-[26vw] leading-none text-white/[0.025]">
              map
            </span>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <ChapterHeading num="03" label="The map" />
            </FadeIn>

            <div className="mt-12 flex items-end justify-between gap-4">
              <RevealText>
                <h2 className="font-serif text-[clamp(2.5rem,7vw,6rem)] font-normal leading-[0.95] tracking-[-0.035em]">
                  Browse by <em className="italic text-white/50">category</em>.
                </h2>
              </RevealText>
              <Link
                href="/categories"
                className="group shrink-0 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white"
              >
                All categories
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <StaggerChildren className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <StaggerItem key={category.id}>
                  <CategoryCard category={category} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* ─────────── § 04 — FLOW ─────────── */}
      <section
        id="ch-04"
        className="relative border-t border-white/10 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="04" label="The flow" />
          </FadeIn>

          <div className="mt-12">
            <RevealText>
              <h2 className="font-serif text-[clamp(2.5rem,7vw,6rem)] font-normal leading-[0.95] tracking-[-0.035em]">
                How it <em className="italic text-white/50">works</em>.
              </h2>
            </RevealText>
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* ─────────── § 05 — FOR MAKERS ─────────── */}
      <section
        id="ch-05"
        className="relative border-t border-white/10 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="05" label="For tool makers" />
          </FadeIn>
          <div className="mt-8">
            <ForToolMakers />
          </div>
        </div>
      </section>

      {/* ─────────── § 06 — JOIN / FINAL CTA ─────────── */}
      <section
        id="ch-06"
        className="relative border-t border-white/10 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="06" label="Join" />
          </FadeIn>

          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <RevealText>
                <h2 className="font-serif text-[clamp(3rem,9vw,9rem)] font-normal leading-[0.92] tracking-[-0.04em]">
                  Build. Ship.
                  <br />
                  Get <em className="italic text-white/50">listed</em>.
                </h2>
              </RevealText>
              <FadeIn delay={0.2}>
                <p className="mt-8 max-w-xl font-serif text-xl italic leading-relaxed text-white/70 sm:text-2xl">
                  Browse the index. Submit your own tool. The whole thing is
                  free.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.3} className="lg:col-span-4">
              <div className="flex flex-col gap-3">
                <Link href="/tools">
                  <Button size="lg" className="w-full">
                    Browse tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/submit">
                  <Button size="lg" variant="outline" className="w-full">
                    Submit your tool
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
