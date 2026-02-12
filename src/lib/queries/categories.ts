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

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (!categories) return [];

  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from("tools")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .eq("category_id", category.id);

      return { ...category, tool_count: count || 0 };
    })
  );

  return categoriesWithCount;
}
