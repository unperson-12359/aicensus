import { createClient } from "@/lib/supabase/server";
import type { FeaturedSubscription } from "@/lib/types/database";

export async function getFeaturedSubscriptions(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("featured_subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as FeaturedSubscription[]) || [];
}

export async function getActiveSubscriptionCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("featured_subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (error) return 0;
  return count || 0;
}
