# AiCensus Content Audit — Tools Catalog & Blog

**Audit date:** 2026-07-20 · Scope: full tools catalog (seed.sql + migrations + live export) and all 27 blog articles (`src/content/blog/`)

> ⚠️ **Verification caveat:** web-verified items below were checked against third-party sources of varying authority. Extraordinary claims (marked ⚡, e.g. acquisitions) should be confirmed against official announcements before being published on the site.

---

## Executive Summary

The single biggest issue is **not** any individual stale record — it's structural:

1. **The repo SQL cannot reproduce the live catalog.** Repo replay yields **153 tools**; the live DB export (`scripts/catalog-slugs.json`, 2026-05-27) has **219 published**. 99 live tools have no INSERT anywhere in the repo; 82 update records in the two "refresh" migrations are no-ops; all 30 tools in `20260527001000_add_catalog_expansion_30` are missing from the live export.
2. **Refresh migrations never update array fields** (`key_features`/`pros`/`cons`), so seed-era claims (GPT-4o, DALL-E, Midjourney V6, Grok 3) survived both Q2 refreshes.
3. **The highest-traffic blog post is actively misleading.** `chatgpt-vs-claude-vs-gemini` names models that are 2–3 generations old and claims "Claude does not browse the web" (false since 2025).
4. **No "last updated" anywhere** — no `updated` frontmatter, no `dateModified` in JSON-LD, no `pricing_as_of` on tool pages. For a directory whose value prop is freshness, this is the biggest structural gap.

---

# Part 1 — Tools Catalog

## 1A. Catalog overview

| Source | Tools | Notes |
|---|---|---|
| Repo SQL replay (seed + 6 migrations, timestamp order) | **153** (150 published, 3 archived: `sora`, `tome`, `perplexity-pages`) | Canonical-from-repo |
| Live DB export (2026-05-27) | **219 published** | 99 tools have no repo lineage |
| In repo, not in live export | 33 | 30 = expansion-30 migration possibly never applied live + 3 archived |

Migration application stats (repo replay):

| Migration | +New | Updated | No-op updates |
|---|---|---|---|
| seed.sql | 55 | — | — |
| 20260513_refresh_accuracy | 0 | 49 | **61** |
| 20260513_expansion | 21 | 0 | 0 |
| 20260520_growth | 32 | 0 | 0 |
| 20260521_competitor_gap | 15 | 0 | 0 |
| 20260527_refresh_q2 | 0 | 22 | **21** |
| 20260527_expansion_30 | 30 | 0 | 0 |

Repo-replay category counts: productivity 22, coding-development 21, video-audio 17, ai-agents 17, image-generation 13, chatbots-assistants 12, models-infrastructure 11, writing-content 9, research-search 7, design-creative 7, and 8 smaller categories.

## 1B. Confirmed outdated / incorrect tool records (web-verified)

| Slug | Problem | Verified 2026-07 reality |
|---|---|---|
| `windsurf` | Name/URL/copy still "Windsurf, Cognition's agentic IDE" | ⚡ Rebranded to **Devin Desktop** (2026-06); windsurf.com redirects to devin.ai/desktop. Keep slug for link equity, update everything else |
| `codeium` | "extension layer behind Windsurf" | Follows the Windsurf→Devin rebrand; needs repositioning |
| `cursor` | Ownership/model framing stale | ⚡ Reported Anysphere acquisition news (Jun 2026) + GPT-5.x/Composer-era models — verify officially before publishing |
| `chatgpt` | "GPT-4o and o1/o3", "DALL-E built in" | GPT-5.5 default (5.6 preview); images via GPT Image; plans now Free/Go/Plus/Pro/Business |
| `gemini` | "Gemini Advanced", 1M context framing | Advanced retired → Google AI Plus / AI Pro / AI Ultra; flagship Gemini 3.x |
| `grok` | "Grok 3", "Aurora" image gen | Grok 4.5 flagship; Imagine (paid-only); six pricing tiers |
| `deepseek` | "R1 rivaling GPT-4", V3 | Current is V3.2; R2 unreleased; GPT-4 comparison is 2025 framing |
| `midjourney` | "V6 model", vague pricing | V8.1 current; plans $10/$30/$60/$120 |
| `github-copilot` | "premium requests" plans | New Max $100 tier (Jun 2026); AI Credits billing replaced premium requests |
| `microsoft-copilot` | "Image generation with DALL-E" | DALL-E API deprecated (the catalog's own migration notes this) |
| `manus-ai` (live-only) | "Meta acquisition under regulatory review" | ⚡ Meta reportedly moved to unwind the deal (Jun 2026) — and the repo fix for this slug is a **no-op** |
| `arc-max` / `dia` | company_name "The Browser Company" | Acquired by Atlassian (closed Oct 2025); consider archiving arc-max |
| `character-ai` | Omits material change | Under-18 chat ban effective Nov 2025 not mentioned |
| `elevenlabs` | "dubbing in 29+ languages" | 70+ languages (v3); Creator plan repriced $11→$22 |
| `suno` | v4-era features | v5.5 current (Voices cloning, Studio DAW) |

Verified **correct**: `sora` archive, `perplexity` pricing, `phind` shutdown note, and pricing details for heygen/synthesia/descript/runway/bolt-new/lovable/replit/jasper/copy-ai.

## 1C. Suspect entries (pattern-based, not web-verified)

- `dall-e-3` — own pricing notes say "historical context" but status is still **published** → archive it
- `arc-max` — maintenance-mode product published alongside successor `dia`
- `canva`, `n8n`, `otter-ai`, `sui` — only 4 seed tools never touched by any refresh; 2025-era prices
- `devin`, `pi-ai` — vague/unverifiable pricing, pre-restructure copy
- ~15 seed-era records (`pika`, `gamma`, `notion-ai`, `grammarly`, `zapier`, …) with deliberately vague pricing, below the bar set by the Q2 refresh; `notion-ai` still says "Powered by GPT-4 and Claude"
- `sui`, `bankr`, `heurist`, `x402` — crypto infra in an AI catalog; lowest ratings (3.5–3.8); taxonomy fit questionable
- Live miscategorizations: `tavily` (search API in llm-providers), `mubert`/`aiva` (music in video-audio)
- `chatgpt-atlas` — website_url points to a help-center page, not the product
- **99 live-only tools** — no repo lineage at all, unauditable from the repo

## 1D. Data-quality issues

1. **Lineage gap (P0):** 153 repo vs 219 live; 82 no-op updates; 30-tool migration missing live.
2. **Broken static cross-references (P0):** `src/lib/best-for.ts` references 10 expansion-30 slugs (`deepinfra`, `exa`, `hex`, `krisp`, `litellm`, `llamafile`, `roo-code`, `scispace`, `venice-ai`, `warp`) absent from the live export → renders as stubs / fails `check:links`.
3. **Refresh migrations don't update arrays** — root cause of most 1B staleness.
4. **11 pricing_model ↔ pricing_details mismatches** (freemium records with no free tier mentioned).
5. **Duplicates:** windsurf + codeium + devin (one product family); arc-max + dia; dall-e-3 vs ChatGPT image gen.
6. **Rating compression:** mean 4.34, range 3.5–4.9 across 153 tools — little discriminating power.

---

# Part 2 — Blog Articles

## 2A. Freshness verdicts (27 posts)

| Verdict | Posts |
|---|---|
| **STALE (6)** | chatgpt-vs-claude-vs-gemini, run-ai-locally-open-source-models, best-ai-writing-tools, free-ai-tools-no-signup, understanding-ai-hallucinations, top-ai-tools-for-building-websites (also thin, 546w) |
| **NEEDS-REFRESH (6)** | best-ai-video-tools-2026, cursor-vs-github-copilot, claude-code-vs-gemini-cli, best-free-ai-tools-2026, elevenlabs-vs-higgsfield (title mislabels Higgsfield as audio), how-to-use-ai-for-marketing |
| **OK (15)** | remaining posts, mostly May-2026 dated guides and alternatives posts |

## 2B. Confirmed-stale article claims (web-verified)

| Article | Stale claim | Reality (Jul 2026) |
|---|---|---|
| chatgpt-vs-claude-vs-gemini | "Model: GPT-4o / Claude 3.5 Sonnet / Gemini 1.5 Pro" | All three retired/superseded (GPT-5.5/5.6, Sonnet 5/Opus 4.8, Gemini 3.1/3.5) |
| chatgpt-vs-claude-vs-gemini | "Claude does not browse the web" | False since 2025 — web search is free on all tiers |
| chatgpt-vs-claude-vs-gemini | "image generation (DALL-E 3 / Imagen 3)" | Both superseded |
| best-ai-writing-tools + free-ai-tools-no-signup | "free tier gives you GPT-4o mini" | GPT-4o family retired from ChatGPT |
| run-ai-locally-open-source-models | "Llama 3.1 8B still the strongest…", "Llama 4 **will** close it" (future tense) | Llama 4 shipped Apr 2025 — stale even at publication; hardware section predates M4/RTX-50 |
| best-ai-video-tools-2026 | "Gen-3-class models" (Runway) | Gen-4/4.5 current |
| best-free-ai-tools-2026 + cursor-vs-github-copilot | "Codeium — the best free coding assistant" | Codeium rebranded to Windsurf → now Cognition/Devin family |

Still accurate: $20 price points for ChatGPT Plus / Claude Pro / Google AI Pro, Copilot Pro $10, Gemini CLI free tier, Otter/Fathom/Fireflies free tiers.

## 2C. Suspect claims (manual check)

- Jasper price contradiction sitewide: "$39/mo" (marketing post) vs "$49/mo" (writing-tools post)
- Claude Max missing the $100 tier (claude-code-vs-gemini-cli)
- Point prices in best-ai-writing-tools table (Rytr/Sudowrite/QuillBot/Writesonic/Grammarly) unverified
- Granola free-tier wording; DALL-E 3 as "current" in image guide; ai-privacy-guide vendor opt-out paths (annual re-check)
- elevenlabs-vs-higgsfield **title says "AI Audio Tool"** but Higgsfield is video — retitle

## 2D. Content-quality & structure

- **Cannibalization cluster 1 — "free AI tools":** `best-free-ai-tools-2026` vs `free-ai-tools-no-signup` share ~60% of picks; worse, the no-signup post reviews ChatGPT/Claude/Notion AI, which **require accounts — violating its own title promise**.
- **Cluster 2 — "how to pick AI tools":** 3 posts with the same framework content; consolidate to one canonical framework + one beginner 101.
- Meeting-notes guide + comparison is the model to copy (proper cross-linking).
- ≥6 posts have `## FAQ` sections but **no FAQPage JSON-LD**; `[slug]/page.tsx` emits Article schema with `datePublished` only, no `dateModified`.
- Table ratings ("4.7/5") are unsourced — E-E-A-T risk; needs a "How we rate" methodology page.
- `top-ai-tools-for-building-websites`: 546 words, 7 generic `/tools` links instead of per-tool `/tools/{slug}` links.

---

# Part 3 — Prioritized Action Plan

### P0 — Structural / trust-breaking
1. **Restore catalog source-of-truth:** commit the missing migration(s) for the 99 live-only tools (or regenerate seed.sql from live), verify the two 2026-05-27 migrations were actually applied to production, re-export `catalog-slugs.json`, gate CI on "repo replay == live slugs" + `check:links`.
2. **Fix `best-for.ts` stub references** (10 slugs missing from live).
3. **Rewrite `chatgpt-vs-claude-vs-gemini`** — highest-intent query on the site, currently wrong on nearly every model fact.
4. **Apply the Windsurf→Devin Desktop rename** (keep slug, add `aka`/`renamed_from` field); verify ⚡ acquisition claims (Cursor, Manus) against official sources before publishing.

### P1 — Freshness system
5. **Extend refresh migrations to update array fields** (key_features/pros/cons) — fixes chatgpt, gemini, grok, deepseek, midjourney, copilot records.
6. **Add freshness metadata:** `pricing_as_of`/`last_verified_at` on tools (displayed on pages), `updated` frontmatter on posts (+ rendered "Last updated" and `dateModified` JSON-LD). Quarterly refresh of top ~50 traffic tools and all "best X"/"vs" posts.
7. **Archive hygiene:** archive `dall-e-3` and `arc-max`; add `successor_slug` so archived pages route users onward.
8. **Refresh P1 articles:** best-ai-writing-tools, best-ai-video-tools-2026, run-ai-locally, best-free-ai-tools-2026 (details in 2B/2C).

### P2 — Quality & coverage
9. **FAQPage JSON-LD** from existing `## FAQ` sections; "How we rate" methodology page.
10. **Fix cannibalization:** differentiate the two free-tools listicles (enforce the no-signup promise); consolidate the 3 framework posts.
11. **Catalog gaps to evaluate:** Qwen, Kimi, ByteDance Seedream/Seedance, Google AI Studio/Nano Banana, Grok Imagine, GPT Image API, Suno Studio, Devin Desktop, Lovable Cloud; fix miscategorized live tools (tavily, mubert, aiva); decide the fate of 4 crypto-infra entries.
12. **Resolve the Jasper price contradiction** and batch-verify the writing-tools price table.

### P3 — Polish
13. Expand `top-ai-tools-for-building-websites` to ~1,200w with per-tool links + table + FAQ.
14. Retitle `elevenlabs-vs-higgsfield` ("Voice vs Video").
15. Recalibrate editor_rating rubric (3.5–4.9 range conveys little signal).

---

*Method note: tool audit parsed seed.sql + migrations in timestamp order with upsert semantics and compared against `scripts/catalog-slugs.json`; ~25 tool records and ~13 article claims were web-verified, the rest pattern-flagged. Sources for individual claims are available in the detailed agent transcripts on request.*
