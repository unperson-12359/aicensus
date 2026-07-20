#!/usr/bin/env node
/**
 * Generate a lineage-backfill migration for tools that exist in the live DB
 * but have no INSERT lineage in supabase/ (seed.sql or migrations/).
 *
 * Data source: the LIVE database rows themselves (read-only anon fetch) —
 * nothing is invented; the migration reproduces live rows verbatim so a fresh
 * repo replay converges on the live catalog.
 *
 * Input:  scripts/reconcile-report.json (from scripts/reconcile-catalog.py)
 * Output: supabase/migrations/20260720120000_backfill_live_catalog_lineage.sql
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

function readEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = {
  ...readEnvFile(path.join(root, ".env")),
  ...readEnvFile(path.join(root, ".env.local")),
  ...process.env,
};

const report = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "reconcile-report.json"), "utf8")
);
const slugs = report.live_only;
if (!slugs?.length) {
  console.log("No live-only slugs — nothing to backfill.");
  process.exit(0);
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { data, error } = await supabase
  .from("tools")
  .select("*, categories(slug)")
  .in("slug", slugs);
if (error) throw error;

const found = new Set((data || []).map((t) => t.slug));
const missing = slugs.filter((s) => !found.has(s));
if (missing.length) {
  console.error(`Live fetch missed ${missing.length} slugs (RLS?): ${missing.join(", ")}`);
  process.exit(1);
}

const records = (data || []).map((t) => ({
  slug: t.slug,
  name: t.name,
  tagline: t.tagline,
  description: t.description,
  website_url: t.website_url,
  category_slug: t.categories?.slug ?? null,
  pricing_model: t.pricing_model,
  pricing_details: t.pricing_details,
  editor_rating: t.editor_rating,
  is_verified: t.is_verified ?? false,
  is_featured: t.is_featured ?? false,
  status: t.status ?? "published",
  published_at: t.published_at ?? null,
  company_name: t.company_name,
  founded_year: t.founded_year,
  headquarters: t.headquarters,
  logo_url: t.logo_url,
  affiliate_url: t.affiliate_url,
  meta_title: t.meta_title ?? `${t.name} Review, Pricing, Alternatives | AiCensus`,
  meta_description: t.meta_description ?? (t.description || "").slice(0, 155),
  key_features: t.key_features ?? [],
  pros: t.pros ?? [],
  cons: t.cons ?? [],
  use_cases: t.use_cases ?? [],
  who_its_for: t.who_its_for ?? [],
}));

records.sort((a, b) => a.slug.localeCompare(b.slug));

const jsonBody = records.map((r) => JSON.stringify(r)).join("\n,");
if (jsonBody.includes("$tools$")) {
  console.error("Record content contains the dollar-quote delimiter — aborting.");
  process.exit(1);
}

const sql = `-- Backfill repo lineage for live-only catalog tools (${records.length} rows)
-- Generated 2026-07-20 by scripts/generate-lineage-migration.mjs from LIVE rows.
-- Context: these tools reached production via the ad-hoc supabase/batch3_tools.sql
-- script (plus 1 untracked insert) and were never converted to migrations, so a
-- fresh replay of seed.sql + migrations could not reproduce the live catalog.
-- Rows are copied verbatim from production; ON CONFLICT DO NOTHING makes this a
-- pure backfill that never overwrites newer live edits.

BEGIN;

WITH new_tools AS (
  SELECT *
  FROM jsonb_to_recordset($tools$[
${jsonBody}
]$tools$::jsonb) AS t(
    slug text,
    name text,
    tagline text,
    description text,
    website_url text,
    category_slug text,
    pricing_model text,
    pricing_details text,
    editor_rating numeric,
    is_verified boolean,
    is_featured boolean,
    status text,
    published_at timestamptz,
    company_name text,
    founded_year int,
    headquarters text,
    logo_url text,
    affiliate_url text,
    meta_title text,
    meta_description text,
    key_features jsonb,
    pros jsonb,
    cons jsonb,
    use_cases jsonb,
    who_its_for jsonb
  )
)
INSERT INTO public.tools (
  name,
  slug,
  tagline,
  description,
  website_url,
  category_id,
  pricing_model,
  pricing_details,
  editor_rating,
  is_verified,
  is_featured,
  status,
  published_at,
  company_name,
  founded_year,
  headquarters,
  logo_url,
  affiliate_url,
  meta_title,
  meta_description,
  key_features,
  pros,
  cons,
  use_cases,
  who_its_for
)
SELECT
  t.name,
  t.slug,
  t.tagline,
  t.description,
  t.website_url,
  c.id,
  t.pricing_model::pricing_model,
  t.pricing_details,
  t.editor_rating,
  COALESCE(t.is_verified, false),
  COALESCE(t.is_featured, false),
  COALESCE(t.status, 'published')::tool_status,
  COALESCE(t.published_at, now()),
  t.company_name,
  t.founded_year,
  t.headquarters,
  t.logo_url,
  t.affiliate_url,
  t.meta_title,
  t.meta_description,
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.key_features, '[]'::jsonb))),
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.pros, '[]'::jsonb))),
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.cons, '[]'::jsonb))),
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.use_cases, '[]'::jsonb))),
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.who_its_for, '[]'::jsonb)))
FROM new_tools AS t
LEFT JOIN public.categories AS c ON c.slug = t.category_slug
ON CONFLICT (slug) DO NOTHING;

COMMIT;
`;

const outPath = path.join(
  root,
  "supabase",
  "migrations",
  "20260720120000_backfill_live_catalog_lineage.sql"
);
fs.writeFileSync(outPath, sql);
console.log(`Wrote ${outPath}`);
console.log(`Records: ${records.length}`);
