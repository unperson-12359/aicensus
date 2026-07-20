-- Remaining high-traffic record refresh (P1-6) + archives (P1-7), facts web-verified 2026-07-20.
-- Covers cursor, character-ai, elevenlabs, suno, microsoft-copilot, dia; archives
-- dall-e-3 (successor: chatgpt) and arc-max (successor: dia). Arrays refreshed too
-- (scalar-only refreshes caused the staleness found in the audit).

BEGIN;

WITH updates AS (
  SELECT *
  FROM jsonb_to_recordset($updates$
[
  {
    "slug": "cursor",
    "tagline": "AI-native code editor with agents, Composer, codebase context, and multi-model support.",
    "description": "Cursor is an AI-first code editor from Anysphere, built on VS Code, with codebase-aware chat, multi-file Composer edits, autonomous agents, and tab completion across GPT, Claude, Gemini, and Grok models. In June 2026 SpaceX announced an all-stock acquisition of Anysphere valued at roughly $60B, expected to close in Q3 2026; Cursor continues to operate as its own product.",
    "pricing_details": "Hobby free tier; Pro $20/mo; Pro+ $60/mo; Ultra $200/mo; Teams $40/user/mo. Verified July 2026.",
    "key_features": [
      "Composer 2.5 multi-file agent editing",
      "Full codebase indexing and context",
      "Multi-model support (GPT, Claude, Gemini, Grok)",
      "Built on VS Code — familiar interface and extensions",
      "Background agents and code review workflows"
    ],
    "pros": [
      "Best codebase awareness of any AI editor",
      "Familiar VS Code interface and extensions",
      "Multi-file agent editing is incredibly powerful",
      "Choice of frontier models in one tool"
    ],
    "cons": [
      "Pro+ and Ultra tiers get expensive for heavy agent use",
      "High resource usage with large codebases",
      "Ownership transition (SpaceX acquisition) still closing"
    ]
  },
  {
    "slug": "character-ai",
    "tagline": "Chat with AI characters for roleplay, creative writing, and entertainment — adults only for open chat.",
    "description": "Character.AI lets users chat with user-created and preset characters for entertainment, roleplay, and creative writing. Google licensed its models in 2024, but Character.AI continues operating independently. Following safety controversies, open-ended chat was removed for under-18 users effective November 25, 2025, and the platform now enforces stricter content filters; periodic safety and DMCA sweeps have removed large numbers of community bots.",
    "pricing_details": "Free unlimited messaging with ads and peak-hour waiting rooms; c.ai+ $9.99/mo or $94.99/yr for priority access and faster responses. Verified July 2026.",
    "key_features": [
      "Millions of user-created characters",
      "Group chats and persona customization",
      "Voice calls with characters",
      "Strict safety filters; 18+ only for open chat",
      "Mobile apps with high engagement"
    ],
    "pros": [
      "Unmatched variety of characters and fandoms",
      "Genuinely free unlimited messaging",
      "Engaging, personality-rich conversations"
    ],
    "cons": [
      "Under-18 open chat banned since November 2025",
      "Aggressive filters frustrate adult roleplay users",
      "Mass bot removals from safety and DMCA sweeps",
      "Peak-hour waiting rooms on the free tier"
    ]
  },
  {
    "slug": "elevenlabs",
    "tagline": "AI voice platform for text-to-speech, voice cloning, dubbing, and conversational audio.",
    "description": "ElevenLabs provides AI voice generation, instant and professional voice cloning, dubbing, speech-to-text, sound effects, and conversational audio agents. Its v3 model supports 70+ languages with audio tags for emotion and delivery control. It is widely used by creators, media teams, developers, and businesses producing natural-sounding voice content.",
    "pricing_details": "Free 10k credits/mo (non-commercial); Starter $6/mo; Creator $22/mo ($11 first month, 121k credits, Professional Voice Cloning); Pro $99/mo; Scale $299/mo; Business $990/mo; Enterprise custom. Annual billing ~2 months free. Verified July 2026.",
    "key_features": [
      "ElevenLabs v3 model with audio tags and 70+ languages",
      "Instant and Professional Voice Cloning (IVC/PVC)",
      "AI dubbing and multilingual voiceovers",
      "Projects for long-form audio (audiobooks)",
      "Conversational AI agents and developer API"
    ],
    "pros": [
      "Industry-best voice quality and realism",
      "Excellent multilingual support (70+ languages)",
      "Easy voice cloning setup",
      "Generous Creator plan with first-month discount"
    ],
    "cons": [
      "Free tier is non-commercial and very limited",
      "Higher tiers get expensive for heavy usage",
      "Voice cloning raises ethical and consent concerns"
    ]
  },
  {
    "slug": "suno",
    "tagline": "AI music generation platform for full songs, vocals, stems, and voice cloning.",
    "description": "Suno generates complete songs with vocals, instruments, and lyrics from text prompts. Version 5.5 (March 2026) added Voices voice cloning, Custom Models, and My Taste personalization. Suno signed a licensing deal with Warner Music in November 2025, while litigation with Sony and UMG remains open. It is used by musicians, creators, marketers, and hobbyists making original tracks quickly.",
    "pricing_details": "Free 50 credits/day (v4.5-all model only, non-commercial); Pro $10/mo ($8/mo annual, 2,500 credits/mo, commercial rights, 12 stems); Premier $30/mo ($24/mo annual, 10,000 credits/mo, Suno Studio DAW, MIDI export). Verified July 2026.",
    "key_features": [
      "Full song generation with vocals and instruments (v5.5)",
      "Voices voice cloning and Custom Models",
      "Suno Studio DAW and MIDI export (Premier)",
      "Custom lyrics or AI-generated lyrics",
      "Extend, remix, and stem separation"
    ],
    "pros": [
      "Surprisingly good audio quality",
      "Incredibly easy to use",
      "Daily free credits let you experiment",
      "Commercial rights included on paid plans"
    ],
    "cons": [
      "Songs can sound formulaic",
      "Limited control over arrangement on lower tiers",
      "Ongoing label litigation (Sony, UMG) creates licensing uncertainty",
      "No official public API"
    ]
  },
  {
    "slug": "microsoft-copilot",
    "tagline": "Microsoft's AI assistant across Windows, Edge, Microsoft 365, and enterprise workflows.",
    "description": "Microsoft Copilot provides AI assistance across web search, Windows, Edge, Word, Excel, PowerPoint, Teams, Outlook, and enterprise Microsoft 365 data, powered by the latest OpenAI models. The consumer Copilot is built into Windows and Edge, while Microsoft 365 Copilot Business (launched December 2025) brings the assistant to small and mid-size organizations. It is most valuable for teams standardized on Microsoft tools.",
    "pricing_details": "Consumer Copilot free across Windows, Edge, and web; Microsoft 365 Copilot Business $21/user/mo standard (requires Microsoft 365 Business Standard or Premium base). Verified July 2026.",
    "key_features": [
      "Deep integration with Word, Excel, PowerPoint",
      "Meeting summaries and recap in Teams",
      "Email drafting and triage in Outlook",
      "Data analysis in Excel with natural language",
      "Built-in image generation",
      "Enterprise data grounding via Microsoft Graph"
    ],
    "pros": [
      "Seamless Microsoft 365 integration",
      "No context switching needed",
      "Enterprise-grade security and compliance",
      "Capable free consumer tier"
    ],
    "cons": [
      "Requires Microsoft 365 subscription for full value",
      "Per-user pricing adds up for larger teams",
      "Can be slow with large documents"
    ]
  },
  {
    "slug": "dia",
    "tagline": "AI-native browser from The Browser Company (now part of Atlassian) — chat with any tab.",
    "description": "Dia is an AI browser from The Browser Company, the team behind Arc, which was acquired by Atlassian for $610M in October 2025. It brings AI chat and contextual assistance directly into browsing — asking questions about open tabs, drafting in the page, and automating everyday web workflows — rather than a separate chatbot tab. Dia is the successor to Arc, which is in maintenance mode.",
    "pricing_details": "Free to download; plan structure under Atlassian ownership still evolving. Verified July 2026.",
    "key_features": [
      "Chat with open tabs and page context",
      "In-page writing and editing assistance",
      "Skills for repeatable browsing workflows",
      "Mac-first design from the Arc team",
      "Backed by Atlassian"
    ],
    "pros": [
      "Thoughtful browser UX heritage from Arc",
      "Genuinely useful tab-aware AI assistance",
      "Free to use during rollout"
    ],
    "cons": [
      "Platform support still limited (Mac-first)",
      "Feature set evolving under new ownership",
      "Extension ecosystem smaller than Chrome's"
    ]
  },
  {
    "slug": "dall-e-3",
    "status": "archived",
    "successor_slug": "chatgpt",
    "tagline": "Legacy OpenAI image model superseded by GPT Image in ChatGPT and API.",
    "description": "DALL-E 3 was OpenAI's prior flagship text-to-image model. OpenAI deprecated the DALL-E 2 and DALL-E 3 API endpoints on May 12, 2026, and ChatGPT now generates images with GPT Image models. This listing is kept for historical context — for current OpenAI image generation, see ChatGPT (GPT Image).",
    "pricing_details": "Archived: OpenAI deprecated DALL-E 2/3 API endpoints May 12, 2026. ChatGPT defaults to GPT Image models; API users should migrate to gpt-image-1 or later. Verified July 2026.",
    "key_features": [
      "Historical: text-to-image generation (retired)",
      "Succeeded by GPT Image in ChatGPT",
      "API migration path: gpt-image-1"
    ],
    "pros": [
      "Historically significant image model",
      "Successor (GPT Image) is better in every way"
    ],
    "cons": [
      "Retired — no longer available via API",
      "Superseded by GPT Image models"
    ]
  },
  {
    "slug": "arc-max",
    "status": "archived",
    "successor_slug": "dia",
    "tagline": "Archived: Arc browser's AI features — Arc is in maintenance mode; see Dia.",
    "description": "Arc Max bundled opt-in AI helpers inside Arc Browser. The Browser Company stopped active Arc development in May 2025 to focus on Dia, and was acquired by Atlassian for $610M in October 2025. Arc still receives Chromium security updates but is in maintenance mode. Its AI vision continues in Dia — see the Dia listing for the current product.",
    "pricing_details": "Archived: Arc is in maintenance mode with security updates only; its AI features live on in Dia (free). Verified July 2026.",
    "key_features": [
      "Historical: opt-in AI helpers in Arc (maintenance mode)",
      "Succeeded by Dia browser",
      "Arc still receives security updates"
    ],
    "pros": [
      "Innovative AI-browser ideas that shaped Dia",
      "Arc remains usable with security updates"
    ],
    "cons": [
      "No active feature development since May 2025",
      "Superseded by Dia under Atlassian"
    ]
  }
]
$updates$::jsonb) AS u(
    slug text,
    status text,
    successor_slug text,
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
  status = COALESCE(u.status, t.status),
  successor_slug = COALESCE(u.successor_slug, t.successor_slug),
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

-- Freshness stamps
UPDATE public.tools
SET pricing_as_of = '2026-07-20', last_verified_at = now()
WHERE slug IN ('cursor','character-ai','elevenlabs','suno','microsoft-copilot','dia','dall-e-3','arc-max');

COMMIT;
