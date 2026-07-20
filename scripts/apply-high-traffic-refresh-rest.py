"""Apply 20260720131000_refresh_high_traffic_tools.sql to live via PostgREST.

Detects whether the freshness columns (pricing_as_of, last_verified_at) exist;
sets them when available. Never prints secrets.
"""
import json
import os
import urllib.request
import urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


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
        return e.code, e.read().decode()[:400]


def main():
    env = load_env(os.path.join(ROOT, ".env.local"))
    base = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = env["SUPABASE_SERVICE_ROLE_KEY"]

    sql = open(os.path.join(ROOT, "supabase/migrations/20260720131000_refresh_high_traffic_tools.sql"), encoding="utf-8").read()
    payload = sql.split("$updates$")[1].split("::jsonb")[0]
    updates = json.loads(payload)

    # freshness columns present?
    status, _ = req(f"{base}/rest/v1/tools?select=pricing_as_of&limit=1", key, "GET")
    has_freshness = status == 200
    print(f"freshness columns present: {has_freshness}")

    for u in updates:
        u = dict(u)
        slug = u.pop("slug")
        u["meta_description"] = u["description"][:155]
        if has_freshness:
            u["pricing_as_of"] = "2026-07-20"
            u["last_verified_at"] = "2026-07-20T00:00:00+00:00"
        status, body = req(
            f"{base}/rest/v1/tools?slug=eq.{slug}", key, "PATCH", u,
            {"Prefer": "return=minimal"},
        )
        assert status in (200, 204), f"{slug} failed: {status} {body}"
        print(f"updated {slug} -> HTTP {status}")

    # verify a sample field from each
    slugs = [u["slug"] for u in updates]
    status, body = req(
        f"{base}/rest/v1/tools?slug=in.({','.join(slugs)})&select=slug,pricing_details", key, "GET",
    )
    assert status == 200, body
    for t in json.loads(body):
        assert "Verified July 2026" in (t["pricing_details"] or ""), f"{t['slug']} not updated!"
        print(f"verified {t['slug']}: pricing_details ends with ...{t['pricing_details'][-25:]}")
    print("ALL 6 RECORD UPDATES APPLIED + VERIFIED")


if __name__ == "__main__":
    main()
