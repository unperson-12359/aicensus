import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BentoToolGrid } from "@/components/tools/bento-tool-grid";
import { CategoryCard } from "@/components/categories/category-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { FadeIn, RevealText, StaggerChildren, StaggerItem, AnimatedCounter } from "@/components/motion";
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
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8">
          {/* Massive stacked headline */}
          <div className="max-w-6xl">
            <RevealText delay={0.1}>
              <h1 className="font-display text-6xl font-bold uppercase leading-[0.85] tracking-[-0.04em] sm:text-8xl lg:text-[10rem]">
                <span className="text-gradient-primary">Discover.</span>
              </h1>
            </RevealText>
            <RevealText delay={0.25}>
              <h1 className="font-display text-6xl font-bold uppercase leading-[0.85] tracking-[-0.04em] sm:text-8xl lg:text-[10rem]">
                Create.
              </h1>
            </RevealText>
            <RevealText delay={0.4}>
              <h1 className="font-display text-6xl font-bold uppercase leading-[0.85] tracking-[-0.04em] text-muted-foreground/60 sm:text-8xl lg:text-[10rem]">
                Get noticed.
              </h1>
            </RevealText>
          </div>

          {/* Accent tagline in serif italic */}
          <FadeIn delay={0.6} direction="up">
            <p className="mt-8 max-w-xl font-serif text-lg italic text-muted-foreground sm:text-xl">
              The curated directory of AI tools — plus a free portfolio to showcase what you build.
            </p>
          </FadeIn>

          {/* Stats as big visual blocks */}
          <FadeIn delay={0.7} direction="up">
            <div className="mt-10 flex items-start gap-8 sm:gap-12">
              <div>
                <div className="text-4xl font-bold text-foreground sm:text-5xl">
                  <AnimatedCounter target={156} suffix="+" />
                </div>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">AI Tools</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-4xl font-bold text-foreground sm:text-5xl">
                  <AnimatedCounter target={16} />
                </div>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Categories</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-4xl font-bold text-foreground sm:text-5xl">FREE</div>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Portfolio</p>
              </div>
            </div>
          </FadeIn>

          {/* Search + CTAs */}
          <FadeIn delay={0.8} direction="up">
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
              <form action="/tools" method="GET" className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  type="search"
                  placeholder="Search AI tools..."
                  className="h-9 rounded-md bg-card pl-9 pr-4 text-sm border-border/50 focus:border-primary transition-colors duration-150"
                />
              </form>
              <div className="flex gap-2">
                <Link href="/tools">
                  <Button size="default">
                    Browse Tools <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="default">
                    Showcase Work <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <HowItWorks />

      {/* ───── FEATURED TOOLS ───── */}
      {featuredTools.tools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between">
              <SectionHeading title="Featured Tools" accent />
              <Link
                href="/tools"
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
          <div className="mt-6">
            <BentoToolGrid tools={featuredTools.tools} featuredCount={2} />
          </div>
        </section>
      )}

      {/* ───── PORTFOLIO SHOWCASE ───── */}
      <PortfolioShowcase users={portfolioUsers} />

      {/* ───── CATEGORIES ───── */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <FadeIn>
            <SectionHeading title="Browse by Category" accent />
          </FadeIn>
          <StaggerChildren className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4">
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
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <div className="overflow-hidden rounded-lg border border-border/50 bg-card p-8 sm:p-12">
            <h2 className="font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              The future is{" "}
              <span className="text-gradient-primary">AI.</span>
              <br />
              Show yours.
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Join the growing community of AI builders. Find tools. Showcase projects. Get noticed.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/tools">
                <Button>
                  Browse Tools <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline">
                  Create Portfolio <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
