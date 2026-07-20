"""Apply the two pending DML migrations to the live Supabase DB via PostgREST.

- 20260720120000_backfill_live_catalog_lineage.sql: 94 rows, INSERT ... ON CONFLICT DO NOTHING
  -> POST /rest/v1/tools with Prefer: resolution=ignore-duplicates
- 20260720000000_windsurf_devin_desktop_rebrand.sql: 2 row updates
  -> PATCH /rest/v1/tools?slug=eq.<slug>

Never prints secrets. Exits non-zero on any failure.
"""
import json
import os
import re
import sys
import urllib.request
import urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env(path):
    env = {}
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, _, v = line.partition("=")
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def extract_payload(sql_path, marker):
    sql = open(sql_path, encoding="utf-8").read()
    parts = sql.split(marker)
    assert len(parts) == 3, f"marker {marker} not found exactly twice in {sql_path}"
    return json.loads(parts[1].split("::jsonb")[0])


def req(url, key, method, payload=None, extra_headers=None):
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if extra_headers:
        headers.update(extra_headers)
    data = json.dumps(payload).encode() if payload is not None else None
    r = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            body = resp.read().decode()
            return resp.status, body
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:500]


def main():
    env = load_env(os.path.join(ROOT, ".env.local"))
    base = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = env["SUPABASE_SERVICE_ROLE_KEY"]

    # 1. category slug -> id map
    status, body = req(f"{base}/rest/v1/categories?select=id,slug", key, "GET")
    assert status == 200, f"categories fetch failed: {status} {body}"
    cat_map = {c["slug"]: c["id"] for c in json.loads(body)}
    print(f"categories loaded: {len(cat_map)}")

    # 2. backfill: 94 rows, ignore duplicates
    rows = extract_payload(
        os.path.join(ROOT, "supabase/migrations/20260720120000_backfill_live_catalog_lineage.sql"),
        "$tools$",
    )
    insert_rows = []
    skipped_cats = set()
    for row in rows:
        row = dict(row)
        slug = row.pop("category_slug")
        cid = cat_map.get(slug)
        if cid is None:
            skipped_cats.add(slug)
            continue
        row["category_id"] = cid
        row.pop("id", None)  # let DB generate; conflicts are on slug
        insert_rows.append(row)
    if skipped_cats:
        print(f"WARNING: skipped unknown categories: {sorted(skipped_cats)}")
    # filter out slugs that already exist (ON CONFLICT DO NOTHING semantics)
    all_slugs = [r["slug"] for r in insert_rows]
    status, body = req(
        f"{base}/rest/v1/tools?slug=in.({','.join(all_slugs)})&select=slug",
        key,
        "GET",
    )
    assert status == 200, f"existing-slug check failed: {status} {body}"
    existing = {t["slug"] for t in json.loads(body)}
    before = len(insert_rows)
    insert_rows = [r for r in insert_rows if r["slug"] not in existing]
    print(f"backfill: {before} rows, {len(existing)} already exist, inserting {len(insert_rows)}")

    status, body = req(
        f"{base}/rest/v1/tools",
        key,
        "POST",
        insert_rows,
        {"Prefer": "return=minimal"},
    )
    assert status in (200, 201), f"backfill insert failed: {status} {body}"
    print(f"backfill: inserted {len(insert_rows)} rows -> HTTP {status}")

    # verify: count how many of the 94 slugs now exist
    slugs = [r["slug"] for r in rows]
    status, body = req(
        f"{base}/rest/v1/tools?slug=in.({','.join(slugs)})&select=slug",
        key,
        "GET",
    )
    assert status == 200, f"verify failed: {status} {body}"
    found = {t["slug"] for t in json.loads(body)}
    missing = [s for s in slugs if s not in found]
    print(f"backfill verify: {len(found)}/{len(slugs)} present; missing: {missing or 'none'}")

    # 3. windsurf/codeium updates
    updates = extract_payload(
        os.path.join(ROOT, "supabase/migrations/20260720000000_windsurf_devin_desktop_rebrand.sql"),
        "$updates$",
    )
    for u in updates:
        u = dict(u)
        slug = u.pop("slug")
        if u.get("name") or u.get("tagline"):
            u["meta_title"] = f"{u.get('name') or ''} Review, Pricing, Alternatives | AiCensus".strip()
        if u.get("description"):
            u["meta_description"] = u["description"][:155]
        status, body = req(
            f"{base}/rest/v1/tools?slug=eq.{slug}",
            key,
            "PATCH",
            u,
            {"Prefer": "return=minimal"},
        )
        assert status in (200, 204), f"update {slug} failed: {status} {body}"
        print(f"updated {slug} -> HTTP {status}")

    # verify rebrand landed
    status, body = req(
        f"{base}/rest/v1/tools?slug=eq.windsurf&select=name,website_url",
        key,
        "GET",
    )
    print(f"windsurf now: {body}")

    print("ALL DB CHANGES APPLIED OK")


if __name__ == "__main__":
    main()
