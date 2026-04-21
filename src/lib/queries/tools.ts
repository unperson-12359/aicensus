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
 * Lightweight tool shape used by the RAG retrieval path.
 * Only includes fields needed to fit many rows into the LLM context window.
 */
export interface RagTool {
  slug: string;
  name: string;
  tagline: string;
  pricing_model: string;
  category: string | null;
  editor_rating: number | null;
  key_features: string[];
  use_cases: string[];
}

/**
 * RAG retrieval: fetch published tools whose text fields loosely match the
 * user's natural-language query. Falls back to top-rated tools if no matches.
 */
export async function getToolsForRAG(
  query: string,
  limit = 20
): Promise<RagTool[]> {
  const supabase = await createClient();

  const sanitized = query.replace(/[,.()"\\%]/g, " ").trim();
  const terms = sanitized
    .split(/\s+/)
    .filter((t) => t.length >= 3)
    .slice(0, 6);

  let q = supabase
    .from("tools")
    .select(
      "slug, name, tagline, description, pricing_model, key_features, use_cases, editor_rating, categories(name, slug)"
    )
    .eq("status", "published");

  if (terms.length > 0) {
    const filters: string[] = [];
    for (const term of terms) {
      const safe = term.replace(/%/g, "");
      filters.push(
        `name.ilike.%${safe}%`,
        `tagline.ilike.%${safe}%`,
        `description.ilike.%${safe}%`
      );
    }
    q = q.or(filters.join(","));
  }

  q = q
    .order("editor_rating", { ascending: false, nullsFirst: false })
    .limit(limit);

  const { data, error } = await q;

  type RagRow = {
    slug: string;
    name: string;
    tagline: string;
    description: string | null;
    pricing_model: string;
    key_features: string[] | null;
    use_cases: string[] | null;
    editor_rating: number | null;
    categories: { name: string; slug: string } | null;
  };

  let rows = (data as RagRow[] | null) ?? [];

  // If the search returned nothing, fall back to top-rated tools so the LLM
  // always has some context to recommend from.
  if ((error || rows.length === 0) && terms.length > 0) {
    const { data: fallback } = await supabase
      .from("tools")
      .select(
        "slug, name, tagline, description, pricing_model, key_features, use_cases, editor_rating, categories(name, slug)"
      )
      .eq("status", "published")
      .order("editor_rating", { ascending: false, nullsFirst: false })
      .limit(limit);
    rows = (fallback as RagRow[] | null) ?? [];
  }

  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    pricing_model: r.pricing_model,
    category: r.categories?.name ?? null,
    editor_rating: r.editor_rating,
    key_features: Array.isArray(r.key_features) ? r.key_features.slice(0, 4) : [],
    use_cases: Array.isArray(r.use_cases) ? r.use_cases.slice(0, 3) : [],
  }));
}

/**
 * Lightweight public-facing tool shape used when the frontend needs to render
 * "mentioned" tool cards after a chat response.
 */
export interface MentionedTool {
  slug: string;
  name: string;
  tagline: string;
  pricing_model: string;
  category: string | null;
  website_url: string;
  logo_url: string | null;
}

/**
 * Fetch a compact set of tools by slug shaped for chat rendering (small
 * payload, includes website_url and logo_url for the tool-card avatars).
 * Renamed to avoid colliding with the fuller `getToolsBySlugs` above, which
 * returns `ToolWithCategory[]`.
 */
export async function getToolsForChatMeta(
  slugs: string[]
): Promise<MentionedTool[]> {
  if (slugs.length === 0) return [];
  const unique = Array.from(new Set(slugs)).slice(0, 25);
  const supabase = await createClient();

  const { data } = await supabase
    .from("tools")
    .select(
      "slug, name, tagline, pricing_model, website_url, logo_url, categories(name)"
    )
    .eq("status", "published")
    .in("slug", unique);

  type Row = {
    slug: string;
    name: string;
    tagline: string;
    pricing_model: string;
    website_url: string;
    logo_url: string | null;
    categories: { name: string } | null;
  };

  const rows = (data as Row[] | null) ?? [];
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    pricing_model: r.pricing_model,
    category: r.categories?.name ?? null,
    website_url: r.website_url,
    logo_url: r.logo_url,
  }));
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
