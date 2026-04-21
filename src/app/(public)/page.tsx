import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search, Sparkles } from "lucide-react";
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
  AnimatedCounter,
} from "@/components/motion";
import { HowItWorks } from "@/components/home/how-it-works";
import { PortfolioShowcase } from "@/components/home/portfolio-showcase";
import { TrustStrip } from "@/components/home/trust-strip";
import { ForToolMakers } from "@/components/home/for-tool-makers";
import { getFeaturedTools } from "@/lib/queries/tools";
import {
  getCategoriesWithToolCount,
  type CategoryWithCount,
} from "@/lib/queries/categories";
import { getPortfolioUsers } from "@/lib/queries/portfolios";
import type { ToolWithCategory, UserProfile } from "@/lib/types/database";

export const revalidate = 3600;

export const metadata = {
  title: "AiCensus — Discover AI Tools & Showcase What You Build",
  description:
    "The curated directory of 156+ AI tools with honest reviews. Plus a free portfolio to showcase your AI-built projects. Find tools. Build. Get noticed.",
  openGraph: {
    title: "AiCensus — Discover AI Tools & Showcase What You Build",
    description:
      "The curated directory of 156+ AI tools with honest reviews. Plus a free portfolio to showcase your AI-built projects.",
  },
};

export default async function HomePage() {
  let featuredTools: { tools: ToolWithCategory[]; count: number } = {
    tools: [],
    count: 0,
  };
  let categories: CategoryWithCount[] = [];
  let portfolioUsers: UserProfile[] = [];

  try {
    [featuredTools, categories] = await Promise.all([
      getFeaturedTools(6),
      getCategoriesWithToolCount(),
    ]);
  } catch {
    // Supabase not configured yet
  }

  try {
    const result = await getPortfolioUsers({ limit: 4 });
    portfolioUsers = result.users;
  } catch {
    // No portfolio users yet
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AiCensus",
    url: siteUrl,
    description:
      "The curated directory of AI tools — plus a portfolio to showcase what you build with them.",
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
    description:
      "The curated directory of AI tools. Discover, build, and showcase your work.",
  };

  const heroFeature = featuredTools.tools[0];
  const secondaryFeatures = featuredTools.tools.slice(1, 5);

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />

      {/* ──────────────────────────────────────────────────────────
          BENTO HERO
         ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12 lg:px-8">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[1fr]">
          {/* Hero headline tile */}
          <FadeIn className="lg:col-span-8 lg:row-span-2">
            <div className="bento-tile relative flex h-full flex-col justify-between overflow-hidden p-8 sm:p-12">
              <div className="absolute inset-0 bento-grid-pattern opacity-40 pointer-events-none" />

              <div className="relative">
                <p className="tracking-accent text-white/60">
                  AI tools directory · est. 2026
                </p>
                <h1 className="mt-6 font-display text-5xl font-bold leading-[0.92] tracking-hero sm:text-7xl lg:text-8xl">
                  Find AI tools.
                  <br />
                  Build with them.
                  <br />
                  <span className="text-white/40">Get noticed.</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                  The curated directory of 156+ AI tools — plus a free portfolio
                  to showcase what you build.
                </p>
              </div>

              <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <form
                  action="/tools"
                  method="GET"
                  className="relative flex-1 sm:max-w-sm"
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
                  <Link href="/signup" className="flex-1 sm:flex-none">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Showcase work
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Stat tile — inverted white (156+) */}
          <FadeIn delay={0.1} className="lg:col-span-4">
            <div className="bento-tile bento-tile--invert flex h-full flex-col justify-between p-6 sm:p-8 min-h-[160px]">
              <p className="tracking-accent text-black/60">Verified tools</p>
              <div>
                <div className="font-display text-5xl font-bold tracking-hero sm:text-6xl">
                  <AnimatedCounter target={156} suffix="+" />
                </div>
                <p className="mt-2 text-sm text-black/70">
                  Handpicked &amp; reviewed, not scraped.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Stat tile — categories */}
          <FadeIn delay={0.15} className="lg:col-span-4">
            <div className="bento-tile flex h-full flex-col justify-between p-6 sm:p-8 min-h-[160px]">
              <p className="tracking-accent text-white/50">Categories</p>
              <div>
                <div className="font-display text-5xl font-bold tracking-hero text-foreground sm:text-6xl">
                  <AnimatedCounter target={16} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  From writing to code to video — every vertical.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FEATURED TOOLS BENTO
         ────────────────────────────────────────────────────────── */}
      {featuredTools.tools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <FadeIn>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="tracking-accent text-white/50">Handpicked</p>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-hero sm:text-5xl lg:text-6xl">
                  Featured tools
                </h2>
              </div>
              <Link
                href="/tools"
                className="group shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                View all
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </FadeIn>

          {/* Bento featured grid: 1 big + up to 4 smaller */}
          <StaggerChildren className="grid gap-3 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[1fr]">
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
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────
          HOW IT WORKS
         ────────────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ──────────────────────────────────────────────────────────
          PORTFOLIO SHOWCASE
         ────────────────────────────────────────────────────────── */}
      <PortfolioShowcase users={portfolioUsers} />

      {/* ──────────────────────────────────────────────────────────
          CATEGORIES BENTO
         ────────────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <FadeIn>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="tracking-accent text-white/50">Browse</p>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-hero sm:text-5xl lg:text-6xl">
                  By category
                </h2>
              </div>
              <Link
                href="/categories"
                className="group shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                See all
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <CategoryCard category={category} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────
          TRUST STRIP
         ────────────────────────────────────────────────────────── */}
      <TrustStrip />

      {/* ──────────────────────────────────────────────────────────
          FOR TOOL MAKERS
         ────────────────────────────────────────────────────────── */}
      <ForToolMakers />

      {/* ──────────────────────────────────────────────────────────
          FINAL BENTO CTA
         ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <FadeIn>
          <div className="bento-tile bento-tile--invert grid gap-8 p-10 sm:p-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <p className="tracking-accent text-black/60 inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                The future is AI
              </p>
              <h2 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-hero sm:text-6xl lg:text-7xl">
                Build. Ship.
                <br />
                Get noticed.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-black/70 sm:text-lg">
                Join the AiCensus community — curate tools, publish your work,
                get discovered.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
              <Link href="/tools" className="w-full sm:w-auto lg:w-full">
                <Button
                  size="lg"
                  className="w-full bg-black text-white hover:bg-black/85"
                >
                  Browse tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto lg:w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-black bg-transparent text-black hover:bg-black hover:text-white"
                >
                  Create portfolio
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
