#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const errors = [];
const warnings = [];

function readFileIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function readEnvFile(filePath) {
  const env = {};
  const text = readFileIfExists(filePath);

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }

  return env;
}

function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, predicate));
    } else if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function normalizeInternalPath(href) {
  if (!href.startsWith("/")) return null;
  const [withoutHash] = href.split("#");
  const [withoutQuery] = withoutHash.split("?");
  return withoutQuery.replace(/\/$/, "") || "/";
}

function extractMarkdownLinks(text) {
  const links = [];
  const markdownLinkPattern = /(?<!!)\[[^\]]+\]\((\/[^)\s]+)[^)]*\)/g;
  const htmlHrefPattern = /href=["'](\/[^"']+)["']/g;

  for (const match of text.matchAll(markdownLinkPattern)) {
    links.push(match[1]);
  }

  for (const match of text.matchAll(htmlHrefPattern)) {
    links.push(match[1]);
  }

  return links;
}

function extractQuotedValues(text, pattern) {
  const values = [];
  for (const match of text.matchAll(pattern)) {
    values.push(match[1]);
  }
  return values;
}

async function fetchAllRows(supabase, table, columns, applyFilters = (query) => query) {
  const rows = [];
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const query = applyFilters(supabase.from(table).select(columns).range(from, to));
    const { data, error } = await query;

    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }

  return rows;
}

function buildStaticRoutes() {
  const appPublicDir = path.join(root, "src", "app", "(public)");
  const pageFiles = walkFiles(appPublicDir, (file) => path.basename(file) === "page.tsx");
  const routes = new Set(["/"]);

  for (const file of pageFiles) {
    const dir = path.dirname(file);
    const rel = path.relative(appPublicDir, dir).replaceAll(path.sep, "/");
    if (rel.includes("[")) continue;
    routes.add(rel === "" ? "/" : `/${rel}`);
  }

  return routes;
}

function checkInternalPath(pathname, source, context) {
  const segments = pathname.split("/").filter(Boolean);
  const rootSegment = segments[0] || "";

  if (context.staticRoutes.has(pathname)) return;

  if (rootSegment === "tools") {
    const slug = segments[1];
    const isAllowedShape =
      segments.length === 2 || (segments.length === 3 && segments[2] === "alternatives");
    if (!isAllowedShape || !context.toolSlugs.has(slug)) {
      errors.push(`${source}: missing tool route ${pathname}`);
    }
    return;
  }

  if (rootSegment === "categories") {
    const slug = segments[1];
    if (segments.length !== 2 || !context.categorySlugs.has(slug)) {
      errors.push(`${source}: missing category route ${pathname}`);
    }
    return;
  }

  if (rootSegment === "blog") {
    const slug = segments[1];
    if (segments.length !== 2 || !context.blogSlugs.has(slug)) {
      errors.push(`${source}: missing blog route ${pathname}`);
    }
    return;
  }

  if (rootSegment === "best") {
    const slug = segments[1];
    if (segments.length !== 2 || !context.bestSlugs.has(slug)) {
      errors.push(`${source}: missing best-of route ${pathname}`);
    }
    return;
  }

  if (rootSegment === "stacks") {
    const slug = segments[1];
    if (segments.length !== 2 || !context.stackSlugs.has(slug)) {
      errors.push(`${source}: missing stack route ${pathname}`);
    }
    return;
  }

  if (rootSegment === "mcps") {
    const slug = segments[1];
    if (segments.length !== 2 || !context.mcpSlugs.has(slug)) {
      errors.push(`${source}: missing MCP route ${pathname}`);
    }
    return;
  }

  if (rootSegment === "compare" && segments.length >= 3) {
    for (const slug of segments.slice(1)) {
      if (!context.toolSlugs.has(slug)) {
        errors.push(`${source}: comparison route ${pathname} references missing tool ${slug}`);
      }
    }
    return;
  }

  errors.push(`${source}: unknown internal route ${pathname}`);
}

function checkToolSlugs(label, slugs, toolSlugs) {
  for (const slug of slugs) {
    if (!toolSlugs.has(slug)) {
      errors.push(`${label}: missing tool slug ${slug}`);
    }
  }
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
    errors.push("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

  const [tools, categories] = supabase
    ? await Promise.all([
        fetchAllRows(
          supabase,
          "tools",
          "slug",
          (query) => query.eq("status", "published").order("slug")
        ),
        fetchAllRows(supabase, "categories", "slug", (query) => query.order("slug")),
      ])
    : [[], []];

  const toolSlugs = new Set(tools.map((tool) => tool.slug));
  const categorySlugs = new Set(categories.map((category) => category.slug));

  const blogDir = path.join(root, "src", "content", "blog");
  const blogFiles = walkFiles(blogDir, (file) => file.endsWith(".mdx"));
  const blogSlugs = new Set(blogFiles.map((file) => path.basename(file, ".mdx")));

  const bestForText = readFileIfExists(path.join(root, "src", "lib", "best-for.ts"));
  const stacksText = readFileIfExists(path.join(root, "src", "lib", "stacks.ts"));
  const stackExplorerText = readFileIfExists(path.join(root, "src", "lib", "stack-explorer.ts"));
  const popularComparisonsText = readFileIfExists(
    path.join(root, "src", "lib", "popular-comparisons.ts")
  );
  const mcpServersText = readFileIfExists(path.join(root, "src", "lib", "mcp-servers.ts"));

  const bestSlugs = new Set(
    extractQuotedValues(bestForText, /^\s*slug:\s*"([^"]+)"/gm)
  );
  const stackSlugs = new Set(
    extractQuotedValues(stacksText, /^\s*slug:\s*"([^"]+)"/gm)
  );
  const mcpSlugs = new Set(extractQuotedValues(mcpServersText, /^\s*slug:\s*"([^"]+)"/gm));

  const context = {
    staticRoutes: buildStaticRoutes(),
    toolSlugs,
    categorySlugs,
    blogSlugs,
    bestSlugs,
    stackSlugs,
    mcpSlugs,
  };

  for (const file of blogFiles) {
    const rel = path.relative(root, file);
    const text = readFileIfExists(file);
    for (const href of extractMarkdownLinks(text)) {
      const pathname = normalizeInternalPath(href);
      if (pathname) checkInternalPath(pathname, rel, context);
    }
  }

  const bestToolSlugs = extractQuotedValues(
    bestForText,
    /\{\s*slug:\s*"([^"]+)",\s*pitch:/g
  );
  const stackToolSlugs = extractQuotedValues(stacksText, /toolSlug:\s*"([^"]+)"/g);
  const stackExplorerToolSlugs = [];
  for (const block of stackExplorerText.matchAll(/toolSlugs:\s*\[([\s\S]*?)\]/g)) {
    stackExplorerToolSlugs.push(...extractQuotedValues(block[1], /"([^"]+)"/g));
  }
  const comparisonToolSlugs = [];
  for (const block of popularComparisonsText.matchAll(/slugs:\s*\[([^\]]+)\]/g)) {
    comparisonToolSlugs.push(...extractQuotedValues(block[1], /"([^"]+)"/g));
  }

  checkToolSlugs("src/lib/best-for.ts", bestToolSlugs, toolSlugs);
  checkToolSlugs("src/lib/stacks.ts", stackToolSlugs, toolSlugs);
  checkToolSlugs("src/lib/stack-explorer.ts", stackExplorerToolSlugs, toolSlugs);
  checkToolSlugs("src/lib/popular-comparisons.ts", comparisonToolSlugs, toolSlugs);

  if (toolSlugs.size === 0) warnings.push("No published tool slugs loaded.");
  if (categorySlugs.size === 0) warnings.push("No category slugs loaded.");

  for (const warning of warnings) console.warn(`Warning: ${warning}`);

  if (errors.length > 0) {
    console.error(`\nLink check failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(
    `Link check passed: ${blogSlugs.size} posts, ${toolSlugs.size} tools, ${categorySlugs.size} categories.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
