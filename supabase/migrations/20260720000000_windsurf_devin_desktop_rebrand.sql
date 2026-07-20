-- Windsurf → Devin Desktop rebrand (June 2, 2026) + Cascade EOL (July 1, 2026).
-- Sources verified 2026-07-20: devin.ai/desktop is canonical (windsurf.com redirects);
-- multiple independent reviews dated June 2026 confirm rebrand, plan continuity, and
-- Devin Local replacing Cascade. Slugs intentionally unchanged (link equity).
-- NOTE: unlike earlier refresh migrations, this one also updates array fields
-- (key_features, pros, cons) so feature-level staleness is fixed too.

BEGIN;

WITH updates AS (
  SELECT *
  FROM jsonb_to_recordset($updates$
[
  {
    "slug": "windsurf",
    "name": "Devin Desktop (formerly Windsurf)",
    "tagline": "Cognition's agentic IDE — Windsurf rebranded to Devin Desktop in June 2026, with Devin Local, SWE-1.6, and the Agent Command Center.",
    "description": "Devin Desktop is Cognition's AI-native code editor, formerly known as Windsurf (and originally Codeium). On June 2, 2026, Cognition shipped the rebrand as an over-the-air update: plans, pricing, settings, and extensions carried over unchanged. The original Cascade agent reached end-of-life on July 1, 2026 and was replaced by Devin Local, a Rust-rewritten local agent with subagent support. The editor now centers on the Agent Command Center for running local and Devin Cloud agents in parallel, powered by the SWE-1.6 coding model. The product is still widely searched as 'Windsurf'; windsurf.com redirects to devin.ai/desktop.",
    "website_url": "https://devin.ai/desktop",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with limited quotas; Pro $20/mo; Max $200/mo; Teams $80/mo + $40/seat; Enterprise custom. Plans and pricing carried over unchanged from Windsurf in the June 2026 rebrand. Verified July 2026.",
    "key_features": [
      "Devin Local agent (Rust rewrite, subagent support) replacing Cascade",
      "Agent Command Center for parallel local and cloud agents",
      "SWE-1.6 proprietary coding model",
      "Devin Cloud access from the Pro plan",
      "Codemaps AI-annotated code visualization",
      "Agent Client Protocol (ACP) support across 40+ IDEs"
    ],
    "pros": [
      "Runs and reviews multiple agents in parallel from one IDE",
      "Works across JetBrains, VS Code, Neovim, and more via plugins and ACP",
      "Enterprise compliance certifications carried over from Windsurf",
      "Same pricing as before the rebrand; free tier to evaluate"
    ],
    "cons": [
      "Cascade EOL forces migration to Devin Local workflows",
      "Product direction is shifting from IDE polish to agent-of-record platform",
      "Original Windsurf founding team no longer at Cognition",
      "Pro plan uses daily/weekly quotas rather than a monthly credit pool"
    ]
  },
  {
    "slug": "codeium",
    "tagline": "Free AI completions and chat plugins for 40+ IDEs — the extension layer of Devin Desktop (formerly Windsurf).",
    "description": "Codeium now primarily refers to the plugin ecosystem for developers who stay in JetBrains, VS Code, Vim, or other editors. The company's flagship IDE became Windsurf, was acquired by Cognition in 2025, and rebranded to Devin Desktop in June 2026; the JetBrains plugin continues under the Windsurf name while the main editor moved to devin.ai/desktop.",
    "pricing_details": "Free tier for plugin users across VS Code, JetBrains, Vim, and other editors; paid Pro/Teams tiers align with Cognition's Devin Desktop subscriptions. Verified July 2026.",
    "key_features": [
      "Free autocomplete and chat plugins for 40+ editors",
      "JetBrains plugin continues under the Windsurf brand",
      "Backed by Cognition's SWE coding models",
      "Upgrade path into Devin Desktop and Devin Cloud agents"
    ],
    "pros": [
      "Genuinely useful free tier across many editors",
      "Best option for staying inside JetBrains IDEs",
      "Simple onboarding for developers new to AI coding"
    ],
    "cons": [
      "Branding is confusing post-rebrand (Codeium / Windsurf / Devin Desktop)",
      "Full agent experience requires moving to Devin Desktop",
      "Roadmap follows Cognition's agent-platform strategy, not plugin users"
    ]
  }
]
$updates$::jsonb) AS u(
    slug text,
    name text,
    tagline text,
    description text,
    website_url text,
    pricing_model text,
    pricing_details text,
    key_features text[],
    pros text[],
    cons text[]
  )
)
UPDATE public.tools AS t
SET
  name = COALESCE(u.name, t.name),
  tagline = COALESCE(u.tagline, t.tagline),
  description = COALESCE(u.description, t.description),
  website_url = COALESCE(u.website_url, t.website_url),
  pricing_model = CASE
    WHEN u.pricing_model IS NOT NULL THEN u.pricing_model::pricing_model
    ELSE t.pricing_model
  END,
  pricing_details = COALESCE(u.pricing_details, t.pricing_details),
  key_features = COALESCE(u.key_features, t.key_features),
  pros = COALESCE(u.pros, t.pros),
  cons = COALESCE(u.cons, t.cons),
  meta_title = CASE
    WHEN u.tagline IS NOT NULL OR u.name IS NOT NULL THEN COALESCE(u.name, t.name) || ' Review, Pricing, Alternatives | AiCensus'
    ELSE t.meta_title
  END,
  meta_description = CASE
    WHEN u.description IS NOT NULL THEN left(u.description, 155)
    ELSE t.meta_description
  END,
  updated_at = now()
FROM updates AS u
WHERE t.slug = u.slug;

COMMIT;
