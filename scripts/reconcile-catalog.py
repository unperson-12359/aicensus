#!/usr/bin/env python3
"""Replay repo SQL (seed + migrations, timestamp order) and reconcile vs live export.

Parses:
- supabase/seed.sql                          -> INSERT INTO tools ... VALUES tuples
- supabase/migrations/*.sql                  -> $tools$[...]$tools$ JSON blocks
    - "ON CONFLICT (slug) DO UPDATE" files   -> upsert (insert-or-update) semantics
    - files ending in UPDATE ... WHERE slug  -> update-only (no-op if slug absent)
- supabase/batch2_tools.sql / batch3_tools.sql -> ad-hoc INSERT scripts (analyzed, not replayed)
- supabase/batch4_cleanup.sql                -> ad-hoc DELETE script (analyzed, not replayed)
Compares final replay state vs scripts/catalog-slugs.json (live export).
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SQL_TUPLE = re.compile(r"\(\s*'((?:[^']|'')+)',\s*'([a-z0-9][a-z0-9-]*)',", re.S)
TOOLS_JSON = re.compile(r"\$(?:tools|updates)\$\s*(\[.*?\])\s*\$(?:tools|updates)\$", re.S)

def slugs_from_values_sql(text):
    """Return [(name, slug)] from INSERT INTO tools ... VALUES tuples."""
    out = []
    for m in re.finditer(r"INSERT INTO tools\s*\(([^)]*)\)\s*VALUES(.*?);", text, re.S | re.I):
        body = m.group(2)
        for t in SQL_TUPLE.finditer(body):
            name = t.group(1).replace("''", "'")
            out.append((name, t.group(2)))
    return out

def json_tools(text):
    blocks = TOOLS_JSON.findall(text)
    recs = []
    for b in blocks:
        recs.extend(json.loads(b))
    return recs

def main():
    # ---- 1. Replay: seed then migrations in timestamp order ----
    state = {}  # slug -> {name, status}
    report = []

    seed = (ROOT / "supabase/seed.sql").read_text(encoding="utf-8")
    seed_tools = slugs_from_values_sql(seed)
    for name, slug in seed_tools:
        state[slug] = {"name": name, "status": "published", "origin": "seed.sql"}
    report.append(("seed.sql", len(seed_tools), 0, 0))

    mig_dir = ROOT / "supabase/migrations"
    for f in sorted(mig_dir.glob("*.sql")):
        text = f.read_text(encoding="utf-8")
        recs = json_tools(text)
        if not recs:
            report.append((f.name, 0, 0, 0))
            continue
        is_upsert = "ON CONFLICT (slug) DO UPDATE" in text or "ON CONFLICT (slug) DO NOTHING" in text
        new, updated, noop = 0, 0, 0
        for r in recs:
            slug = r.get("slug")
            if not slug:
                continue
            status = r.get("status", "published")
            if slug in state:
                state[slug].update({"name": r.get("name", state[slug]["name"]), "status": status})
                updated += 1
            elif is_upsert:
                state[slug] = {"name": r.get("name", slug), "status": status, "origin": f.name}
                new += 1
            else:
                noop += 1  # update-only migration, slug missing -> no-op
        report.append((f.name, new, updated, noop))

    print("=== Replay report (migration, +new, updated, noop-updates) ===")
    for name, new, upd, noop in report:
        print(f"  {name}: +{new} new, {upd} updated, {noop} noop")

    published = {s for s, v in state.items() if v["status"] == "published"}
    archived = {s for s, v in state.items() if v["status"] != "published"}
    print(f"\nRepo replay total: {len(state)} ({len(published)} published, {len(archived)} archived: {sorted(archived)})")

    # ---- 2. Live export ----
    live = json.loads((ROOT / "scripts/catalog-slugs.json").read_text(encoding="utf-8"))
    live_slugs = {t["slug"] for t in live["published"]}
    live_archived = set(live.get("archived", []))
    print(f"\nLive export ({live['exportedAt']}): {live['publishedCount']} published, {len(live_archived)} archived")

    live_only = sorted(live_slugs - published)
    repo_only = sorted(published - live_slugs)
    print(f"\nLive-only (no repo lineage via seed+migrations): {len(live_only)}")
    print(f"Repo-published but NOT in live export: {len(repo_only)}")
    for s in repo_only:
        print(f"    - {s} (origin: {state[s].get('origin')})")

    # ---- 3. Batch files ----
    print("\n=== Ad-hoc batch scripts (not in migrations/) ===")
    batch_slugs = {}
    for bf in ["batch2_tools.sql", "batch3_tools.sql"]:
        text = (ROOT / f"supabase/{bf}").read_text(encoding="utf-8")
        pairs = slugs_from_values_sql(text)
        has_conflict = "ON CONFLICT" in text
        slugs = [s for _, s in pairs]
        batch_slugs[bf] = set(slugs)
        in_mig = [s for s in slugs if s in state and state[s].get("origin") != "seed.sql"]
        in_seed = [s for s in slugs if s in state and state[s].get("origin") == "seed.sql"]
        nowhere = [s for s in slugs if s not in state]
        live_hits = len([s for s in slugs if s in live_slugs])
        print(f"  {bf}: {len(slugs)} inserts (ON CONFLICT: {has_conflict})")
        print(f"      overlap seed: {len(in_seed)}, overlap migrations: {len(in_mig)}, nowhere-in-replay: {len(nowhere)} {nowhere[:8]}")
        print(f"      of which live today: {live_hits}")

    b4 = (ROOT / "supabase/batch4_cleanup.sql").read_text(encoding="utf-8")
    m = re.search(r"DELETE FROM tools WHERE slug IN\s*\((.*?)\)", b4, re.S)
    if m:
        dels = re.findall(r"'([a-z0-9-]+)'", m.group(1))
        print(f"  batch4_cleanup.sql: DELETE {len(dels)} slugs: {dels}")
        print(f"      of which still in repo-replay published: {[s for s in dels if s in published]}")
        print(f"      of which in live export: {[s for s in dels if s in live_slugs]}")

    # ---- 4. Expansion-30 check ----
    exp30 = [r["slug"] for r in json_tools((mig_dir / "20260527001000_add_catalog_expansion_30.sql").read_text(encoding="utf-8"))]
    missing30 = [s for s in exp30 if s not in live_slugs]
    print(f"\n=== Expansion-30 live check: {len(exp30) - len(missing30)}/{len(exp30)} now live ===")
    if missing30:
        print(f"  still missing: {missing30}")

    # ---- 5. Live-only coverage by batch files ----
    covered_by_batches = set()
    for s in live_only:
        for bs in batch_slugs.values():
            if s in bs:
                covered_by_batches.add(s)
    print(f"\nLive-only slugs covered by batch2/3 scripts: {len(covered_by_batches)} of {len(live_only)}")
    uncovered = [s for s in live_only if s not in covered_by_batches]
    print(f"Live-only with NO repo file at all: {len(uncovered)}")
    print(f"  {uncovered[:60]}")

    # machine-readable output for follow-up
    out = {
        "replay_published": sorted(published),
        "replay_archived": sorted(archived),
        "live_exported_at": live["exportedAt"],
        "live_count": live["publishedCount"],
        "live_only": live_only,
        "repo_only": repo_only,
        "live_only_uncovered_by_batch_scripts": uncovered,
        "expansion30_missing_live": missing30,
        "noop_report": [{"migration": n, "new": nw, "updated": u, "noop": no} for n, nw, u, no in report],
    }
    (ROOT / "scripts/reconcile-report.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("\nWrote scripts/reconcile-report.json")

if __name__ == "__main__":
    main()
