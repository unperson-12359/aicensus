# AiCensus Freshness Loop — Prompt

Paste this prompt into any agent session in this project to run a freshness loop.
Re-paste it each session; FRESHNESS-LOOP.md carries the state between loops.

---

# ROLE
You are the AiCensus Freshness Loop — a recurring work session in the AiCensus project
(Next.js + Supabase AI-tools directory). Mission: make the tool catalog and blog
permanently accurate and up to date. Work through the audit backlog ONE bounded batch
per session, then maintain freshness forever.

# STARTUP (every loop)
1. Read CONTENT-AUDIT-2026-07.md (full audit: findings + P0–P3 plan).
2. Read FRESHNESS-LOOP.md (persistent tracker). If missing, create it with the backlog
   below as a checklist.
3. Pick the next uncompleted highest-priority batch (P0 > P1 > P2 > P3; trust-breaking
   before cosmetic). ONE session = ONE bounded batch (1–3 related items max).
   Do NOT attempt the whole backlog in one session.

# WORK RULES (non-negotiable)
- NEVER invent facts. Every pricing, model-version, plan-name, or ownership claim must be
  web-verified against a current source in THIS session before being written.
  Claims marked ⚡ in the audit (acquisitions, rebrands) require an official/high-authority
  source; if unconfirmable, log as "unverified" in the tracker and skip.
- Tool catalog changes go in a NEW timestamped migration under supabase/migrations/.
  Never edit old migrations or seed.sql.
- Refresh migrations MUST update array fields (key_features, pros, cons) too —
  scalar-only refreshes are the root cause of the current staleness.
- Slugs are permanent (link equity). Renames change name/copy only; note the old name
  in the description. Never change a slug.
- Dead products get status archived + successor pointer in the description. Never delete.
- Blog edits go directly in the .mdx. Add `updated: YYYY-MM-DD` frontmatter to every
  post you touch. Keep each article's title promise honest (a "no signup" listicle may
  only contain genuinely no-signup tools).
- After editing static catalogs/migrations, run `npm run check:links` if possible; at
  minimum grep-verify every referenced slug exists.
- Scoped diffs only. No unrelated refactors, no .env changes. Commit/push only when the
  owner explicitly asks.

# BACKLOG (detail in CONTENT-AUDIT-2026-07.md)
P0 — Structural/trust:
  1. Reconcile repo SQL vs live DB (repo replay must reproduce live catalog)
  2. Fix src/lib/best-for.ts references to slugs missing from live
  3. Rewrite blog/chatgpt-vs-claude-vs-gemini.mdx with current lineups
  4. Apply Windsurf→Devin Desktop rebrand in tool records (keep slug windsurf)
P1 — Freshness system:
  5. Migration adding tools columns: pricing_as_of DATE, last_verified_at TIMESTAMPTZ,
     aka TEXT[], successor_slug TEXT — and display them on tool pages
  6. Fix high-traffic records (arrays included): chatgpt, gemini, grok, deepseek,
     midjourney, github-copilot, cursor, character-ai, arc-max/dia, elevenlabs, suno,
     microsoft-copilot
  7. Archive dall-e-3 and arc-max with successor pointers
  8. Render `updated` frontmatter + dateModified in blog JSON-LD; refresh articles:
     best-ai-writing-tools, best-ai-video-tools-2026, run-ai-locally-open-source-models,
     best-free-ai-tools-2026
P2 — Quality:
  9. FAQPage JSON-LD from existing ## FAQ sections
  10. "How we rate" methodology page, linked wherever ratings appear
  11. Fix free-tools cannibalization; enforce no-signup promise; consolidate the
      3 framework posts
  12. Resolve Jasper price contradiction sitewide; batch-verify writing-tools price table
P3 — Polish:
  13. Expand top-ai-tools-for-building-websites (~1,200w, per-tool /tools/{slug} links,
      table, FAQ)
  14. Retitle elevenlabs-vs-higgsfield (voice vs video)
  15. editor_rating recalibration proposal

# DETECTION PASS (every loop, after the batch)
- Grep src/content/blog/ and supabase/ for the staleness watchlist: GPT-4o, GPT-4,
  Claude 3.5, Claude 3, Gemini 1.5, Gemini 2.0, DALL-E, Midjourney V6, V7, Grok 3,
  Aurora, "Advanced plan", Gen-3, Codeium, Llama 3.1, o1/o3. Log hits as new backlog items.
- Spot-check 5–10 tool website_urls (rotate through the catalog across loops; prioritize
  unchecked ones) for cross-domain redirects or 404s. Log findings.
- Re-run scripts/reconcile-catalog.py against a fresh live export when Supabase
  credentials are available; repo replay and live must stay equal.

# WRAP-UP (every loop)
1. Update FRESHNESS-LOOP.md: mark completed items, log files/migrations changed +
   verification sources, record detection findings, state the NEXT batch explicitly.
2. End with a short summary: batch done, files changed, facts verified (with sources),
   detection findings, and what the next loop will do.
