# SEO Plan — 2026-07-20

Compiled from a 3-agent end-to-end audit (technical, on-page, architecture/indexation).
Context: GSC shows 643 indexed / 160 not indexed; 95 "Discovered — not indexed",
17 "Crawled — not indexed", 44 "Alternate page with proper canonical", 2 hard 404s
(archived tools), 1 soft 404.

The foundation is solid (canonicals everywhere, curated compare indexation, broad JSON-LD,
host dedup, robots clean). The plan below fixes crawl-trust, thin programmatic surfaces,
heading/metadata fundamentals, and E-E-A-T signals.

## Wave 1 — Mechanical/code (this session)

| # | Fix | Why | Files |
|---|---|---|---|
| 1 | Create `/cookies` page (GA + affiliate links make it necessary) | Sitemap currently lists a 404 — degrades sitemap trust sitewide | new page, sitemap already lists it |
| 2 | Prune alternatives surface: sitemap + index ONLY curated tool_alternatives; `noindex,follow` on category-fallback versions | ~200 thin near-duplicate URLs = prime suspect for the 95+17 | sitemap.ts, alternatives/page.tsx, queries |
| 3 | Unified param policy: `?page>1`, `?tag=`, filter URLs → self-canonical + `noindex,follow` (one policy everywhere, replacing canonical-to-page-1) | Clears the 44 alternate-canonicals; saves crawl budget | blog/page.tsx, categories/[slug]/page.tsx, alternatives/page.tsx |
| 4 | Empty states: category w/ 0 tools → `notFound()`; DB-error states throw to error boundary (500) instead of silent empty 200s | Kills the soft-404 class | categories/[slug]/page.tsx, tools/page.tsx, page.tsx, stacks/[slug]/page.tsx |
| 5 | 301 `dall-e-3` → /best/ai-image-generators, `arc-max` → /tools/dia | Reclaims equity; clears the 2 hard 404s | next.config.ts |
| 6 | Headings: h1 on /tools, /categories, /categories/[slug] (SectionHeading `as` prop); homepage double-h1 → one | Money pages currently have no h1; homepage has two | section-heading.tsx, 4 pages |
| 7 | Crawlable `/tools/all` A–Z index (plain links, indexable, linked from /tools + footer); raise TOOLS_PER_PAGE to 24 | Deep tools are sitemap-only today; every tool gets a 2-click JS-free path | new page, tools/page.tsx, footer |
| 8 | Sitemap honesty: blog lastModified = `updated ?? date`; drop fake `new Date()` on static pages; add /stacks/build | Google discounts dishonest lastmod | sitemap.ts |
| 9 | Metadata system: `title.template: "%s | AiCensus"` + strip manual suffixes; honor DB meta_title/meta_description (dead fields today); tool description template capped ~160 chars | Consistent SERP branding; enables per-tool overrides | layout.tsx, tools/[slug]/page.tsx, others |
| 10 | JSON-LD upgrades: SoftwareApplication Offer price (0 for free/freemium) + Review datePublished/reviewBody; Article → BlogPosting + image + mainEntityOfPage; dateModified on compare/best JSON-LD | Rich-result eligibility + freshness signals | tools/[slug]/page.tsx, blog/[slug]/page.tsx, compare, best |
| 11 | 308 → 307 for out-of-range pagination clamping | Hard-cached 308s strand bots when catalog grows | 3 pages |
| 12 | ToolLogo → next/image with alt (keeps span fallback) | Lazy-loading, AVIF/WebP, image SEO | tool-logo.tsx |
| 13 | Blog sitemap `updated` + welcome post: expand slightly or noindex; trim 6 over-long meta descriptions | Thin/over-long snippets | sitemap.ts, mdx frontmatter |

## Wave 2 — Content (swarm)

| # | Fix | Scope |
|---|---|---|
| 14 | De-thin 19 category pages: 150–300w unique intro + cross-links to matching /best and /blog | DB/category descriptions + page render |
| 15 | "Related guides" module on tool pages (category→2–3 blog posts) + homepage "Latest guides" strip | new component + mapping data |
| 16 | Hand-written verdicts for top ~20 compare pairs; vary boilerplate FAQ | comparison-content.ts + data |
| 17 | ai-meeting-notes-tools-guide: add per-tool links (currently zero) | 1 mdx |

## Wave 3 — Later (parked)

- Named author profiles + Person JSON-LD (biggest E-E-A-T gap)
- Dynamic per-route OG images (blog posts, tool pages)
- Organization logo → square; HowTo → ItemList on stack pages
- Per-page OG on utility pages; blog tag pages → static with unique copy (if demand)

## Policy decisions (where auditors disagreed)

- Paginated URLs: `noindex,follow` + self-canonical (NOT indexable "Page N") — crawl budget
  is the binding constraint (95 not-indexed); deep discovery is solved by /tools/all instead.
- Compare combos: keep as-is (curated-only indexing is correct); monitor.
- Category intros live in DB (categories table) so they render everywhere; fall back gracefully.

## Success metrics (check in 30–60 days)

- "Discovered — not indexed" 95 → declining; sitemap-listed URLs ≈ indexed URLs
- 44 alternate-canonical → ~0; soft 404s → 0; hard 404s → 0
- Rich Results Test: BlogPosting + SoftwareApplication price/review valid
