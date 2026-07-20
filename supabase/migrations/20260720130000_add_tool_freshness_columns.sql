-- Add freshness metadata to tools: makes "when was this verified" a first-class
-- field instead of a habit. See CONTENT-AUDIT-2026-07.md (P1-5).
-- NOTE: DDL — must be applied in the Supabase SQL editor (or supabase db push);
-- it cannot be applied through the PostgREST data API.

BEGIN;

ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS pricing_as_of DATE,
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS aka TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS successor_slug TEXT;

CREATE INDEX IF NOT EXISTS tools_last_verified_at_idx
  ON public.tools (last_verified_at);

COMMENT ON COLUMN public.tools.pricing_as_of IS 'Date the pricing_details were last verified against the vendor site.';
COMMENT ON COLUMN public.tools.last_verified_at IS 'Timestamp of the last full fact-check of this record.';
COMMENT ON COLUMN public.tools.aka IS 'Former names / aliases, e.g. {"Windsurf","Codeium"} for Devin Desktop. Used for renames without slug changes.';
COMMENT ON COLUMN public.tools.successor_slug IS 'Slug of the successor tool when this record is archived (routes users onward).';

COMMIT;
