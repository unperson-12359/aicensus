# Editor Rating Recalibration — Proposal

**Date:** 2026-07-20
**Status:** DRAFT — analysis and proposal only. No database changes have been made. The SQL below is illustrative and must be reviewed and applied through the normal migration process before any execution.
**Author:** AiCensus audit working group

---

## 1. Current-state findings

Source: live PostgREST query against `tools` (`status = 'published'`), 2026-07-20. Column: `editor_rating DECIMAL(2,1) CHECK (0–5)`.

- **242 published tools**, of which **241 have a rating** and 1 is NULL (`fonfik` — also needs an editorial pass).
- **Mean 4.29 · Median 4.30 · Std dev 0.22** — the entire catalog fits in a band barely wider than 2 standard deviations.
- **Effective range: 3.5 – 4.9** (only 15 distinct values on a nominal 1–5 scale).
- **Mode: 4.3, shared by 49 tools (20.3%)** — one in five tools has the exact same score.
- **93.8% of all rated tools sit between 4.0 and 4.8**; 86.3% sit between 4.0 and 4.5.
- **95.0% of tools share their score with at least 4 other tools** — the decimals convey almost no per-tool signal.

### Distribution (0.1 buckets)

| Rating | Tools | Bar |
|-------:|------:|:----|
| 3.5 | 1 | # |
| 3.6 | 1 | # |
| 3.7 | 1 | # |
| 3.8 | 3 | ### |
| 3.9 | 7 | ####### |
| 4.0 | 18 | ################## |
| 4.1 | 26 | ########################## |
| 4.2 | 40 | ######################################## |
| 4.3 | 49 | ################################################# |
| 4.4 | 41 | ######################################### |
| 4.5 | 34 | ################################## |
| 4.6 | 9 | ######### |
| 4.7 | 5 | ##### |
| 4.8 | 4 | #### |
| 4.9 | 2 | ## |

A textbook single-hump compression: the scale below 3.5 is entirely unused and 4.0–4.5 absorbs 208 of 241 tools.

### Top 10

| Rating | Tool |
|-------:|------|
| 4.9 | AlphaFold, Cursor |
| 4.8 | Claude, Anthropic API, Hugging Face, Midjourney |
| 4.7 | ElevenLabs, Ollama, OpenAI API, Claude Code |

### Bottom 10

| Rating | Tool |
|-------:|------|
| 3.5 | Heurist |
| 3.6 | BANKR |
| 3.7 | x402 |
| 3.8 | Sui, Rytr, ClawHub |
| 3.9 | CSM, Mubert, NightCafe, Freepik AI |

### Interpretation

The ratings are not wrong — the rank order is plausible (Cursor/Claude/Hugging Face at the top, thin or stalled tools at the bottom). The problem is **discrimination**: a reader comparing two tools rated 4.3 and 4.4 learns nothing, yet those two values cover 90 tools. The catalog is effectively using a 1.4-point sub-scale (3.5–4.9) of its advertised 1–5 range, and the 0.1-decimal display precision implies a resolution the data does not have.

---

## 2. Options analysis

### Option A — Rank-preserving distribution remap (stretch to the full scale)

Keep every tool's relative position and every tie exactly as-is, and re-map the 15 observed values onto a wider range. Formula (linear stretch, then round to 0.1 to match `DECIMAL(2,1)`):

```
new = round( 2.0 + (old - 3.5) * (5.0 - 2.0) / (4.9 - 3.5),  1 )
```

Mapping table (with current tool counts):

| Old | New | Tools | | Old | New | Tools |
|----:|----:|------:|-|----:|----:|------:|
| 3.5 | 2.0 | 1 | | 4.3 | 3.7 | 49 |
| 3.6 | 2.2 | 1 | | 4.4 | 3.9 | 41 |
| 3.7 | 2.4 | 1 | | 4.5 | 4.1 | 34 |
| 3.8 | 2.6 | 3 | | 4.6 | 4.4 | 9 |
| 3.9 | 2.9 | 7 | | 4.7 | 4.6 | 5 |
| 4.0 | 3.1 | 18 | | 4.8 | 4.8 | 4 |
| 4.1 | 3.3 | 26 | | 4.9 | 5.0 | 2 |
| 4.2 | 3.5 | 40 | | | | |

Resulting distribution: mean 3.69, median 3.70, std dev 0.46; 22.4% of tools at 4.0+, 72.2% in 3.0–3.9, 5.4% in 2.0–2.9. Ties are preserved (all 49 tools at 4.3 become 3.7 together). **237 of 241 records change value; 4 stay identical (the 4.8s).**

- *Pros:* one deterministic UPDATE; zero editorial re-review workload; strictly preserves editorial rank order and ties; immediately restores signal. Lower bound is set at 2.0 (not 1.0) so no tool is branded "terrible" without an individual re-review.
- *Cons:* inherited imprecision — the 90 tools tied at 4.2/4.3/4.4 remain indistinguishable from each other; displayed 0.1 precision still slightly overclaims resolution; the numeric drop (e.g. 4.3 → 3.7) must be communicated so it isn't read as a quality downgrade.

### Option B — Criteria-based re-scoring under the /how-we-rate rubric

Re-score every tool against the six published criteria (Output quality, Pricing fairness, Ease of use, Reliability & track record, Privacy & data practices, Pace of development). Suggested editorial weights, if the team adopts a weighted checklist:

| Criterion | Weight |
|---|---:|
| Output quality | 30% |
| Pricing fairness | 15% |
| Ease of use | 15% |
| Reliability & track record | 15% |
| Privacy & data practices | 10% |
| Pace of development | 15% |

- *Pros:* produces genuinely differentiated scores; breaks the inherited ties; aligns each number with the published methodology.
- *Cons:* 241 tools × 6 criteria is a multi-week editorial project. It also conflicts with the published methodology page, which explicitly states the criteria "aren't plugged into a formula… the final number is a judgment call, not a calculation" — adopting formulaic scoring without rewriting that page would make the site contradict itself. Doing it halfway (re-scoring only some tools) would break rank comparability with unre-scored tools.

### Option C — Tier labels instead of / in addition to decimals

Display a tier derived from the numeric score, e.g. (on the *recalibrated* scale):

| Tier | Range (recalibrated) | Meaning |
|---|---|---|
| Exceptional | 4.6 – 5.0 | category-leading |
| Strong | 3.8 – 4.5 | recommended |
| Solid | 3.0 – 3.7 | good, with caveats |
| Mixed | < 3.0 | significant weaknesses |

- *Pros:* honest about the real resolution of the editorial judgment; far more scannable than decimals; tiers survive minor numeric drift. Cheap to implement (pure display logic).
- *Cons:* on its own it hides differences between tools inside a tier; needs the underlying numbers to be meaningful first, so it complements rather than replaces a remap.

### Recommendation

**Adopt Option A (rank-preserving stretch to 2.0–5.0) now, paired with Option C tier labels in the UI, and use Option B incrementally** — individual tools get a full criteria re-review only when the normal triggers on /how-we-rate fire (major update, pricing change, reliability/privacy incident, landscape shift, user feedback).

Rationale:

- **SEO/trust:** tool pages emit schema.org `Review`/`Rating` JSON-LD with `ratingValue` = `editor_rating` and `bestRating: 5`. A catalog where everything is 4.0–4.9 looks like rating inflation and weakens the credibility of the stars Google may display; a spread that actually uses the scale reads as editorially honest. Tier labels reduce the risk that a recalibrated 3.5 (old 4.2) is misread as "bad".
- **Effort:** Option A is a single deterministic, reversible update covering all records at once; Option B is weeks of editorial labor and contradicts the published "judgment call, not a calculation" language unless the methodology page is also rewritten.
- **Integrity:** rank order and ties are editorial facts; a mechanical remap that preserves them cannot be accused of re-judging any tool.

---

## 3. Execution plan (DRAFT — do not run as-is)

**Records affected:** 237 of 241 rated published tools change value; 4 (the 4.8s) are unchanged; 1 NULL (`fonfik`) is untouched and needs a separate editorial review.

**Step 0 — Snapshot for rollback.** Export the current values before touching anything:

```sql
-- Run in Supabase SQL editor or via pg_dump; store the CSV in the repo or secure storage.
CREATE TABLE IF NOT EXISTS _editor_rating_backup_20260720 AS
SELECT id, slug, editor_rating, status FROM tools;
```

**Step 1 — Preview (read-only).** Verify the mapping changes exactly 237 rows:

```sql
SELECT slug, editor_rating AS old_rating,
       ROUND(2.0 + (editor_rating - 3.5) * 3.0 / 1.4, 1) AS new_rating
FROM tools
WHERE status = 'published' AND editor_rating IS NOT NULL
ORDER BY editor_rating DESC, slug;
```

**Step 2 — Apply inside a transaction** (or via the REST approach below):

```sql
BEGIN;

UPDATE tools
SET editor_rating = ROUND(2.0 + (editor_rating - 3.5) * 3.0 / 1.4, 1)
WHERE status = 'published' AND editor_rating IS NOT NULL;

-- Guard: rank order and ties must be preserved, and no rating may move up
-- relative to a tool that outranked it. Spot-check before COMMIT:
SELECT count(*) AS changed
FROM tools t
JOIN _editor_rating_backup_20260720 b ON b.id = t.id
WHERE t.editor_rating IS DISTINCT FROM b.editor_rating;
-- expected: 237

-- Guard: monotonicity — no pair of tools may swap relative order.
-- (Linear mapping is strictly increasing, so this is a formality, but verify:)
SELECT b1.slug AS a, b2.slug AS b
FROM _editor_rating_backup_20260720 b1
JOIN _editor_rating_backup_20260720 b2
  ON b1.editor_rating > b2.editor_rating
JOIN tools t1 ON t1.id = b1.id
JOIN tools t2 ON t2.id = b2.id
WHERE t1.editor_rating <= t2.editor_rating;
-- expected: 0 rows

COMMIT;   -- or ROLLBACK if any guard fails
```

**Alternative REST approach:** if a SQL migration is not preferred, a one-off script can PATCH `tools?id=eq.<id>` rows in batches with the mapped value, driven by the Step 0 snapshot. SQL in a transaction is safer (atomic, guard-checkable) and is the recommended path.

**Rollback strategy:**

```sql
UPDATE tools t
SET editor_rating = b.editor_rating
FROM _editor_rating_backup_20260720 b
WHERE t.id = b.id;
```

Keep `_editor_rating_backup_20260720` until at least one full editorial review cycle has passed. Additionally, because every change is a pure function of the old value, the mapping is fully invertible from this document even without the backup table — but do not rely on that; take the snapshot.

**Code-level dependencies to handle in the same release (separate PR, not this document's scope):**

- `src/components/stacks/stack-explorer.tsx` hardcodes `highRated = editor_rating >= 4.0` — after the remap that filter would exclude 77.6% of the catalog instead of 6.2%. Recalibrate the threshold (≈ 3.8 on the new scale preserves today's "top ~30%" behavior; ≥ 4.0 on the new scale = top 22.4%).
- Any copy that quotes ratings (comparison and alternatives generators interpolate `editor_rating` into sentences) — verify tone still reads sensibly at lower absolute numbers.

---

## 4. Guardrails

1. **Ratings are editorial.** This recalibration may only re-express existing judgments on a wider scale. It must preserve rank order and ties exactly. Any tool whose *relative* position should change requires an individual editorial re-review with a note in the change record — never a batch edit.
2. **No tool may be pushed below 2.0 by formula.** Scores under 2.0 imply serious deficiencies and must only ever come from a human re-review.
3. **Consistency with the published methodology** (`src/app/(public)/how-we-rate/page.tsx`):
   - The page describes a 1–5 editorial judgment with decimal display ("A 4.7 means…"). The recalibrated scale remains decimal, 1 decimal place, `DECIMAL(2,1)` — displayed precision is unchanged, so no methodology-page edit is strictly required for Option A.
   - The page says the criteria "aren't plugged into a formula… a judgment call, not a calculation." Therefore Option B may not be rolled out as a mechanical weighted formula without first updating that page's "How scores get assigned" section. Weighted criteria may still guide individual re-reviews.
   - After recalibration, the example "A 4.7 means 'one of the strongest options in its category'" remains true — under the new mapping only the current 4.7–4.9 group reaches 4.6+.
4. **Communicate the change.** Because absolute numbers drop (e.g. 4.3 → 3.7) without any tool getting worse, the release should note that scores were recalibrated to use the full 1–5 scale, otherwise returning users will read it as mass downgrades.
5. **Fix the NULL.** `fonfik` (published, `editor_rating IS NULL`) renders without a rating and without JSON-LD review markup; give it an editorial score or unpublish pending review.
6. **Re-verify JSON-LD after release.** `ratingValue` flows directly into schema.org markup with `bestRating: 5`; spot-check a sample of tool pages post-release to confirm the new values render and that no cached page still serves pre-recalibration markup.
