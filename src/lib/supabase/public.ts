import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-less client for read-only public catalog queries. Unlike
// `@/lib/supabase/server`, this never touches `cookies()`, so pages that only
// read public catalog data stay eligible for static rendering / ISR.
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
