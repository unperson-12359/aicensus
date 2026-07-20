# AiCensus Freshness Loop — Tracker

Loop state for the recurring freshness work sessions. See LOOP-PROMPT.md for the loop contract and CONTENT-AUDIT-2026-07.md for full audit detail.

## Backlog

### P0 — Structural/trust
- [x] 1. Reconcile repo SQL vs live DB — DONE Loop 1 (backfill migration; replay 244 == live 244)
- [x] 2. best-for.ts slug refs — RESOLVED Loop 1 (fresh live DB has all 10 slugs; check:links passes)
- [x] 3. Rewrite blog/chatgpt-vs-claude-vs-gemini.mdx — DONE Loop 1 (pending production deploy)
- [x] 4. Windsurf→Devin Desktop rebrand — DONE Loop 1 (migration written; MUST be applied in Supabase)

### P1 — Freshness system
- [ ] 5. Migration: tools += pricing_as_of, last_verified_at, aka, successor_slug + display on tool pages
- [ ] 6. Fix high-traffic records (arrays included): chatgpt, gemini, grok, deepseek, midjourney, github-copilot, cursor, character-ai, arc-max/dia, elevenlabs, suno, microsoft-copilot
- [ ] 7. Archive dall-e-3 and arc-max with successor pointers
- [ ] 8. Render `updated` frontmatter + dateModified in blog JSON-LD; refresh best-ai-writing-tools, best-ai-video-tools-2026, run-ai-locally-open-source-models, best-free-ai-tools-2026

### P2 — Quality
- [ ] 9. FAQPage JSON-LD from existing ## FAQ sections
- [ ] 10. "How we rate" methodology page
- [ ] 11. Fix free-tools cannibalization; enforce no-signup promise; consolidate 3 framework posts
- [ ] 12. Resolve Jasper price contradiction; batch-verify writing-tools price table

### P3 — Polish
- [ ] 13. Expand top-ai-tools-for-building-websites
- [ ] 14. Retitle elevenlabs-vs-higgsfield (voice vs video)
- [ ] 15. editor_rating recalibration proposal

## Run log

### Loop 1 — 2026-07-20 (completed; push blocked on git credentials)
- Batch: P0-3 (article rewrite) + P0-4 (Windsurf rebrand). Bonus: P0-1 + P0-2 completed
  via inherited reconcile/backfill work (validated: replay 244 == live 244, check:links passes).
- Files changed:
  - src/content/blog/chatgpt-vs-claude-vs-gemini.mdx — full rewrite, `updated: 2026-07-20`
  - supabase/migrations/20260720000000_windsurf_devin_desktop_rebrand.sql (2 rows, arrays included)
  - supabase/migrations/20260720120000_backfill_live_catalog_lineage.sql (94 rows, ON CONFLICT DO NOTHING)
  - scripts/{reconcile-catalog.py, generate-lineage-migration.mjs, validate-lineage-migration.py,
    catalog-slugs.json, reconcile-report.json}
- Verification sources (2026-07-20):
  - OpenAI: GPT-5.6 Sol/Terra/Luna GA Jul 9 2026; plans Free/Go $8/Plus $20/Pro $100/$200/Business $25
    (aipricing.guru 2026-07-20; techjacksolutions 2026-07-09)
  - Anthropic: Fable 5 flagship (GA Jun 9), Opus 4.8, Sonnet 5 default since Jun 30, Haiku 4.5;
    Pro $20, Max $100/$200 (ernie55ernie.github.io 2026-07-01; tygartmedia tracker 2026-07-06)
  - Google: Gemini 3.1 Pro flagship, 3.5 Flash default; AI Plus $4.99 (some sources say $7.99 —
    regional/intro variance, worded cautiously), AI Pro $19.99, Ultra $99.99/$199.99
    (saganote 2026-07-11; pricepertoken 2026-06-25; gamsgo 2026-07-09)
  - Windsurf→Devin Desktop: rebrand Jun 2 2026, Cascade EOL Jul 1 2026, windsurf.com → devin.ai/desktop,
    Free/Pro $20/Max $200/Teams $80+$40 seat (zemith 2026-06-25; vibecoding.app 2026-06-17;
    theaiagentindex 2026-06-24; apidog 2026-06-03) — ⚡ CONFIRMED, multi-source
  - Claude web search available on all plans (multi-source consensus) — old "no browsing" claim removed
- Detection pass:
  - Blog watchlist grep: 29 hits / 11 files (run-ai-locally 8, best-free-ai-tools 5,
    cursor-vs-copilot 4, hallucinations 3 — matches P1/P3 backlog, no new articles affected)
  - supabase/ grep: 41 hits — mostly historical records in old migrations/seed (do NOT edit);
    live values come from latest migrations
  - URL spot-check (8): all live; midjourney.com + canva.com return 403 to bots (bot-blocking,
    almost certainly live — recheck in browser next loop); windsurf.com 200 (redirects to devin.ai in browser)
- Verification: eslint clean; check:links passed (27 posts, 244 tools, 19 categories); next build OK
- Commit bfee9b9 PUSHED to main 2026-07-20 (Vercel auto-deploys).
  - Root cause of push failure: stale GitHub account (mauriciogrs93) in Windows Credential
    Manager; fixed by switching git credential.helper to GitHub CLI (gh, logged in as repo owner).
- DB changes APPLIED to production via PostgREST (scripts/apply-pending-migrations-rest.py):
  - backfill: all 94 rows already present live (migration is repo-lineage only) — verified 94/94
  - windsurf -> "Devin Desktop (formerly Windsurf)", website_url devin.ai/desktop — verified live
  - codeium repositioned — applied
- Cache revalidation: REVALIDATION_SECRET not in .env.local (Vercel-only), endpoint not callable
  from here; /tools/[slug] pages use 1h ISR so updates propagate automatically within the hour.
- NEXT BATCH (Loop 2): P1-5 (freshness columns migration + tool-page display) + P1-6
  (high-traffic record fixes: chatgpt, gemini, grok, deepseek, midjourney, github-copilot — arrays included)
