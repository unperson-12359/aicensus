import { createClient } from "@/lib/supabase/server";
import type { UserProfile, PortfolioProject, ProjectWithUser } from "@/lib/types/database";

// ============================================================
// PUBLIC QUERIES (Server Components)
// ============================================================

export async function getUserProfileByUsername(username: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("username", username)
    .eq("is_public", true)
    .single();

  if (error) return null;
  return data as UserProfile;
}

export async function getPublishedProjects(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return [];
  return (data as PortfolioProject[]) || [];
}

export async function getProjectBySlug(userId: string, slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*, user_profiles(*)")
    .eq("user_id", userId)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as ProjectWithUser;
}

export async function getFeaturedPortfolios(limit = 12) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as UserProfile[]) || [];
}

export async function getPortfolioUsers(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("user_profiles")
    .select("*", { count: "exact" })
    .eq("is_public", true);

  if (options?.search) {
    query = query.or(
      `display_name.ilike.%${options.search}%,username.ilike.%${options.search}%,bio.ilike.%${options.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;
  return { users: (data as UserProfile[]) || [], count: count || 0 };
}

export async function getAllUsernames() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_profiles")
    .select("username")
    .eq("is_public", true);

  return data?.map((u) => u.username) || [];
}

export async function getAllProjectSlugs() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("portfolio_projects")
    .select("slug, user_profiles!inner(username)")
    .eq("status", "published");

  if (!data) return [];
  return data.map((p) => ({
    username: (p.user_profiles as unknown as { username: string }).username,
    slug: p.slug,
  }));
}

// ============================================================
// DASHBOARD QUERIES (Authenticated user)
// ============================================================

export async function getUserProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as UserProfile;
}

export async function getUserProjects(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data as PortfolioProject[]) || [];
}

export async function getProjectById(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) return null;
  return data as PortfolioProject;
}

// ============================================================
// ADMIN QUERIES
// ============================================================

export async function getPendingProjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*, user_profiles(*)")
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data as ProjectWithUser[]) || [];
}

export async function getPendingProjectCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("portfolio_projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_review");

  if (error) return 0;
  return count || 0;
}

export async function getPublishedProjectCount(userId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("portfolio_projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "published");

  if (error) return 0;
  return count || 0;
}
