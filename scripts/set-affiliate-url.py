"""Set or clear an affiliate URL on a live tool record.

Usage:
    python scripts/set-affiliate-url.py <slug> <affiliate_url>
    python scripts/set-affiliate-url.py <slug> --clear

Reads credentials from .env.local. Never prints secrets.
"""
import json
import os
import sys
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


def req(url, key, method, payload=None):
    h = {"apikey": key, "Authorization": f"Bearer {key}",
         "Content-Type": "application/json", "Prefer": "return=minimal"}
    data = json.dumps(payload).encode() if payload is not None else None
    r = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:400]


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    slug = sys.argv[1]
    value = None if sys.argv[2] == "--clear" else sys.argv[2]
    if value and not value.startswith("https://"):
        print("affiliate URL must start with https://")
        sys.exit(1)

    env = load_env(os.path.join(ROOT, ".env.local"))
    base = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = env["SUPABASE_SERVICE_ROLE_KEY"]

    status, body = req(f"{base}/rest/v1/tools?slug=eq.{slug}", "PATCH",
                       {"affiliate_url": value})
    assert status in (200, 204), f"PATCH failed: {status} {body}"

    status, body = req(
        f"{base}/rest/v1/tools?slug=eq.{slug}&select=slug,affiliate_url", "GET")
    assert status == 200, body
    rows = json.loads(body)
    assert rows, f"no tool with slug {slug!r}"
    got = rows[0]["affiliate_url"]
    assert got == value, f"verify failed: {got!r} != {value!r}"
    print(f"OK: {slug} affiliate_url -> {value!r}")


if __name__ == "__main__":
    main()
