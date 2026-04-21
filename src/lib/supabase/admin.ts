import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for privileged server-only operations.
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. NEVER import from
 * client components or any code that ships to the browser.
 *
 * Returns null if env vars are missing so callers can decide whether to
 * fail open (dev ergonomics) or closed (production). In production the
 * service-role key must be set, otherwise server-only features that
 * depend on it (e.g. rate limiting) will silently no-op.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
