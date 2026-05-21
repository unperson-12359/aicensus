import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { ToolPicker } from "@/components/compare/tool-picker";
import { getTools } from "@/lib/queries/tools";
import {
  POPULAR_COMPARISONS,
  GROUP_LABELS,
  type ComparisonPair,
} from "@/lib/popular-comparisons";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compare AI Tools Side by Side | AiCensus",
  description:
    "Compare AI tools head-to-head. See pricing, features, pros & cons, and ratings side by side. Includes 50+ pre-built comparisons of the most popular AI tools in 2026.",
};

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function groupComparisons(pairs: ComparisonPair[]) {
  const map = new Map<string, ComparisonPair[]>();
  for (const p of pairs) {
    const key = p.group ?? "other";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries());
}

export default async function CompareIndexPage() {
  let allTools: {
    slug: string;
    name: string;
    logo_url: string | null;
    website_url: string;
    pricing_model: string | null;
    categories: { name: string } | null;
  }[] = [];
  try {
    const result = await getTools({ sort: "name", limit: 300 });
    allTools = result.tools.map((t) => ({
      slug: t.slug,
      name: t.name,
      logo_url: t.logo_url,
      website_url: t.website_url,
      pricing_model: t.pricing_model,
      categories: t.categories,
    }));
  } catch {
    // DB not configured
  }

  const grouped = groupComparisons(POPULAR_COMPARISONS);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Compare AI Tools",
    description:
      "Side-by-side comparisons of popular AI tools — pricing, features, pros & cons, and editorial verdicts.",
    url: `${siteUrl}/compare`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: POPULAR_COMPARISONS.length,
      itemListElement: POPULAR_COMPARISONS.map((pair, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebPage",
          name: pair.slugs.map(titleCase).join(" vs "),
          url: `${siteUrl}/compare/${pair.slugs.join("/")}`,
        },
      })),
    },
  };

  return (
    <>
      <JsonLd data={itemListLd} />
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Compare" },
          ]}
        />
      </FadeIn>
      <FadeIn>
        <h1 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          Compare AI Tools
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Pre-built comparisons of the most popular pairs, plus a custom
          builder — pick 2-4 tools and see them side-by-side.
        </p>
      </FadeIn>

      {/* Popular comparisons by group */}
      <FadeIn delay={0.15}>
        <section className="mt-12 sm:mt-14">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
              § Popular comparisons
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="mt-6 space-y-8">
            {grouped.map(([group, pairs]) => (
              <div key={group}>
                <h2 className="font-serif text-lg italic leading-tight tracking-[-0.02em] text-white/85 sm:text-xl">
                  {GROUP_LABELS[group as keyof typeof GROUP_LABELS] ?? "Other"}
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {pairs.map((p) => (
                    <Link
                      key={p.slugs.join("-")}
                      href={`/compare/${p.slugs.join("/")}`}
                      className="bento-tile group flex items-center justify-between p-3 transition-colors hover:border-white/30 sm:p-4"
                    >
                      <span className="text-sm text-white/85 sm:text-[15px]">
                        {p.slugs.map(titleCase).join(" vs ")}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Custom comparison builder */}
      <FadeIn delay={0.2}>
        <section className="mt-16 sm:mt-20">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
              § Build your own
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <h2 className="mt-4 font-serif text-2xl italic leading-tight tracking-[-0.02em] text-white/85 sm:text-3xl">
            Compare any 2-4 tools side by side.
          </h2>
          <div className="mt-6">
            <ToolPicker tools={allTools} />
          </div>
        </section>
      </FadeIn>
    </div>
    </>
  );
}
