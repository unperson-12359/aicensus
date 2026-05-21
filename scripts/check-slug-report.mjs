#!/usr/bin/env node
/**
 * Human-readable slug integrity report for static catalogs vs published tools.
 * Exits 0 always — use `npm run check:links` in CI to fail on broken slugs.
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

function extractQuotedValues(text, pattern) {
  const values = [];
  for (const match of text.matchAll(pattern)) values.push(match[1]);
  return values;
}

function missingSlugs(referenced, published) {
  return [...new Set(referenced)].filter((slug) => !published.has(slug)).sort();
}

async function main() {
  const env = {
    ...readEnvFile(path.join(root, ".env")),
    ...readEnvFile(path.join(root, ".env.local")),
    ...process.env,
  };

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: tools, error } = await supabase
    .from("tools")
    .select("slug")
    .eq("status", "published")
    .order("slug");

  if (error) throw error;

  const published = new Set((tools || []).map((tool) => tool.slug));

  const stacksText = fs.readFileSync(path.join(root, "src/lib/stacks.ts"), "utf8");
  const bestForText = fs.readFileSync(path.join(root, "src/lib/best-for.ts"), "utf8");
  const comparisonsText = fs.readFileSync(
    path.join(root, "src/lib/popular-comparisons.ts"),
    "utf8"
  );
  const explorerText = fs.readFileSync(path.join(root, "src/lib/stack-explorer.ts"), "utf8");

  const stackSlugs = extractQuotedValues(stacksText, /toolSlug:\s*"([^"]+)"/g);
  const bestSlugs = extractQuotedValues(bestForText, /\{\s*slug:\s*"([^"]+)",\s*pitch:/g);
  const comparisonSlugs = [];
  for (const block of comparisonsText.matchAll(/slugs:\s*\[([^\]]+)\]/g)) {
    comparisonSlugs.push(...extractQuotedValues(block[1], /"([^"]+)"/g));
  }
  const explorerSlugs = [];
  for (const block of explorerText.matchAll(/toolSlugs:\s*\[([\s\S]*?)\]/g)) {
    explorerSlugs.push(...extractQuotedValues(block[1], /"([^"]+)"/g));
  }

  const sections = [
    ["stacks.ts", stackSlugs],
    ["best-for.ts", bestSlugs],
    ["popular-comparisons.ts", comparisonSlugs],
    ["stack-explorer.ts", explorerSlugs],
  ];

  console.log(`Published tools in Supabase: ${published.size}\n`);

  let totalMissing = 0;
  for (const [label, slugs] of sections) {
    const missing = missingSlugs(slugs, published);
    totalMissing += missing.length;
    console.log(`${label}: ${missing.length} missing`);
    for (const slug of missing) console.log(`  - ${slug}`);
    if (missing.length === 0) console.log("  (none)");
    console.log("");
  }

  console.log(`Total missing slug references: ${totalMissing}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
