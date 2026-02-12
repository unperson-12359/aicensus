import Link from "next/link";
import { ArrowRight, Search, Sparkles, ShieldCheck, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolGrid } from "@/components/tools/tool-grid";
import { CategoryCard } from "@/components/categories/category-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { getFeaturedTools, getRecentTools } from "@/lib/queries/tools";
import { getCategoriesWithToolCount, type CategoryWithCount } from "@/lib/queries/categories";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600; // Revalidate every hour

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
    // Supabase not configured yet — show empty state
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
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[300px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              The trusted AI tools directory
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                best AI tools
              </span>{" "}
              for your workflow
            </h1>

            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Curated, verified, and compared. Find the right AI tools without
              the noise. Expert reviews, pricing breakdowns, and honest
              pros & cons.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-10 max-w-xl">
              <form action="/tools" method="GET" className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  type="search"
                  placeholder="Search AI tools... (e.g., ChatGPT, writing, coding)"
                  className="h-14 rounded-xl bg-card pl-12 pr-4 text-base border-border/50 focus:border-primary"
                />
              </form>
            </div>

            {/* Stats */}
            <div className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Verified Reviews
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                {featuredTools.count + recentTools.count || "10+"}  Tools
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      {featuredTools.tools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
          <div className="mt-8">
            <ToolGrid tools={featuredTools.tools} />
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            title="Browse by Category"
            description="Find AI tools for every use case"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added */}
      {recentTools.tools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
          <div className="mt-8">
            <ToolGrid tools={recentTools.tools} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 text-center sm:p-12">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Know a great AI tool?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Help us build the most comprehensive AI directory. Submit a tool and
            we&apos;ll review it.
          </p>
          <div className="mt-6">
            <Link href="/submit">
              <Button size="lg" className="glow-sm">
                Submit a Tool <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
