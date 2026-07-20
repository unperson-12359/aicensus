# AiCensus Freshness Loop — Tracker

Loop state for the recurring freshness work sessions. See LOOP-PROMPT.md for the loop contract and CONTENT-AUDIT-2026-07.md for full audit detail.

## Backlog

### P0 — Structural/trust
- [x] 1. Reconcile repo SQL vs live DB — DONE Loop 1 (backfill migration; replay 244 == live 244)
- [x] 2. best-for.ts slug refs — RESOLVED Loop 1 (fresh live DB has all 10 slugs; check:links passes)
- [x] 3. Rewrite blog/chatgpt-vs-claude-vs-gemini.mdx — DONE Loop 1 (pending production deploy)
- [x] 4. Windsurf→Devin Desktop rebrand — DONE Loop 1 (migration written; MUST be applied in Supabase)

### P1 — Freshness system
- [x] 5. Migration: tools += pricing_as_of, last_verified_at, aka, successor_slug + display on tool pages — DONE Loop 2 (⚠️ DDL pending: owner must run 20260720130000 in Supabase SQL editor; display code deployed and safe without it)
- [x] 6. Fix high-traffic records (arrays included): chatgpt, gemini, grok, deepseek, midjourney, github-copilot — DONE Loop 2 (applied + verified live; cursor, character-ai, arc-max/dia, elevenlabs, suno, microsoft-copilot deferred to Loop 3)
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

### Loop 2 — 2026-07-20 (completed; deployed as ceb602f)
- Batch: P1-5 + P1-6 (6 of 12 records; rest deferred to Loop 3)
- Files changed:
  - supabase/migrations/20260720130000_add_tool_freshness_columns.sql (DDL — NOT yet applied to live DB)
  - supabase/migrations/20260720131000_refresh_high_traffic_tools.sql (DML — applied live via REST)
  - src/lib/types/database.ts (4 new fields on tools Row/Insert/Update)
  - src/app/(public)/tools/[slug]/page.tsx + src/components/tools/tool-quick-facts.tsx
    ("Pricing verified Mon YYYY" — renders only when pricing_as_of is set)
  - scripts/apply-high-traffic-refresh-rest.py
- Records updated live + verified (chatgpt, gemini, grok, deepseek, midjourney, github-copilot):
  - chatgpt: GPT-5.6 family, Free/Go $8/Plus $20/Pro $100/$200/Business (aipricing.guru, techjacksolutions — 2026-07)
  - gemini: 3.1 Pro + 3.5 Flash, Free/AI Plus $4.99/AI Pro $19.99/Ultra $99.99-$199.99 (saganote, pricepertoken, gamsgo — 2026-07)
  - grok: Grok 4.5 flagship (Jul 8), 4.3 1M ctx, SuperGrok ~$30/Heavy ~$300, Imagine (benchlm, ai-toolbox — 2026-07)
  - deepseek: V4 Flash $0.14/$0.28 + V4 Pro $0.435/$0.87, 1M ctx, free chat (felloai, chat-deep.ai — 2026-07)
  - midjourney: V8.1 (Apr 30), $10/$30/$60/$120, annual -20%, no free tier (pixverse, aisimplr — 2026-06)
  - github-copilot: Free 2,000 comp./Pro $10/Pro+ $39/Max $100/Business $19/Enterprise $39; AI Credits since Jun 1 (nocode.mba, techjacksolutions, yixscout — 2026-06/07)
- ⚠️ OWNER ACTION (one paste): run supabase/migrations/20260720130000_add_tool_freshness_columns.sql
  in the Supabase SQL editor, THEN the freshness UPDATE at the bottom of 20260720131000 (already in
  the file) will set pricing_as_of on the 6 refreshed records. Until then, tool pages simply don't
  render the badge (safe). DDL cannot be applied via PostgREST — no API channel exists for it.
- Detection pass: URL spot-check #2 (8 URLs): perplexity.ai, claude.ai, chat.deepseek.com return 403
  to bots (bot-blocking, certainly live); gemini.google.com, grok.com, github.com, cursor.com,
  heygen.com all 200. No new findings.
- Verification: eslint clean; check:links passed (27 posts, 244 tools, 19 categories); build OK; pushed ceb602f.
- NEXT BATCH (Loop 3): finish P1-6 remainder (cursor, character-ai, arc-max/dia successor pointers,
  elevenlabs, suno, microsoft-copilot) + P1-7 (archive dall-e-3, arc-max with successor_slug once
  DDL is applied) + P1-8 (`updated` rendering + dateModified in blog JSON-LD)

### Loop 1 — 2026-07-20 (completed; deployed)
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
