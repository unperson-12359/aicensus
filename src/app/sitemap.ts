import type { MetadataRoute } from "next";
import { stacks } from "@/lib/stacks";
import { BEST_FOR_PAGES } from "@/lib/best-for";
import { MCP_SERVERS } from "@/lib/mcp-servers";
import { POPULAR_COMPARISONS } from "@/lib/popular-comparisons";
import { getComparisonPath } from "@/lib/compare-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/stacks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/best`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/mcps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/prompt-builder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/changelog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.3 },
  ];

  const stackPages: MetadataRoute.Sitemap = stacks.map((stack) => ({
    url: `${baseUrl}/stacks/${stack.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const bestPages: MetadataRoute.Sitemap = BEST_FOR_PAGES.map((page) => ({
    url: `${baseUrl}/best/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const mcpPages: MetadataRoute.Sitemap = MCP_SERVERS.map((server) => ({
    url: `${baseUrl}/mcps/${server.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const comparisonPages: MetadataRoute.Sitemap = POPULAR_COMPARISONS.map((pair) => ({
    url: `${baseUrl}${getComparisonPath(pair.slugs)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { getAllPosts } = await import("@/lib/blog");
    blogPages = getAllPosts().map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
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

    const { data: tools } = (await supabase
      .from("tools")
      .select("slug, updated_at")
      .eq("status", "published")) as {
      data: { slug: string; updated_at: string }[] | null;
    };

    const { data: categories } = (await supabase
      .from("categories")
      .select("slug, updated_at")) as {
      data: { slug: string; updated_at: string }[] | null;
    };

    toolPages = (tools || []).map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(tool.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const alternativePages: MetadataRoute.Sitemap = (tools || []).map((tool) => ({
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
  } catch {
    // Supabase not configured
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
