# AiCensus Freshness Loop — Tracker

Loop state for the recurring freshness work sessions. See LOOP-PROMPT.md for the loop contract and CONTENT-AUDIT-2026-07.md for full audit detail.

## Backlog

### P0 — Structural/trust
- [ ] 1. Reconcile repo SQL vs live DB (153 vs 219 tools; 82 no-op updates; expansion-30 possibly unapplied)
- [ ] 2. Fix src/lib/best-for.ts references to 10 slugs missing from live
- [ ] 3. Rewrite blog/chatgpt-vs-claude-vs-gemini.mdx with current lineups
- [ ] 4. Apply Windsurf→Devin Desktop rebrand in tool records (keep slug windsurf)

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

### Loop 1 — 2026-07-20 (in progress)
- Batch: P0-3 (chatgpt-vs-claude-vs-gemini rewrite) + P0-4 (Windsurf rebrand)
- Status: started
