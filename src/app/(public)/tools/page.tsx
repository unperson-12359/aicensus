import type { Metadata } from "next";
import { ToolGrid } from "@/components/tools/tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTools } from "@/lib/queries/tools";
import { getCategories } from "@/lib/queries/categories";
import { FilterBar } from "@/components/filters/filter-bar";
import type { PricingModel, ToolWithCategory, Category } from "@/lib/types/database";

export const revalidate = 1800;

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
  }>;
}

export default async function ToolsPage({ searchParams }: PageProps) {
  const params = await searchParams;

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
      }),
      getCategories(),
    ]);
  } catch {
    // Supabase not configured yet
  }

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
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Showing {tools.tools.length} of {tools.count} tools
        </p>
      )}
    </div>
  );
}
