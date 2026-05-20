import { createClient } from "@/lib/supabase/server";
import type { ToolWithCategory } from "@/lib/types/database";

export async function getCatalogStats(): Promise<{
  toolCount: number;
  categoryCount: number;
}> {
  const supabase = await createClient();

  const [toolsResult, categoriesResult] = await Promise.all([
    supabase
      .from("tools")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  if (toolsResult.error) throw toolsResult.error;
  if (categoriesResult.error) throw categoriesResult.error;

  return {
    toolCount: toolsResult.count || 0,
    categoryCount: categoriesResult.count || 0,
  };
}

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
  const categorySelect = options?.category ? "*, categories!inner(*)" : "*, categories(*)";

  let query = supabase
    .from("tools")
    .select(categorySelect, { count: "exact" })
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
    const sanitized = options.search
      .replace(/[,.()"\\%_*]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
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

export async function getToolsBySlugs(
  slugs: string[]
): Promise<ToolWithCategory[]> {
  if (!slugs || slugs.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tools")
    .select("*, categories(*)")
    .in("slug", slugs)
    .eq("status", "published");

  if (error || !data) return [];

  const rows = data as ToolWithCategory[];
  // Preserve input slug order
  const order = new Map<string, number>();
  slugs.forEach((slug, i) => order.set(slug, i));
  rows.sort(
    (a, b) =>
      (order.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
  );
  return rows;
}

export async function getFeaturedTools(limit = 6) {
  return getTools({ featured: true, limit, sort: "rating" });
}

export async function getRecentTools(limit = 6) {
  return getTools({ limit, sort: "newest" });
}

/**
 * Get the previous and next published tools alphabetically within the same
 * category. Falls back to global alphabetical ordering if the tool is
 * uncategorised. Used for prev/next navigation at the bottom of a tool
 * detail page.
 */
export async function getAdjacentTools(
  toolName: string,
  categoryId: string | null
): Promise<{
  prev: { slug: string; name: string } | null;
  next: { slug: string; name: string } | null;
}> {
  const supabase = await createClient();

  let baseQuery = supabase
    .from("tools")
    .select("slug, name")
    .eq("status", "published");

  if (categoryId) {
    baseQuery = baseQuery.eq("category_id", categoryId);
  }

  // Previous: last tool whose name sorts before the current one
  const { data: prevData } = await baseQuery
    .lt("name", toolName)
    .order("name", { ascending: false })
    .limit(1);

  // Next: first tool whose name sorts after the current one.
  // Build a fresh query because PostgREST mutations above aren't cloneable.
  let nextQuery = supabase
    .from("tools")
    .select("slug, name")
    .eq("status", "published");
  if (categoryId) {
    nextQuery = nextQuery.eq("category_id", categoryId);
  }
  const { data: nextData } = await nextQuery
    .gt("name", toolName)
    .order("name", { ascending: true })
    .limit(1);

  const prev = prevData?.[0]
    ? { slug: prevData[0].slug as string, name: prevData[0].name as string }
    : null;
  const next = nextData?.[0]
    ? { slug: nextData[0].slug as string, name: nextData[0].name as string }
    : null;

  return { prev, next };
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

/**
 * Fetch other tools in the same category, excluding the given tool. Used as a
 * fallback for the alternatives landing page so every tool has a populated
 * page even when no explicit `tool_alternatives` rows exist.
 */
export async function getRelatedToolsByCategoryId(
  categoryId: string,
  excludeToolId: string,
  limit = 12
): Promise<ToolWithCategory[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tools")
    .select("*, categories(*)")
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", excludeToolId)
    .order("editor_rating", { ascending: false, nullsFirst: false })
    .limit(limit);

  return (data as ToolWithCategory[]) || [];
}
