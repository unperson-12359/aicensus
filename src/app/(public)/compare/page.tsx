import type { Metadata } from "next";
import { FadeIn } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ToolPicker } from "@/components/compare/tool-picker";
import { getTools } from "@/lib/queries/tools";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compare AI Tools Side by Side | AiCensus",
  description: "Compare AI tools head-to-head. See pricing, features, pros & cons, and ratings side by side.",
};

export default async function CompareIndexPage() {
  let allTools: { slug: string; name: string; logo_url: string | null; website_url: string; pricing_model: string | null; categories: { name: string } | null }[] = [];
  try {
    const result = await getTools({ sort: "name", limit: 200 });
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

  return (
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
          Select 2–4 tools to see a detailed side-by-side comparison of pricing, features, pros & cons, and more.
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-8">
          <ToolPicker tools={allTools} />
        </div>
      </FadeIn>
    </div>
  );
}
