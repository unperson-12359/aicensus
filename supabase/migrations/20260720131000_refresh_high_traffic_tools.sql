-- High-traffic record refresh (P1-6), facts web-verified 2026-07-20.
-- Updates key_features/pros/cons arrays too (scalar-only refreshes caused the
-- GPT-4o/V6/Grok 3 staleness found in the audit). Also sets freshness columns
-- when present (added by 20260720130000_add_tool_freshness_columns.sql).

BEGIN;

WITH updates AS (
  SELECT *
  FROM jsonb_to_recordset($updates$
[
  {
    "slug": "chatgpt",
    "tagline": "OpenAI's AI assistant powered by GPT-5.6 — chat, agents, image generation, coding, and deep research.",
    "description": "ChatGPT is OpenAI's AI assistant, running the GPT-5.6 model family (Sol, Terra, and Luna tiers, generally available July 2026) with GPT-5.5 still serving many accounts. It combines conversational AI with web browsing, native image generation, advanced voice, memory, file analysis, Deep Research, agent mode, custom GPTs, and the Codex coding agent. Plans range from a free tier and the budget Go plan to Plus, two Pro tiers, and Business workspaces.",
    "pricing_details": "Free tier (limited GPT-5-class access); Go $8/mo; Plus $20/mo; Pro $100/mo (5x limits) and $200/mo (20x, Sora video, Operator); Business from ~$20/seat/mo annual. Verified July 2026.",
    "key_features": [
      "GPT-5.6 model family (Sol, Terra, Luna) with GPT-5.5 fallback",
      "Native image generation (GPT Image)",
      "Web browsing with citations and Deep Research reports",
      "Agent mode and Codex coding agent",
      "Memory, custom GPTs, canvas, and advanced voice mode",
      "API access with per-token pricing"
    ],
    "pros": [
      "Most versatile all-rounder with the largest ecosystem",
      "Strong free tier and a budget Go plan",
      "Best-in-class image generation built in",
      "Deep integrations via custom GPTs and apps"
    ],
    "cons": [
      "Free and Go tiers hit usage caps quickly",
      "Can present uncertain information confidently",
      "Top Pro tier ($200/mo) is expensive for individuals",
      "Model lineup and rollout vary by account and region"
    ]
  },
  {
    "slug": "gemini",
    "tagline": "Google's AI assistant with Gemini 3.1 Pro, 1M-token context, Deep Research, and Workspace integration.",
    "description": "Gemini is Google's AI assistant, powered by the Gemini 3 generation — flagship Gemini 3.1 Pro with a 1M-token context window and the faster 3.5 Flash as the default. It is grounded in Google Search, generates images (Nano Banana) and video (Veo) on paid plans, produces Deep Research reports, and integrates deeply with Gmail, Docs, Drive, and the rest of Google Workspace. Consumer plans are sold as Google AI tiers with bundled Google One storage.",
    "pricing_details": "Free (3.5 Flash + limited 3.1 Pro); Google AI Plus $4.99/mo; AI Pro $19.99/mo (full 3.1 Pro, 1M context, 5 TB storage, YouTube Premium Lite); AI Ultra $99.99 or $199.99/mo (Deep Think, highest limits). Verified July 2026.",
    "key_features": [
      "Gemini 3.1 Pro flagship with 1M-token context window",
      "Web grounding via Google Search plus Deep Research",
      "Nano Banana image generation and Veo video on paid tiers",
      "Deep Google Workspace integration (Gmail, Docs, Drive)",
      "Gemini CLI, Jules, and Antigravity developer tools on AI Pro",
      "Bundled Google One storage and YouTube perks"
    ],
    "pros": [
      "Strongest free tier of the major assistants",
      "Best web-grounded research experience",
      "1M-token context handles huge documents",
      "Unbeatable bundle value (storage + YouTube)"
    ],
    "cons": [
      "Usage limits are compute-based and opaque",
      "Plan names and tiers reshuffled repeatedly",
      "Writing style less refined than Claude for prose",
      "Best features locked behind AI Pro or Ultra"
    ]
  },
  {
    "slug": "grok",
    "tagline": "xAI's assistant with Grok 4.5, real-time X data, and Imagine media generation.",
    "description": "Grok is xAI's AI assistant, available on X, grok.com, and mobile apps. The current flagship is Grok 4.5 (July 2026), tuned for coding and agentic work, with Grok 4.3 offering a 1M-token context window and Grok 4.1 Fast as the high-volume tier. Grok differentiates with real-time X data, DeepSearch, a popular voice mode, and Imagine — its image and video generator. Access ranges from a free tier to SuperGrok and SuperGrok Heavy subscriptions, plus X Premium bundles and a per-token API.",
    "pricing_details": "Free tier on X/grok.com; SuperGrok ~$30/mo; SuperGrok Heavy ~$300/mo (Grok 4 Heavy); X Premium bundles available; API $2/$6 per 1M tokens for Grok 4.5. Verified July 2026.",
    "key_features": [
      "Grok 4.5 flagship for coding and agentic work",
      "Real-time X (Twitter) data and trends",
      "Imagine image and video generation with synced audio",
      "DeepSearch research mode",
      "Grok 4.3 with 1M-token context window",
      "Open API with aggressive output pricing"
    ],
    "pros": [
      "Live X firehose data no rival can match",
      "Strong, fast-improving media generation",
      "Competitive API pricing (3x output ratio)",
      "Monthly model release cadence"
    ],
    "cons": [
      "Best features require X or SuperGrok subscriptions",
      "Fewer third-party integrations than OpenAI/Google",
      "Enterprise and compliance story still maturing",
      "Plan and tier naming changes frequently"
    ]
  },
  {
    "slug": "deepseek",
    "tagline": "Free AI chat and ultra-low-cost API with DeepSeek V4 models and 1M-token context.",
    "description": "DeepSeek offers a completely free consumer chat (web and mobile) running its V4 Flash model with an optional DeepThink reasoning mode, plus a developer API that undercuts every major rival on price. The current V4 generation — V4 Flash for general work and V4 Pro for frontier reasoning — ships with a native 1M-token context window at no extra charge. DeepSeek built its reputation on open-weight models (V3, R1), which remain available through third-party hosts.",
    "pricing_details": "Web/app chat free for individuals (no paid plan). API: V4 Flash $0.14/$0.28 per 1M tokens; V4 Pro $0.435/$0.87; 5M free tokens for new accounts; steep cache and off-peak discounts. Verified July 2026.",
    "key_features": [
      "Free consumer chat with DeepThink reasoning toggle",
      "V4 Flash and V4 Pro API models with 1M-token context",
      "Cheapest frontier-class API on the market",
      "Open-weight V3 and R1 models for self-hosting",
      "Prompt caching with ~98% cache-hit discount",
      "Available via OpenRouter, AWS Bedrock, and Azure"
    ],
    "pros": [
      "Genuinely free chat with no message paywall",
      "API costs 35-100x less than GPT-5-class rivals",
      "1M context included at no extra charge",
      "Strong reasoning per dollar"
    ],
    "cons": [
      "Fair-use throttling on free chat during peak hours",
      "No image generation or voice in the consumer app",
      "Data-residency concerns for some organizations",
      "Fewer consumer features than ChatGPT or Gemini"
    ]
  },
  {
    "slug": "midjourney",
    "tagline": "Premium AI image generation with V8.1 — 2K output, fast rendering, and image-to-video.",
    "description": "Midjourney is the benchmark for artistic AI image quality. V8.1 (April 2026) renders standard jobs 4-5x faster than earlier versions with HD 2K output, improved prompt adherence, and Raw mode options, while V7 remains the default for many users during the V8 transition. The platform also animates stills into short videos (5 seconds, extendable to 21), offers Draft Mode for cheap exploration, personalization profiles, and a Niji model for anime styles. It is a paid-only product via web and Discord.",
    "pricing_details": "Basic $10/mo (3.3 fast GPU hr); Standard $30/mo (15 hr + unlimited Relax); Pro $60/mo (30 hr, Stealth Mode); Mega $120/mo (60 hr). Annual billing saves 20%. No free tier. Verified July 2026.",
    "key_features": [
      "V8.1 model with 2K HD output and 4-5x faster rendering",
      "Image-to-video animation up to 21 seconds",
      "Draft Mode for low-cost rapid exploration",
      "Personalization profiles and moodboards",
      "Niji 7 model for anime and illustration",
      "Relax Mode unlimited generation on Standard+"
    ],
    "pros": [
      "Consistently the best artistic image quality",
      "Predictable subscription pricing",
      "Relax Mode makes Standard+ plans stretch far",
      "Strong community and style ecosystem"
    ],
    "cons": [
      "No free tier — $10/mo minimum to try",
      "No public API",
      "Discord-centric workflow feels dated",
      "Video features lag dedicated video tools"
    ]
  },
  {
    "slug": "github-copilot",
    "tagline": "GitHub's AI pair programmer — unlimited completions, cloud agents, and multi-model coding in your IDE.",
    "description": "GitHub Copilot is the most widely deployed AI coding assistant, embedded in VS Code, JetBrains, Neovim, Visual Studio, Xcode, and github.com. It offers unlimited inline completions on paid plans, chat, agent mode with a cloud coding agent that opens pull requests, code review, and Copilot CLI, with model choice across OpenAI, Anthropic, and Google models. Since June 2026, advanced features draw from monthly GitHub AI Credits (token-based billing) instead of premium request counts, while code completions remain unlimited and unmetered on every paid plan.",
    "pricing_details": "Free (2,000 completions/mo, limited chat); Pro $10/mo ($15 AI credits); Pro+ $39/mo ($70 credits, premium models); Max $100/mo ($200 credits); Business $19/seat; Enterprise $39/seat. AI Credits billing since June 1, 2026; completions unmetered on paid plans. Verified July 2026.",
    "key_features": [
      "Unlimited inline code completions on paid plans",
      "Cloud coding agent that opens pull requests",
      "Agent mode, chat, and code review",
      "Multi-model selection (OpenAI, Anthropic, Google)",
      "Copilot CLI for terminal workflows",
      "Third-party agent integrations (Claude Code, Codex)"
    ],
    "pros": [
      "Best editor coverage of any AI coding tool",
      "Pro at $10/mo is the value leader",
      "Generous free tier for evaluation",
      "Native GitHub integration (PRs, code review, Issues)"
    ],
    "cons": [
      "Agent and chat usage now metered via AI Credits",
      "Credits do not roll over month to month",
      "Less agentic depth than dedicated AI IDEs",
      "Credit burn varies widely by model choice"
    ]
  }
]
$updates$::jsonb) AS u(
    slug text,
    tagline text,
    description text,
    pricing_details text,
    key_features text[],
    pros text[],
    cons text[]
  )
)
UPDATE public.tools AS t
SET
  tagline = COALESCE(u.tagline, t.tagline),
  description = COALESCE(u.description, t.description),
  pricing_details = COALESCE(u.pricing_details, t.pricing_details),
  key_features = COALESCE(u.key_features, t.key_features),
  pros = COALESCE(u.pros, t.pros),
  cons = COALESCE(u.cons, t.cons),
  meta_description = CASE
    WHEN u.description IS NOT NULL THEN left(u.description, 155)
    ELSE t.meta_description
  END,
  updated_at = now()
FROM updates AS u
WHERE t.slug = u.slug;

-- Freshness columns (only runs after 20260720130000_add_tool_freshness_columns.sql)
UPDATE public.tools
SET pricing_as_of = '2026-07-20', last_verified_at = now()
WHERE slug IN ('chatgpt','gemini','grok','deepseek','midjourney','github-copilot');

COMMIT;
