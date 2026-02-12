import type { Metadata } from "next";
import { ToolGrid } from "@/components/tools/tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTools } from "@/lib/queries/tools";
import { getCategories } from "@/lib/queries/categories";
import { FilterBar } from "@/components/filters/filter-bar";
import { Pagination } from "@/components/shared/pagination";
import { PaginationInfo } from "@/components/shared/pagination-info";
import type { PricingModel, ToolWithCategory, Category } from "@/lib/types/database";

export const revalidate = 1800;

const TOOLS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "Browse AI Tools — Find the Best AI Apps & Agents",
  description:
    "Explore our curated directory of AI tools. Filter by category, pricing, and more. Find verified AI apps, agents, and software for every use case.",
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
  } catch {
    // Supabase not configured yet
  }

  const totalPages = Math.ceil(tools.count / TOOLS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        title={params.q ? `Results for "${params.q}"` : "Browse AI Tools"}
        description={
          params.q
            ? `${tools.count} tools found`
            : "Explore our curated directory of verified AI tools"
        }
      />

      <div className="mt-8">
        <FilterBar categories={categories} />
      </div>

      <div className="mt-8">
        <ToolGrid tools={tools.tools} />
      </div>

      {tools.count > 0 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <PaginationInfo
            currentPage={currentPage}
            perPage={TOOLS_PER_PAGE}
            total={tools.count}
          />
          <Pagination
            currentPage={currentPage}
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
  );
}
