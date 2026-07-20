import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/categories/category-card";
import { JsonLd } from "@/components/shared/json-ld";
import { SavedHomePanel } from "@/components/saved/saved-home-panel";
import { HomeToolsSection } from "@/components/home/home-tools-section";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  RevealText,
  AnimatedCounter,
} from "@/components/motion";
import { HowItWorks } from "@/components/home/how-it-works";
import { SectionRail } from "@/components/home/section-rail";
import { ChapterHeading } from "@/components/home/chapter-heading";
import { section } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  getCatalogStats,
  getFeaturedTools,
  getRecentTools,
} from "@/lib/queries/tools";
import {
  getCategoriesWithToolCount,
  type CategoryWithCount,
} from "@/lib/queries/categories";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600;

const FALLBACK_CATALOG_STATS = {
  toolCount: 204,
  categoryCount: 19,
};

async function getSafeCatalogStats() {
  try {
    return await getCatalogStats();
  } catch {
    return FALLBACK_CATALOG_STATS;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { toolCount, categoryCount } = await getSafeCatalogStats();
  const description = `${toolCount} handpicked AI tools across ${categoryCount} categories. Verified reviews, honest comparisons, transparent pricing.`;

  return {
    title: "AiCensus - The curated directory of AI tools",
    description,
    openGraph: {
      title: "AiCensus - The curated directory of AI tools",
      description,
    },
    alternates: {
      canonical: "/",
    },
  };
}

const sections = [
  { id: "ch-hero", label: "Top" },
  { id: "ch-01", label: "Tools" },
  { id: "ch-02", label: "Map" },
  { id: "ch-03", label: "Flow" },
  { id: "ch-04", label: "Join" },
];

export default async function HomePage() {
  let featuredTools: { tools: ToolWithCategory[]; count: number } = {
    tools: [],
    count: 0,
  };
  let recentTools: { tools: ToolWithCategory[]; count: number } = {
    tools: [],
    count: 0,
  };
  let categories: CategoryWithCount[] = [];
  let catalogStats = FALLBACK_CATALOG_STATS;

  try {
    [featuredTools, recentTools, categories, catalogStats] = await Promise.all([
      getFeaturedTools(6),
      getRecentTools(8),
      getCategoriesWithToolCount(),
      getCatalogStats(),
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

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />

      <SectionRail sections={sections} />

      {/* ─────────── HERO ─────────── */}
      <section
        id="ch-hero"
        className="relative flex min-h-[52vh] items-center overflow-hidden sm:min-h-[58vh] lg:min-h-[68vh]"
      >
        <div className="pointer-events-none absolute inset-0 bento-grid-pattern opacity-30" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden pr-2 sm:pr-10 lg:pr-16"
        >
          <span className="select-none font-serif italic text-[22vw] leading-none text-white/[0.02] sm:text-[24vw] sm:text-white/[0.035] lg:text-[20vw]">
            Ai
          </span>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-16 lg:items-center">
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
                The curated index of {catalogStats.toolCount} AI tools — reviewed, compared, priced.
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
                href="/compare"
                className="group hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white sm:inline-flex sm:text-[11px]"
              >
                or compare tools side-by-side
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/best"
                className="group hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white sm:inline-flex sm:text-[11px]"
              >
                or browse best-of guides
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/stacks"
                className="group hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white sm:inline-flex sm:text-[11px]"
              >
                or build from a → recipe
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <div className="flex flex-wrap gap-2 sm:hidden">
                <Link
                  href="/compare"
                  className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55 hover:border-white/35 hover:text-white"
                >
                  Compare
                </Link>
                <Link
                  href="/best"
                  className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55 hover:border-white/35 hover:text-white"
                >
                  Best
                </Link>
                <Link
                  href="/stacks"
                  className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55 hover:border-white/35 hover:text-white"
                >
                  Stacks
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                <div>
                  <div className="font-serif text-2xl italic sm:text-3xl">
                    <AnimatedCounter target={catalogStats.toolCount} />
                  </div>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                    Tools
                  </p>
                </div>
                <div>
                  <div className="font-serif text-2xl italic sm:text-3xl">
                    <AnimatedCounter target={catalogStats.categoryCount} />
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

      {/* ─────────── § 01 — TOOLS ─────────── */}
      {(featuredTools.tools.length > 0 || recentTools.tools.length > 0) && (
        <section
          id="ch-01"
          className={cn("relative border-t border-white/10", section.y)}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <ChapterHeading num="01" label="Tools" />
            </FadeIn>

            <div className={section.inner}>
              <HomeToolsSection
                featuredTools={featuredTools.tools}
                recentTools={recentTools.tools}
              />
            </div>
          </div>
        </section>
      )}

      {/* ─────────── § 02 — MAP ─────────── */}
      {categories.length > 0 && (
        <section
          id="ch-02"
          className={cn("relative overflow-hidden border-t border-white/10", section.y)}
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
              <ChapterHeading num="02" label="The map" />
            </FadeIn>

            <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8", section.inner)}>
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
                {categories.slice(0, 12).map((category, i) => (
                  <StaggerItem
                    key={category.id}
                    className={cn(
                      i >= 6 && i < 9 && "hidden lg:block",
                      i >= 9 && "hidden xl:block"
                    )}
                  >
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
        id="ch-03"
        className={cn("relative border-t border-white/10", section.y)}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="03" label="The flow" />
          </FadeIn>

          <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8", section.inner)}>
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

      {/* ─────────── § 04 — JOIN ─────────── */}
      <section id="ch-04" className={cn("relative border-t border-white/10", section.y)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <ChapterHeading num="04" label="Start" />
          </FadeIn>

          <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8", section.inner)}>
            <div className="lg:col-span-8">
              <RevealText>
                <h2 className="font-serif text-[clamp(1.75rem,5vw,4.25rem)] font-normal leading-[0.98] tracking-[-0.035em]">
                  Keep exploring{" "}
                  <em className="italic text-white/50">your way</em>.
                </h2>
              </RevealText>
              <FadeIn delay={0.15}>
                <p className="mt-3 max-w-xl font-serif text-base italic leading-relaxed text-white/70 sm:mt-4">
                  Compare tools, save a shortlist, or jump into a stack recipe.
                </p>
              </FadeIn>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                <Link
                  href="/compare"
                  className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                >
                  Compare
                </Link>
                <Link
                  href="/best"
                  className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                >
                  Best
                </Link>
                <Link
                  href="/stacks"
                  className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                >
                  Stacks
                </Link>
                <Link
                  href="/mcps"
                  className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                >
                  MCPs
                </Link>
              </div>
            </div>
            <FadeIn delay={0.25} className="lg:col-span-4">
              <Link href="/tools" className="block">
                <Button size="default" className="w-full">
                  Browse all tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      <SavedHomePanel />
    </>
  );
}
