# Content Consolidation Review — 2026-07-20

End-to-end review of all content surfaces for same-type pages competing with each other:
27 blog posts, 19 best-of pages (`src/lib/best-for.ts`), 19 categories, comparisons, stacks.

## Method

Mapped every page's search intent (what query it should win) and flagged clusters where two or
more URLs target the same intent. For each cluster: **merge**, **differentiate**, or **keep**
(already complementary). Policy: no URL deletions — GSC already shows indexing fragility
(95 discovered-not-indexed, 2 hard 404s = the archived dall-e-3/arc-max tool pages, expected).
Differentiate + cross-link beats redirect churn at this stage.

## Findings by cluster

### 1. Image generation — DIFFERENTIATE (mild overlap)
- `/blog/ai-image-generators-guide` ("how to choose") vs `/best/ai-image-generators` ("the list")
- Same head intent, different depth. Fix: mutual cross-links; blog stays methodology,
  best-of stays ranked picks. No merge.

### 2. Video generation — DIFFERENTIATE (real overlap)
- `/blog/best-ai-video-tools-2026` covers generators + editors + avatars;
  `/best/ai-video-generators` covers generators only.
- Fix: state scope explicitly in both; cross-link. Blog = landscape/buyer's guide,
  best-of = generators-only ranking.

### 3. Research tools — DIFFERENTIATE (strongest overlap)
- `/blog/best-ai-research-tools` ("how to choose the right one") vs `/best/ai-tools-for-research`
- Near-identical intent. Fix: blog leans methodology + workflows, best-of leans ranked picks;
  cross-link prominently. Revisit in 60 days with GSC query data; if one clearly loses,
  merge loser into winner with a next.config redirect.

### 4. Writing tools — KEEP (already split)
- `/blog/best-ai-writing-tools` (all budgets) vs `/best/free-ai-writing-tools` (free only)
- Fix: one cross-link each way to make the paid/free split explicit. No other change.

### 5. Coding — DIFFERENTIATE (boundary fuzzy)
- Blog: `cursor-vs-github-copilot`, `claude-code-vs-gemini-cli` (head-to-heads, fine)
- Best-of: `/best/ai-tools-for-developers` (assistants) vs `/best/best-ai-coding-agents` (agents)
- The two best-of pages blur into each other as assistants gain agent features.
  Fix: sharpen each intro to define the boundary (autocomplete/chat-in-editor vs
  autonomous multi-step agents); cross-link both ways.

### 6. Local/open-source — DIFFERENTIATE (three-way)
- `/blog/run-ai-locally-open-source-models` (which MODELS to run)
- `/blog/best-llama-cpp-alternatives` (which TOOLS/runtimes to use)
- `/best/open-source-ai-tools` (the ranked list)
- Complementary but unlinked. Fix: three-way cross-links with explicit scope notes
  (models vs runtimes vs ranked list).

### 7. Meeting notes — KEEP (the model to copy)
- `ai-meeting-notes-tools-guide` + `best-ai-meeting-notes-tools-compared` already
  cross-link properly (per the original audit). No action.

### 8. Free cluster — KEEP (fixed in Loop 5)
- `best-free-ai-tools-2026` (free tiers) / `free-ai-tools-no-signup` (no account) /
  `free-vs-paid-ai-tools` (when to upgrade) — now cleanly differentiated.

## Actions implemented (Loop 8)

- Cross-links + scope notes added across clusters 1–6 (blog .mdx edits + best-for.ts intros).
- No merges executed; cluster 3 flagged for a 60-day GSC recheck.

## GSC notes (from .gsc-export, informational)

- 2 hard 404s: consistent with archived dall-e-3/arc-max tool pages (expected; archived
  records intentionally 404 until archived-page rendering exists — candidate future task:
  render archived tool pages with a banner + successor link instead of 404).
- 44 alternate-canonical pages: worth a spot check that www/non-www and http/https
  canonicals are intentional.
