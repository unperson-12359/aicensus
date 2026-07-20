"""Apply 20260720133000_add_catalog_gap_tools.sql to live via PostgREST.

POSTs each new tool with Prefer: resolution=ignore-duplicates, then GET-verifies
every slug returns 200 with expected fields. Never prints secrets.
"""
import json
import os
import urllib.request
import urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIGRATION = "20260720133000_add_catalog_gap_tools.sql"


def load_env(path):
    env = {}
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def req(url, key, method, payload=None, headers=None):
    h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    if headers:
        h.update(headers)
    data = json.dumps(payload).encode() if payload is not None else None
    r = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:600]


def main():
    env = load_env(os.path.join(ROOT, ".env.local"))
    base = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = env["SUPABASE_SERVICE_ROLE_KEY"]

    sql = open(os.path.join(ROOT, "supabase/migrations", MIGRATION), encoding="utf-8").read()
    payload = sql.split("$tools$")[1].split("::jsonb")[0]
    tools = json.loads(payload)

    # resolve category ids
    status, body = req(f"{base}/rest/v1/categories?select=id,slug", key, "GET")
    assert status == 200, body
    cats = {c["slug"]: c["id"] for c in json.loads(body)}

    for t in tools:
        row = {k: v for k, v in t.items() if k != "category_slug"}
        row["category_id"] = cats[t["category_slug"]]
        row["is_verified"] = False
        row["is_featured"] = False
        row["status"] = "published"
        row["published_at"] = "2026-07-20T13:30:00+00:00"
        row["meta_title"] = f"{t['name']} Review, Pricing, Alternatives | AiCensus"
        row["meta_description"] = t["description"][:155]
        row["pricing_as_of"] = "2026-07-20"
        row["last_verified_at"] = "2026-07-20T13:30:00+00:00"
        status, body = req(
            f"{base}/rest/v1/tools", key, "POST", row,
            {"Prefer": "resolution=ignore-duplicates,return=minimal"},
        )
        assert status in (200, 201, 204), f"{t['slug']} failed: {status} {body}"
        print(f"posted {t['slug']} -> HTTP {status}")

    # verify each slug
    slugs = [t["slug"] for t in tools]
    status, body = req(
        f"{base}/rest/v1/tools?slug=in.({','.join(slugs)})"
        "&select=slug,name,status,editor_rating,pricing_as_of,category_id",
        key, "GET",
    )
    assert status == 200, body
    rows = {r["slug"]: r for r in json.loads(body)}
    cat_name = {v: k for k, v in cats.items()}
    ok = True
    for t in tools:
        r = rows.get(t["slug"])
        if not r:
            print(f"MISSING {t['slug']}")
            ok = False
            continue
        checks = (
            r["status"] == "published"
            and float(r["editor_rating"]) == float(t["editor_rating"])
            and str(r["pricing_as_of"]) == "2026-07-20"
            and r["category_id"] == cats[t["category_slug"]]
        )
        print(
            f"verified {r['slug']}: status={r['status']} rating={r['editor_rating']} "
            f"category={cat_name[r['category_id']]} pricing_as_of={r['pricing_as_of']} "
            f"-> {'OK' if checks else 'FIELD MISMATCH'}"
        )
        ok = ok and checks
    assert ok, "verification failed"
    print(f"ALL {len(tools)} NEW TOOLS APPLIED + VERIFIED")


if __name__ == "__main__":
    main()
