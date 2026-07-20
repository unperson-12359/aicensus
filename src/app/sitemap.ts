import type { MetadataRoute } from "next";
import { stacks } from "@/lib/stacks";
import { BEST_FOR_PAGES } from "@/lib/best-for";
import { MCP_SERVERS } from "@/lib/mcp-servers";
import { POPULAR_COMPARISONS } from "@/lib/popular-comparisons";
import { getComparisonPath } from "@/lib/compare-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  // Static pages have no honest modification date — omit lastModified
  // rather than claiming "now" on every render.
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tools/all`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/stacks`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/stacks/build`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/best`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/mcps`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/how-we-rate`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/affiliate-disclosure`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/compare`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/prompt-builder`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/changelog`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const stackPages: MetadataRoute.Sitemap = stacks.map((stack) => ({
    url: `${baseUrl}/stacks/${stack.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const bestPages: MetadataRoute.Sitemap = BEST_FOR_PAGES.map((page) => ({
    url: `${baseUrl}/best/${page.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const mcpPages: MetadataRoute.Sitemap = MCP_SERVERS.map((server) => ({
    url: `${baseUrl}/mcps/${server.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const comparisonPages: MetadataRoute.Sitemap = POPULAR_COMPARISONS.map((pair) => ({
    url: `${baseUrl}${getComparisonPath(pair.slugs)}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { getAllPosts } = await import("@/lib/blog");
    blogPages = getAllPosts().map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch {
    // Blog directory may not exist
  }

  let toolPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const { createClient } = await import("@/lib/supabase/public");
    const supabase = await createClient();

    const { data: tools, error: toolsError } = (await supabase
      .from("tools")
      .select("slug, updated_at")
      .eq("status", "published")) as {
      data: { slug: string; updated_at: string }[] | null;
      error: unknown;
    };

    if (toolsError) throw toolsError;

    const { data: categories, error: categoriesError } = (await supabase
      .from("categories")
      .select("slug, updated_at")) as {
      data: { slug: string; updated_at: string }[] | null;
      error: unknown;
    };

    if (categoriesError) throw categoriesError;

    // Only tools with curated tool_alternatives rows get their alternatives
    // page in the sitemap — the rest render a thin category-fallback version.
    const { getToolSlugsWithCuratedAlternatives } = await import(
      "@/lib/queries/tools"
    );
    const curatedAlternativeSlugs = await getToolSlugsWithCuratedAlternatives();

    toolPages = (tools || []).map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(tool.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const alternativePages: MetadataRoute.Sitemap = (tools || [])
      .filter((tool) => curatedAlternativeSlugs.has(tool.slug))
      .map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}/alternatives`,
        lastModified: new Date(tool.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    toolPages = [...toolPages, ...alternativePages];

    categoryPages = (categories || []).map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(cat.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    // Supabase not configured or unreachable — without this the sitemap would
    // silently lose all tool/category URLs, so make the failure visible.
    console.error("sitemap: failed to load tools/categories from Supabase", error);
  }

  return [
    ...staticPages,
    ...stackPages,
    ...bestPages,
    ...mcpPages,
    ...comparisonPages,
    ...blogPages,
    ...toolPages,
    ...categoryPages,
  ];
}
