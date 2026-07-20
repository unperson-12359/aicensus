#!/usr/bin/env python3
"""Validate the generated lineage-backfill migration (JSON + NOT NULL fields)."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
text = (ROOT / "supabase/migrations/20260720120000_backfill_live_catalog_lineage.sql").read_text(encoding="utf-8")
m = re.search(r"\$tools\$\s*(\[.*?\])\s*\$tools\$", text, re.S)
assert m, "no $tools$ block found"
recs = json.loads(m.group(1))
print(f"JSON valid, records: {len(recs)}")

no_cat = [r["slug"] for r in recs if not r["category_slug"]]
print(f"records w/o category (category_id nullable, ok): {no_cat}")

missing_req = [r["slug"] for r in recs if not r["name"] or not r["tagline"] or not r["description"] or not r["website_url"]]
print(f"records missing NOT NULL fields: {missing_req}")

statuses = sorted({r["status"] for r in recs})
print(f"status values: {statuses}")

pricing_models = sorted({r["pricing_model"] for r in recs})
print(f"pricing_model values: {pricing_models}")

dupes = len(recs) - len({r["slug"] for r in recs})
print(f"duplicate slugs: {dupes}")

arrays_ok = all(isinstance(r[k], list) for r in recs for k in ("key_features", "pros", "cons", "use_cases", "who_its_for"))
print(f"array fields all lists: {arrays_ok}")
