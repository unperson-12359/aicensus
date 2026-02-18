import { createClient } from "@/lib/supabase/server";
import type { ProjectMessage } from "@/lib/types/database";

export async function getUserMessages(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_messages")
    .select("*")
    .eq("recipient_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data as ProjectMessage[]) || [];
}

export async function getUnreadMessageCount(userId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("project_messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_user_id", userId)
    .eq("is_read", false);

  if (error) return 0;
  return count || 0;
}
