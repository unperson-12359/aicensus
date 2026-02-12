import Link from "next/link";
import { ArrowRight, Search, Sparkles, ShieldCheck, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedToolGrid } from "@/components/tools/animated-tool-grid";
import { CategoryCard } from "@/components/categories/category-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { FadeIn, RevealText, StaggerChildren, StaggerItem } from "@/components/motion";
import { getFeaturedTools, getRecentTools } from "@/lib/queries/tools";
import { getCategoriesWithToolCount, type CategoryWithCount } from "@/lib/queries/categories";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600;

export default async function HomePage() {
  let featuredTools: { tools: ToolWithCategory[]; count: number } = { tools: [], count: 0 };
  let recentTools: { tools: ToolWithCategory[]; count: number } = { tools: [], count: 0 };
  let categories: CategoryWithCount[] = [];

  try {
    [featuredTools, recentTools, categories] = await Promise.all([
      getFeaturedTools(6),
      getRecentTools(6),
      getCategoriesWithToolCount(),
    ]);
  } catch {
    // Supabase not configured yet
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AiCensus",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.com",
    description: "The curated directory of verified AI tools.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.com"}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl animate-float" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[500px] rounded-full bg-accent/5 blur-3xl animate-float-delayed" />
          <div className="absolute left-0 top-1/3 h-[300px] w-[400px] rounded-full bg-neon/3 blur-3xl animate-float" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-32 sm:pt-40 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge with pulse glow */}
            <FadeIn delay={0.1}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-1.5 text-sm text-muted-foreground animate-pulse-glow">
                <Sparkles className="h-4 w-4 text-primary" />
                The trusted AI tools directory
              </div>
            </FadeIn>

            {/* BOLD HERO TYPOGRAPHY */}
            <RevealText delay={0.2}>
              <p className="font-display text-lg font-medium uppercase tracking-widest text-muted-foreground sm:text-xl">
                Discover the
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <h1 className="font-display text-6xl font-bold tracking-hero text-gradient-primary sm:text-7xl lg:text-8xl xl:text-9xl text-glow">
                best AI tools
              </h1>
            </RevealText>

            <RevealText delay={0.5}>
              <p className="font-display text-3xl font-light tracking-display text-foreground/80 sm:text-4xl lg:text-5xl">
                for your workflow
              </p>
            </RevealText>

            <FadeIn delay={0.7} direction="up">
              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Curated, verified, and compared. Find the right AI tools without
                the noise. Expert reviews, pricing breakdowns, and honest
                pros & cons.
              </p>
            </FadeIn>

            {/* Search Bar */}
            <FadeIn delay={0.9} direction="up">
              <div className="mx-auto mt-10 max-w-xl">
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

            {/* Stats */}
            <FadeIn delay={1.1} direction="up">
              <div className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Verified Reviews
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  {featuredTools.count + recentTools.count || "10+"} Tools
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      {featuredTools.tools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between">
              <SectionHeading
                title="Featured Tools"
                description="Hand-picked and verified by our team"
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
            <AnimatedToolGrid tools={featuredTools.tools} />
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              title="Browse by Category"
              description="Find AI tools for every use case"
            />
          </FadeIn>
          <StaggerChildren className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <CategoryCard category={category} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      )}

      {/* Recently Added */}
      {recentTools.tools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between">
              <SectionHeading
                title="Recently Added"
                description="Fresh tools added to the directory"
              />
              <Link
                href="/tools?sort=newest"
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
          <div className="mt-8">
            <AnimatedToolGrid tools={recentTools.tools} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 text-center sm:p-12">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl animate-float" />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-display sm:text-4xl lg:text-5xl">
              Know a great{" "}
              <span className="text-gradient-primary">AI tool?</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Help us build the most comprehensive AI directory. Submit a tool and
              we&apos;ll review it.
            </p>
            <div className="mt-8">
              <Link href="/submit">
                <Button size="lg" className="glow-sm">
                  Submit a Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
