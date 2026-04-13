import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/database";

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data as Category[]) || [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Category;
}

export async function getAllCategorySlugs() {
  const supabase = await createClient();

  const { data } = await supabase.from("categories").select("slug");

  return data?.map((c) => c.slug) || [];
}

export type CategoryWithCount = Category & { tool_count: number };

export async function getCategoriesWithToolCount(): Promise<CategoryWithCount[]> {
  const supabase = await createClient();

  // Two parallel queries instead of N+1 (one per category)
  const [categoriesResult, countsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("tools")
      .select("category_id")
      .eq("status", "published"),
  ]);

  if (!categoriesResult.data) return [];

  // Build a count map from the tools query
  const countMap = new Map<string, number>();
  for (const tool of countsResult.data || []) {
    const id = tool.category_id as string;
    countMap.set(id, (countMap.get(id) || 0) + 1);
  }

  return categoriesResult.data.map((category) => ({
    ...(category as Category),
    tool_count: countMap.get(category.id as string) || 0,
  }));
}
