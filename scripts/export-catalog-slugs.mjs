#!/usr/bin/env node
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

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { data: published, error } = await supabase
  .from("tools")
  .select("slug, name, website_url, pricing_model, categories(slug, name)")
  .eq("status", "published")
  .order("slug");

if (error) throw error;

const { data: archived } = await supabase
  .from("tools")
  .select("slug")
  .eq("status", "archived")
  .order("slug");

const { data: categories } = await supabase
  .from("categories")
  .select("slug, name")
  .order("slug");

const fc1 = [];
const fc2 = [];
const fc3 = [];

for (const tool of published || []) {
  const cat = tool.categories?.slug || "unknown";
  const entry = {
    slug: tool.slug,
    name: tool.name,
    website_url: tool.website_url,
    category: cat,
  };
  if (
    [
      "chatbots-assistants",
      "research-search",
      "writing-content",
      "ai-education",
    ].includes(cat)
  ) {
    fc1.push(entry);
  } else if (
    [
      "coding-development",
      "ai-agents",
      "agents-automation",
      "mcp-skills-platforms",
      "models-infrastructure",
      "llm-providers",
      "local-open-source",
    ].includes(cat)
  ) {
    fc2.push(entry);
  } else {
    fc3.push(entry);
  }
}

const out = {
  exportedAt: new Date().toISOString(),
  publishedCount: published?.length || 0,
  published: (published || []).map((t) => ({
    slug: t.slug,
    name: t.name,
    website_url: t.website_url,
    category: t.categories?.slug,
    pricing_model: t.pricing_model,
  })),
  archived: (archived || []).map((t) => t.slug),
  categories: categories || [],
  factCheckBatches: { fc1, fc2, fc3 },
};

const outPath = path.join(root, "scripts", "catalog-slugs.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Published: ${out.publishedCount}, FC batches: ${fc1.length}/${fc2.length}/${fc3.length}`);
