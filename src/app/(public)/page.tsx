import Link from "next/link";
import { ArrowRight, Search, Layers, Briefcase, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BentoToolGrid } from "@/components/tools/bento-tool-grid";
import { CategoryCard } from "@/components/categories/category-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import {
  GeometricDecor,
  heroShapes,
  sectionShapes,
  ctaShapes,
} from "@/components/shared/geometric-decor";
import { FadeIn, RevealText, StaggerChildren, StaggerItem, ParallaxSection, MagneticButton, AnimatedCounter } from "@/components/motion";
import { SectionDivider } from "@/components/shared/section-divider";
import { HowItWorks } from "@/components/home/how-it-works";
import { PortfolioShowcase } from "@/components/home/portfolio-showcase";
import { TrustStrip } from "@/components/home/trust-strip";
import { ForToolMakers } from "@/components/home/for-tool-makers";
import { getFeaturedTools } from "@/lib/queries/tools";
import { getCategoriesWithToolCount, type CategoryWithCount } from "@/lib/queries/categories";
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
  let featuredTools: { tools: ToolWithCategory[]; count: number } = { tools: [], count: 0 };
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

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <ParallaxSection speed={0.05}>
            <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl animate-float" />
          </ParallaxSection>
          <ParallaxSection speed={0.15}>
            <div className="absolute right-0 top-1/4 h-[400px] w-[500px] rounded-full bg-accent/5 blur-3xl animate-float-delayed" />
          </ParallaxSection>
          <ParallaxSection speed={0.25}>
            <div className="absolute left-0 top-1/3 h-[300px] w-[400px] rounded-full bg-neon/3 blur-3xl animate-float" />
          </ParallaxSection>
        </div>
        <GeometricDecor shapes={heroShapes} />

        <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-28 sm:pt-36 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <FadeIn delay={0.1}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1.5 text-xs text-muted-foreground animate-pulse-glow sm:mb-8 sm:px-4 sm:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                156+ curated AI tools & growing
              </div>
            </FadeIn>

            <RevealText delay={0.2}>
              <p className="font-display text-lg font-medium uppercase tracking-widest text-muted-foreground sm:text-xl">
                Where AI builders
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <h1 className="font-display text-5xl font-bold tracking-hero text-gradient-primary sm:text-7xl lg:text-8xl xl:text-9xl text-glow">
                discover, create
              </h1>
            </RevealText>

            <RevealText delay={0.5}>
              <p className="font-display text-2xl font-light tracking-display text-foreground/80 sm:text-4xl lg:text-5xl">
                and get noticed.
              </p>
            </RevealText>

            <FadeIn delay={0.7} direction="up">
              <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:mt-8 sm:text-xl">
                The curated directory of AI tools — plus a portfolio to showcase
                what you build with them. No domain needed. No audience required.
              </p>
            </FadeIn>

            {/* Search Bar */}
            <FadeIn delay={0.9} direction="up">
              <div className="mx-auto mt-8 max-w-xl sm:mt-10">
                <form action="/tools" method="GET" className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="q"
                    type="search"
                    placeholder="Search AI tools... (e.g., ChatGPT, writing, coding)"
                    className="h-14 rounded-xl bg-card pl-12 pr-4 text-base border-border/50 focus:border-primary focus:glow-sm transition-shadow duration-300"
                  />
                </form>
              </div>
            </FadeIn>

            {/* Dual CTAs */}
            <FadeIn delay={1.0} direction="up">
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <MagneticButton>
                  <Link href="/tools">
                    <Button size="lg" className="glow-sm">
                      Explore AI Tools <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/signup">
                    <Button variant="outline" size="lg">
                      Showcase Your Work <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={1.1} direction="up">
              <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground sm:gap-8">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <AnimatedCounter target={156} suffix="+" className="font-semibold text-foreground" /> Tools
                </div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-accent" />
                  <AnimatedCounter target={16} className="font-semibold text-foreground" /> Categories
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-neon" />
                  Free Portfolio
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ───── HOW IT WORKS ───── */}
      <HowItWorks />

      <SectionDivider />

      {/* ───── FEATURED TOOLS ───── */}
      {featuredTools.tools.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <GeometricDecor shapes={sectionShapes} />
          <FadeIn>
            <div className="flex items-end justify-between">
              <SectionHeading
                title="Featured Tools"
                description="Trusted by builders. Updated weekly."
                accent
              />
              <Link
                href="/tools"
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
          <div className="mt-8">
            <BentoToolGrid tools={featuredTools.tools} featuredCount={2} />
          </div>
        </section>
      )}

      <SectionDivider />

      {/* ───── PORTFOLIO SHOWCASE ───── */}
      <PortfolioShowcase users={portfolioUsers} />

      {/* ───── CATEGORIES ───── */}
      {categories.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <GeometricDecor shapes={sectionShapes} />
          <FadeIn>
            <SectionHeading
              title="Browse by Category"
              description="Find AI tools for every use case"
              accent
            />
          </FadeIn>
          <StaggerChildren className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {categories.map((category, index) => (
              <StaggerItem
                key={category.id}
                className={
                  index === 0
                    ? "col-span-2"
                    : index === 1
                      ? "xl:col-span-2"
                      : undefined
                }
              >
                <CategoryCard category={category} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      )}

      {/* ───── TRUST STRIP ───── */}
      <TrustStrip />

      {/* ───── FOR TOOL MAKERS ───── */}
      <ForToolMakers />

      {/* ───── FINAL CTA ───── */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 text-center sm:p-12">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl animate-float" />
            </div>
            <GeometricDecor shapes={ctaShapes} />
            <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl lg:text-5xl">
              The future is built with{" "}
              <span className="text-gradient-primary">AI.</span>
              <br />
              Show yours.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Join the growing community of AI builders. Find tools. Showcase
              projects. Get noticed.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton>
                <Link href="/tools">
                  <Button size="lg" className="glow-sm">
                    Browse Tools <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/portfolio">
                  <Button variant="outline" size="lg">
                    Create Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
