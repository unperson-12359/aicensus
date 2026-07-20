# SEO Indexing Audit — AiCensus (aicensus.co)

Date: 2026-07-20
Branch: `seo-indexing-fixes`
Scope: technical indexing/crawlability audit of the codebase, verified against the live
deployment and the Search Console export in `.gsc-export/` (May 2026).

---

## Executive summary

**No hard indexing blocker exists in the codebase.** The "zero Google results even for
`aicensus.co`" symptom is not explained by robots.txt, noindex tags, sitemap, canonicals,
metadata, or rendering mode — all of those were audited and verified healthy, both in code
and against the live site:

- `https://aicensus.co/robots.txt` allows everything except `/api/` and declares the sitemap
  (`src/app/robots.ts:6-15`).
- `https://aicensus.co/sitemap.xml` serves **679 URLs** with correct absolute
  `https://aicensus.co` URLs — all 244 tools, 244 alternatives pages, 19 categories,
  16 stacks, 21 best-of pages, 16 MCPs, 79 comparisons, 27 blog posts, 13 static pages.
- Live HTML responses contain **no** `noindex` meta and **no** `X-Robots-Tag` header;
  `<meta name="robots" content="index, follow">` is present on every page.
- All page types render **full server-side HTML** (SSR/SSG, not client-only). Verified:
  homepage returns 203 KB of HTML with real tool links, unique `<title>`, and canonical.
- `site:aicensus.co` currently returns indexed pages (home, contact, terms, faq, changelog),
  and the GSC export shows 643 indexed pages with impressions as of 2026-05-21.

The real problems found are **crawl-efficiency and duplicate-surface issues** (High 1–2
below), which plausibly feed the 112 URLs stuck in "Discovered/Crawled — currently not
indexed" in the GSC export. Rendering note: pages are SSR, **not** client-rendered, so no
rendering-mode conversion is needed.

---

## Blockers

None found in code. See "Manual / dashboard items" for off-repo checks that could still
explain a total-invisibility episode (e.g. a past domain misattachment or manual action).

---

## High severity

### H1. ISR is dead code — every catalog page is per-request SSR with `no-store`

**File:** `src/lib/supabase/server.ts:4-5`

```ts
export async function createClient() {
  const cookieStore = await cookies();
```

`cookies()` is a Next.js Dynamic API. Every page that uses the catalog query layer
(`src/lib/queries/tools.ts`, `src/lib/queries/categories.ts` — both import this client)
bails out of static rendering entirely. The `export const revalidate = 3600` and
`generateStaticParams` exports on those pages are inert.

**Evidence:**

- `.next/prerender-manifest.json` contains only 58 static routes (blog posts, `/mcps/*`,
  content-free pages). Absent: `/`, `/tools`, all 244 `/tools/[slug]`, alternatives,
  `/categories`, `/categories/[slug]`, `/best/[slug]`, `/stacks/[slug]`, `/compare/*`.
- Live response headers for `/` and `/tools`:
  `cache-control: private, no-cache, no-store, max-age=0, must-revalidate` and
  `x-vercel-cache: MISS`.
- `src/app/(public)/tools/[slug]/page.tsx:42` declares `revalidate = 3600` but has no
  `generateStaticParams` and is rendered on demand every request.

**Impact:** every Googlebot hit performs a live Supabase round trip — slow TTFB, zero edge
caching, and any Supabase latency/outage produces slow or failed responses exactly when
Google crawls. On a new domain with thin trust, this is a strong contributor to
"Crawled/Discovered — currently not indexed" (112 URLs in the GSC export).

**Fix (this branch):** cookie-less Supabase client for the read-only catalog query layer,
plus `generateStaticParams` on `/tools/[slug]` so all 244 tool pages prerender at build
(verified: `x-nextjs-cache: HIT`, `s-maxage=3600` locally).

### H2. `aicensus.vercel.app` serves a full duplicate of the site

**Verified live:** `curl -I https://aicensus.vercel.app/` → HTTP 200, full site, no
redirect, no `X-Robots-Tag`. There is no `vercel.json` in the repo and no host rule covering
the default deployment domain in `next.config.ts:44-61` (only `www.aicensus.co`,
`www.aicensus.xyz`, `aicensus.xyz` redirect to the apex).

**Impact:** duplicate-content surface splitting signals on a new domain; Google can index
the `vercel.app` URL instead of (or alongside) the canonical host.

**Fix (this branch):** `X-Robots-Tag: noindex, nofollow` header scoped to the
`aicensus.vercel.app` host in `next.config.ts`. Also consider disabling the deployment URL
in the Vercel dashboard.

---

## Medium severity

### M1. Homepage has no self-referencing canonical

**File:** `src/app/(public)/page.tsx:49-61` — `generateMetadata` sets title/description/OG
but no `alternates.canonical`. Every other indexable page type has one. Risky given the
`.xyz` → `.co` domain migration (`next.config.ts:44-61`).

**Fix (this branch):** add `alternates: { canonical: "/" }`.

### M2. Category pages: contradictory `force-dynamic` + `generateStaticParams`

**File:** `src/app/(public)/categories/[slug]/page.tsx:14,23` — declares
`export const dynamic = "force-dynamic"` **and** `generateStaticParams`. The force-dynamic
wins; the static params are dead code. Looks like an abandoned ISR attempt.

**Fix (this branch):** remove `force-dynamic`, add `revalidate = 3600`. Pagination via
`searchParams` continues to work (per-URL ISR caching).

### M3. Sitemap degrades silently

**File:** `src/app/sitemap.ts:110-112` — the entire tool/category section (488 of 679 URLs)
is wrapped in `try/catch` with an **empty catch**. If Supabase env vars or connectivity fail
on Vercel, the sitemap silently shrinks to ~190 URLs with no error anywhere. Additionally,
`lastModified: new Date()` on every static entry makes `lastmod` useless as a freshness
signal, and `/privacy`, `/terms`, `/cookies` exist as pages but are missing from the sitemap.

**Fix (this branch):** log failures with `console.error`; add the legal pages.

---

## Low severity (reported, not fixed in this branch)

- **L1.** 2 of the 81 curated compare pairs collapse to the same canonical path after slug
  normalization → 79 unique `/compare/*` URLs in the sitemap
  (`src/lib/popular-comparisons.ts`, `src/lib/compare-urls.ts:8-10`).
- **L2.** Trailing-slash URLs (`/tools/notion/`) 404 instead of redirecting to the canonical
  form (Next.js default, `trailingSlash` not set in `next.config.ts`).
- **L3.** Uppercase slug variants (`/tools/Notion`) 404 rather than redirecting
  (`src/lib/queries/tools.ts:201-213` does exact-match `.eq("slug", slug)`). Safe, but no
  recovery.
- **L4.** GSC export rows to re-check after deploy: 44 "Alternate page with proper
  canonical" (mostly by-design: compare slug-order redirects at
  `src/app/(public)/compare/[...slugs]/page.tsx:82-84` and paginated category pages
  canonicalizing to page 1), 2×404, 1 soft 404, 1 noindex exclusion (likely `/saved`, which
  is intentional).

---

## Verified healthy (no action needed)

- **Rendering:** all page types SSR/SSG with full HTML. Blog (27 posts) and MCPs (17 pages)
  are true SSG in the prerender manifest. No client-only pages in the indexable surface.
- **robots.txt:** `src/app/robots.ts` — `allow: /`, `disallow: /api/`, sitemap declared,
  correct host fallback (`https://aicensus.co`).
- **noindex:** global `robots: { index: true, follow: true }` in `src/app/layout.tsx:77-87`;
  deliberate noindex only where appropriate — filtered/paginated `/tools`
  (`tools/page.tsx:85-88`), parameterized `/stacks/build`, uncurated `/compare` combos
  (`src/lib/compare-urls.ts:24-27`), `/saved` (`saved/page.tsx:13`), 404. No
  `X-Robots-Tag` anywhere; `next.config.ts:64-76` sets only security headers.
- **Metadata:** unique titles and descriptions per page type via `generateMetadata`;
  `metadataBase` set to `https://aicensus.co` (`src/app/layout.tsx:32-34`); GSC verification
  meta present.
- **Canonicals:** self-referencing on every page type except the homepage (M1); compare
  pages canonicalize slug order and 301 to the normalized path.
- **Host redirects:** `www.aicensus.co`, `www.aicensus.xyz`, `aicensus.xyz` →
  `https://aicensus.co` 301s (`next.config.ts:44-61`); http→https handled by Vercel.
- **404s:** all dynamic routes call `notFound()` on unknown slugs; real 404 status with
  noindex (`src/app/not-found.tsx`).
- **Stale-content redirects:** 10 archived tool slugs 301 to related pages
  (`next.config.ts:13-35`).

---

## Manual / dashboard items (cannot be fixed in this repo)

1. **Google Search Console:** resubmit the sitemap, run URL Inspection → "Request Indexing"
   on money pages (`/`, `/tools`, top categories, top tool pages), and click "Validate Fix"
   on the "Discovered/Crawled — currently not indexed" buckets after these fixes deploy.
2. **GSC health checks:** confirm no manual actions or security issues; verify the
   domain-level property covers both `aicensus.co` and the old `aicensus.xyz`.
3. **Vercel dashboard:** confirm `aicensus.co` is attached as the production domain and
   consider disabling or redirecting the default `aicensus.vercel.app` deployment URL
   (H2's header mitigates this from the repo side).
4. If a total-deindexing episode recurs, check whether the domain was ever attached to a
   different Vercel project/deployment — a misattached domain produces exactly the "zero
   results even for the domain name" symptom and is invisible from the codebase.
