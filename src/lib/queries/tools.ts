import { createClient } from "@/lib/supabase/server";
import type { ToolWithCategory } from "@/lib/types/database";

export async function getTools(options?: {
  category?: string;
  pricing?: string;
  verified?: boolean;
  featured?: boolean;
  search?: string;
  sort?: "rating" | "name" | "newest";
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("tools")
    .select("*, categories(*)", { count: "exact" })
    .eq("status", "published");

  if (options?.category) {
    query = query.eq("categories.slug", options.category);
  }

  if (options?.pricing) {
    query = query.eq("pricing_model", options.pricing);
  }

  if (options?.verified) {
    query = query.eq("is_verified", true);
  }

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.search) {
    // Escape special PostgREST filter characters to prevent filter injection
    const sanitized = options.search.replace(/[,.()"\\]/g, "");
    if (sanitized) {
      query = query.or(
        `name.ilike.%${sanitized}%,tagline.ilike.%${sanitized}%,description.ilike.%${sanitized}%`
      );
    }
  }

  switch (options?.sort) {
    case "rating":
      query = query.order("editor_rating", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("published_at", {
        ascending: false,
        nullsFirst: false,
      });
      break;
  }

  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;
  return { tools: (data as ToolWithCategory[]) || [], count: count || 0 };
}

export async function getToolBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tools")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as ToolWithCategory;
}

export async function getToolAlternatives(toolId: string) {
  const supabase = await createClient();

  const { data: alternativeIds } = await supabase
    .from("tool_alternatives")
    .select("alternative_id")
    .eq("tool_id", toolId);

  if (!alternativeIds || alternativeIds.length === 0) return [];

  const ids = alternativeIds.map((a) => a.alternative_id);

  const { data } = await supabase
    .from("tools")
    .select("*, categories(*)")
    .in("id", ids)
    .eq("status", "published");

  return (data as ToolWithCategory[]) || [];
}

export async function getToolAlternativesBidirectional(toolId: string) {
  const supabase = await createClient();

  const [{ data: forward }, { data: reverse }] = await Promise.all([
    supabase.from("tool_alternatives").select("alternative_id").eq("tool_id", toolId),
    supabase.from("tool_alternatives").select("tool_id").eq("alternative_id", toolId),
  ]);

  const ids = new Set<string>();
  for (const r of forward || []) ids.add(r.alternative_id);
  for (const r of reverse || []) ids.add(r.tool_id);
  ids.delete(toolId);

  if (ids.size === 0) return [];

  const { data } = await supabase
    .from("tools")
    .select("*, categories(*)")
    .in("id", Array.from(ids))
    .eq("status", "published");

  return (data as ToolWithCategory[]) || [];
}

export async function getAllToolSlugs() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tools")
    .select("slug")
    .eq("status", "published");

  return data?.map((t) => t.slug) || [];
}

export async function getFeaturedTools(limit = 6) {
  return getTools({ featured: true, limit, sort: "rating" });
}

export async function getRecentTools(limit = 6) {
  return getTools({ limit, sort: "newest" });
}

export async function getToolsByCategory(
  categorySlug: string,
  options?: { limit?: number; offset?: number }
) {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { tools: [], count: 0 };

  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  const { data, count } = await supabase
    .from("tools")
    .select("*, categories(*)", { count: "exact" })
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("editor_rating", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  return { tools: (data as ToolWithCategory[]) || [], count: count || 0 };
}
