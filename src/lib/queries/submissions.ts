import { createClient } from "@/lib/supabase/server";
import type { Submission } from "@/lib/types/database";

export async function createSubmission(
  submission: Omit<Submission, "id" | "status" | "admin_notes" | "reviewed_at" | "reviewed_by" | "approved_tool_id" | "created_at">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .insert(submission)
    .select()
    .single();

  if (error) throw error;
  return data as Submission;
}

export async function getSubmissions(status?: "pending" | "approved" | "rejected") {
  const supabase = await createClient();

  let query = supabase
    .from("submissions")
    .select("*, categories:tool_category_id(name)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getPendingSubmissionCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) return 0;
  return count || 0;
}
