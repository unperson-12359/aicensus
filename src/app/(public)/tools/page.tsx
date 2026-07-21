import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ToolGrid } from "@/components/tools/tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { getTools } from "@/lib/queries/tools";
import { getCategories } from "@/lib/queries/categories";
import { FilterBar } from "@/components/filters/filter-bar";
import { SearchQueryTracker } from "@/components/filters/search-query-tracker";
import { Pagination } from "@/components/shared/pagination";
import { PaginationInfo } from "@/components/shared/pagination-info";
import { PageContainer } from "@/components/shared/page-container";
import type { PricingModel, ToolWithCategory, Category } from "@/lib/types/database";

export const revalidate = 1800;

const TOOLS_PER_PAGE = 24;

const BASE_METADATA: Metadata = {
  title: "Browse AI Tools — Curated Directory with Honest Reviews",
  description:
    "Curated by humans, not scraped by bots. Browse AI tools with honest pricing, real pros & cons, and no sponsored rankings. Filter by category, pricing, and more.",
  openGraph: {
    title: "Browse AI Tools — Curated Directory with Honest Reviews",
    description:
      "Curated by humans, not scraped by bots. Honest pricing, real pros & cons, and no sponsored rankings.",
    url: "/tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse AI Tools — Curated Directory with Honest Reviews",
    description:
      "Curated by humans, not scraped by bots. Honest pricing, real pros & cons, and no sponsored rankings.",
  },
  alternates: {
    canonical: "/tools",
  },
};

interface ToolsSearchParams {
  q?: string;
  category?: string;
  pricing?: string;
  verified?: string;
  sort?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<ToolsSearchParams>;
}

function hasToolsFilterParams(params: ToolsSearchParams): boolean {
  return Boolean(
    params.q ||
      params.category ||
      params.pricing ||
      params.verified ||
      params.sort ||
      params.page
  );
}

function buildToolsPagePath(page: number, params: ToolsSearchParams): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.pricing) search.set("pricing", params.pricing);
  if (params.verified) search.set("verified", params.verified);
  if (params.sort) search.set("sort", params.sort);
  if (page > 1) search.set("page", String(page));
  const qs = search.toString();
  return qs ? `/tools?${qs}` : "/tools";
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;

  if (!hasToolsFilterParams(params)) {
    return BASE_METADATA;
  }

  return {
    ...BASE_METADATA,
    robots: { index: false, follow: true },
  };
}

export default async function ToolsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const offset = (currentPage - 1) * TOOLS_PER_PAGE;
  const hasFilters = hasToolsFilterParams(params);

  // DB failures throw to the error boundary (500) instead of rendering a
  // thin, silent 200 that looks like an empty directory to crawlers.
  const fetchTools = (offsetOverride?: number) =>
    getTools({
      search: params.q,
      category: params.category,
      pricing: params.pricing as PricingModel | undefined,
      verified: params.verified === "true" ? true : undefined,
      sort: (params.sort as "rating" | "name" | "newest") || "newest",
      limit: TOOLS_PER_PAGE,
      offset: offsetOverride ?? offset,
    });

  const [tools, categories]: [
    { tools: ToolWithCategory[]; count: number },
    Category[],
  ] = await Promise.all([
    // PostgREST errors when the requested range starts past the last row
    // (e.g. ?page=99), which would otherwise surface as a 500. Refetch from
    // the first page to learn the real count so the clamp below can redirect.
    // Genuine DB failures re-throw from the retry and hit the error boundary.
    fetchTools().catch(() => fetchTools(0)),
    getCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(tools.count / TOOLS_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);

  if (currentPage !== clampedPage) {
    redirect(buildToolsPagePath(clampedPage, params));
  }

  if (tools.count === 0 && hasFilters && !params.q) {
    // Filter combinations with no matches (e.g. an unknown category slug) are
    // thin, no-value URLs — keep them out of the index with a real 404.
    // Searches (q) fall through to a helpful empty state instead, since a 404
    // page is a dead end for someone who just typed a query.
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Browse AI Tools",
    description: "Curated directory of verified AI tools.",
    url: `${siteUrl}/tools`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.count,
      itemListElement: tools.tools.map((tool, i) => ({
        "@type": "ListItem",
        position: offset + i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: tool.name,
          url: `${siteUrl}/tools/${tool.slug}`,
          applicationCategory: "Artificial Intelligence",
        },
      })),
    },
  };

  return (
    <>
    <SearchQueryTracker query={params.q} />
    <JsonLd data={itemListJsonLd} />
    <PageContainer variant="listing">
      <SectionHeading
        as="h1"
        title={params.q ? `Results for "${params.q}"` : "Browse AI tools"}
        description={
          params.q
            ? `${tools.count} tools found`
            : "Curated by humans. Honest pricing, real pros & cons, no sponsored rankings."
        }
        eyebrow="The directory"
      />

      <div className="mt-6">
        <FilterBar categories={categories} />
      </div>

      {!params.q && categories.length > 0 && (
        <nav
          aria-label="Browse by category"
          className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1.5"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 sm:text-[11px]">
            Categories
          </span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              aria-current={
                params.category === category.slug ? "page" : undefined
              }
              className={
                params.category === category.slug
                  ? "font-mono text-[10px] uppercase tracking-[0.18em] text-white sm:text-[11px]"
                  : "font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
              }
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}

      <div id="results" className="mt-6 scroll-mt-24">
        {tools.tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium">No tools found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {params.q
                ? `No tools match "${params.q}". Try a different search term.`
                : "No tools match your current filters. Try adjusting or clearing them."}
            </p>
            {hasFilters && (
              <Link
                href="/tools"
                className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
              >
                Clear {params.q ? "search" : "filters"} &amp; browse all tools
              </Link>
            )}
          </div>
        ) : (
          <ToolGrid tools={tools.tools} />
        )}
      </div>

      {tools.count > 0 && totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
          <PaginationInfo
            currentPage={clampedPage}
            perPage={TOOLS_PER_PAGE}
            total={tools.count}
          />
          <Pagination
            currentPage={clampedPage}
            totalPages={totalPages}
            basePath="/tools"
            anchor="results"
            searchParams={{
              q: params.q,
              category: params.category,
              pricing: params.pricing,
              verified: params.verified,
              sort: params.sort,
            }}
          />
        </div>
      )}
      {tools.count > 0 && totalPages <= 1 && (
        <div className="mt-8 flex justify-center">
          <PaginationInfo
            currentPage={clampedPage}
            perPage={TOOLS_PER_PAGE}
            total={tools.count}
          />
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/tools/all"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
        >
          A–Z index of all tools
        </Link>
      </div>
    </PageContainer>
    </>
  );
}
