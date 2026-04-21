import type { Metadata } from "next";
import { ToolGrid } from "@/components/tools/tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { getTools } from "@/lib/queries/tools";
import { getCategories } from "@/lib/queries/categories";
import { FilterBar } from "@/components/filters/filter-bar";
import { Pagination } from "@/components/shared/pagination";
import { PaginationInfo } from "@/components/shared/pagination-info";
import { PageTransition } from "@/components/motion";
import { GeometricDecor, pageHeaderShapes } from "@/components/shared/geometric-decor";
import type { PricingModel, ToolWithCategory, Category } from "@/lib/types/database";

export const revalidate = 1800;

const TOOLS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "Browse AI Tools — Curated Directory with Honest Reviews | AiCensus",
  description:
    "Curated by humans, not scraped by bots. Browse AI tools with honest pricing, real pros & cons, and no sponsored rankings. Filter by category, pricing, and more.",
  openGraph: {
    title: "Browse AI Tools — Curated Directory with Honest Reviews | AiCensus",
    description:
      "Curated by humans, not scraped by bots. Honest pricing, real pros & cons, and no sponsored rankings.",
    url: "/tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse AI Tools — Curated Directory with Honest Reviews | AiCensus",
    description:
      "Curated by humans, not scraped by bots. Honest pricing, real pros & cons, and no sponsored rankings.",
  },
  alternates: {
    canonical: "/tools",
  },
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    pricing?: string;
    verified?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ToolsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const offset = (currentPage - 1) * TOOLS_PER_PAGE;

  let tools: { tools: ToolWithCategory[]; count: number } = { tools: [], count: 0 };
  let categories: Category[] = [];

  try {
    [tools, categories] = await Promise.all([
      getTools({
        search: params.q,
        category: params.category,
        pricing: params.pricing as PricingModel | undefined,
        verified: params.verified === "true" ? true : undefined,
        sort: (params.sort as "rating" | "name" | "newest") || "newest",
        limit: TOOLS_PER_PAGE,
        offset,
      }),
      getCategories(),
    ]);
  } catch (err) {
    console.error("Failed to fetch tools/categories:", err);
  }

  const totalPages = Math.max(1, Math.ceil(tools.count / TOOLS_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";
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
    <JsonLd data={itemListJsonLd} />
    <PageTransition>
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <GeometricDecor shapes={pageHeaderShapes} />
      <SectionHeading
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

      <div className="mt-6">
        {tools.tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium">No tools found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {params.q
                ? `No tools match "${params.q}". Try a different search term.`
                : "No tools match your current filters. Try adjusting or clearing them."}
            </p>
          </div>
        ) : (
          <ToolGrid tools={tools.tools} />
        )}
      </div>

      {tools.count > 0 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <PaginationInfo
            currentPage={clampedPage}
            perPage={TOOLS_PER_PAGE}
            total={tools.count}
          />
          <Pagination
            currentPage={clampedPage}
            totalPages={totalPages}
            basePath="/tools"
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
    </div>
    </PageTransition>
    </>
  );
}
