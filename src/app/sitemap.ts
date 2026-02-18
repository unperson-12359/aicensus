import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Dynamic tool pages
  let toolPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  let portfolioPages: MetadataRoute.Sitemap = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: tools } = await supabase
      .from("tools")
      .select("slug, updated_at")
      .eq("status", "published") as { data: { slug: string; updated_at: string }[] | null };

    const { data: categories } = await supabase
      .from("categories")
      .select("slug, updated_at") as { data: { slug: string; updated_at: string }[] | null };

    toolPages = (tools || []).map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(tool.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    categoryPages = (categories || []).map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(cat.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Portfolio pages
    const { data: userProfiles } = await supabase
      .from("user_profiles")
      .select("username, updated_at")
      .eq("is_public", true) as { data: { username: string; updated_at: string }[] | null };

    portfolioPages = (userProfiles || []).map((user) => ({
      url: `${baseUrl}/portfolio/${user.username}`,
      lastModified: new Date(user.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // Supabase not configured
  }

  return [...staticPages, ...toolPages, ...categoryPages, ...portfolioPages];
}
