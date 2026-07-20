-- Add 6 catalog gap tools (July 2026 content audit)
-- Qwen, Kimi, Seedream, Seedance, Google AI Studio, GPT Image API
-- Fold decisions (not added as standalone listings):
--   * "Nano Banana"  -> model nickname inside Google AI Studio / Gemini (covered in google-ai-studio listing)
--   * "Grok Imagine" -> feature of existing `grok` listing (already in key_features/pricing)
--   * "Suno Studio"  -> Premier-plan feature of existing `suno` listing (already covered)
--   * "Lovable Cloud"-> backend/hosting feature of existing `lovable` listing (already covered)

BEGIN;

WITH new_tools AS (
  SELECT *
  FROM jsonb_to_recordset($tools$[
  {
    "slug": "qwen",
    "name": "Qwen",
    "tagline": "Alibaba's open-weight LLM family with a free multimodal chat assistant and low-cost API",
    "description": "Qwen is Alibaba's AI model family and assistant. The free Qwen Chat app (chat.qwen.ai) offers multimodal conversation, document analysis, and image understanding powered by the Qwen3.x generation, including Qwen3.5 Plus with a 1M-token context window. Developers can use an OpenAI-compatible API via Alibaba Cloud Model Studio or download open-weight Qwen3 models for self-hosting. Dedicated coding models (Qwen3 Coder) target agentic programming workloads.",
    "website_url": "https://chat.qwen.ai",
    "category_slug": "chatbots-assistants",
    "pricing_model": "freemium",
    "pricing_details": "Qwen Chat free on web and mobile; API pay-as-you-go via Alibaba Cloud Model Studio and OpenRouter (e.g. Qwen3 Coder Flash ~$0.20/M input, ~$0.98/M output tokens); open-weight Qwen3 models free to self-host. Verified July 2026.",
    "editor_rating": 4.4,
    "company_name": "Alibaba Cloud",
    "founded_year": 2023,
    "key_features": [
      "Free Qwen Chat assistant on web and mobile",
      "Qwen3.x flagship models with up to 1M-token context",
      "Open-weight models free for self-hosting",
      "Dedicated agentic coding models (Qwen3 Coder)",
      "OpenAI-compatible API via Alibaba Cloud Model Studio",
      "Multimodal text, image, and video understanding"
    ],
    "pros": [
      "Strong open-weight ecosystem with permissive licensing",
      "Among the cheapest frontier-class API pricing",
      "Rapid release cadence across chat, coding, and multimodal models"
    ],
    "cons": [
      "Consumer brand awareness lower outside Asia",
      "Model lineup and versioning can be confusing",
      "Enterprise compliance posture less documented for Western buyers"
    ],
    "use_cases": [
      "Free general-purpose AI chat and document Q&A",
      "Cost-sensitive API workloads and agent pipelines",
      "Self-hosting open-weight models for data control"
    ],
    "who_its_for": [
      "Developers wanting low-cost OpenAI-compatible APIs",
      "Teams self-hosting open-weight LLMs",
      "Users seeking a free ChatGPT alternative"
    ]
  },
  {
    "slug": "kimi",
    "name": "Kimi",
    "tagline": "Moonshot AI's long-context assistant with open-weight K2 models and agentic tools",
    "description": "Kimi is Moonshot AI's AI assistant built on the open-weight Kimi K2 model family, a trillion-parameter mixture-of-experts architecture. It offers a 256K-token context window, Deep Research for multi-step web synthesis, Kimi Code for agentic software engineering, Agent Swarm for parallel subagents, and productivity agents for slides, sheets, and websites. A token-based developer API is available on platform.moonshot.ai with international USD pricing.",
    "website_url": "https://www.kimi.com",
    "category_slug": "chatbots-assistants",
    "pricing_model": "freemium",
    "pricing_details": "Free Adagio tier; paid plans Moderato $19/mo, Allegretto $39/mo, Allegro $99/mo, Vivace $199/mo with scaled agent quotas; API pay-as-you-go — K2.6 flagship $0.95/M input, $4.00/M output (256K context, cheap cache hits). Verified July 2026.",
    "editor_rating": 4.3,
    "company_name": "Moonshot AI",
    "founded_year": 2023,
    "key_features": [
      "Open-weight Kimi K2 model family (1T-parameter MoE)",
      "256K-token context window on flagship models",
      "Kimi Code for long-horizon agentic coding",
      "Deep Research multi-step web synthesis",
      "Agent Swarm parallel subagents",
      "Productivity agents for slides, sheets, and websites"
    ],
    "pros": [
      "Open-weight models reduce lock-in and enable self-hosting",
      "Low API pricing with very cheap cache-hit input",
      "Strong long-document and codebase handling in one pass"
    ],
    "cons": [
      "Paid plans meter agent quotas, so heavy users hit caps",
      "Consumer pricing varies by region and channel",
      "Data residency and moderation may concern some enterprise buyers"
    ],
    "use_cases": [
      "Summarizing and cross-referencing long documents",
      "Agentic coding across large codebases",
      "Multi-step research with source synthesis"
    ],
    "who_its_for": [
      "Researchers and analysts working with long documents",
      "Developers wanting a cheap long-context API",
      "Power users wanting agentic coding and research tools"
    ]
  },
  {
    "slug": "seedream",
    "name": "Seedream",
    "tagline": "ByteDance's image generation model family with web search grounding and multi-turn editing",
    "description": "Seedream is ByteDance Seed's image generation model family, available through the Dreamina (Jimeng) consumer platform and the Volcano Engine API for developers and enterprises. The current Seedream 5.0 generation adds web search grounding for real-world accuracy and multi-turn conversational image editing, turning image generation into an iterative dialogue rather than one-shot prompting. It targets commercial content production, e-commerce visuals, and creative design workflows.",
    "website_url": "https://dreamina.capcut.com",
    "category_slug": "image-generation",
    "pricing_model": "freemium",
    "pricing_details": "Free daily credits on Dreamina with paid plans for higher quotas; Volcano Engine API pay-as-you-go per image (enterprise application for API access). Verified July 2026.",
    "editor_rating": 4.4,
    "company_name": "ByteDance",
    "founded_year": 2012,
    "key_features": [
      "Seedream 5.0 with web search-grounded generation",
      "Multi-turn conversational image editing",
      "Consumer access via Dreamina (Jimeng) platform",
      "Volcano Engine API for developers and enterprises",
      "High-fidelity text rendering and commercial visuals",
      "Pairs with Seedance video models in one pipeline"
    ],
    "pros": [
      "Top-tier image quality at aggressive price points",
      "Web search grounding improves real-world accuracy",
      "Conversational editing reduces prompt-guessing loops"
    ],
    "cons": [
      "API access requires enterprise certification on Volcano Engine",
      "Best consumer experience tied to ByteDance ecosystem",
      "Content moderation and copyright policies less transparent for Western users"
    ],
    "use_cases": [
      "E-commerce and marketing image production",
      "Iterative design exploration via conversational edits",
      "Image assets feeding AI video pipelines"
    ],
    "who_its_for": [
      "Marketing and e-commerce teams producing visuals at scale",
      "Creators in the CapCut/Dreamina ecosystem",
      "Developers building image generation into apps via API"
    ]
  },
  {
    "slug": "seedance",
    "name": "Seedance",
    "tagline": "ByteDance's arena-topping AI video model with native audio sync and director-level controls",
    "description": "Seedance is ByteDance Seed's video generation model family, ranked #1 on the Artificial Analysis Text-to-Video and Image-to-Video arenas (Seedance 2.0, blind human preference). It generates video with natively synchronized audio in a single pass, supports text, image, audio, and video references, and offers region-level editing and 3D previsualization in the Seedance 2.5 release (public launch early July 2026, up to 30-second clips and 50 reference inputs). Access is via Dreamina (Jimeng), CapCut, the Doubao app, and the Volcano Engine API for enterprises.",
    "website_url": "https://dreamina.capcut.com",
    "category_slug": "video-audio",
    "pricing_model": "freemium",
    "pricing_details": "Limited free use on Dreamina/CapCut with paid plans prioritized; Volcano Engine API via enterprise application — third-party normalized cost ~$9 per minute of 1080p video (vs ~$24/min for Veo 3.1). Verified July 2026.",
    "editor_rating": 4.5,
    "company_name": "ByteDance",
    "founded_year": 2012,
    "key_features": [
      "#1 on Artificial Analysis video arenas (blind human preference)",
      "Native audio-video joint generation with lip sync in 8+ languages",
      "Up to 30-second single-clip generation (Seedance 2.5)",
      "Up to 50 multimodal reference inputs per generation",
      "Region-level editing and 3D previsualization",
      "Native 4K 10-bit output (Seedance 2.0 line)"
    ],
    "pros": [
      "Independent arena leader for both text-to-video and image-to-video",
      "Audio generated in sync — no post-production dubbing step",
      "Roughly 2-3x cheaper per minute than Western frontier rivals"
    ],
    "cons": [
      "Enterprise API access gated behind Volcano Engine certification",
      "Newest features launch first in the Chinese ecosystem",
      "Copyright compliance and content policies still maturing"
    ],
    "use_cases": [
      "Short-drama and social video production",
      "E-commerce and advertising video at scale",
      "Previsualization and effects templates for film workflows"
    ],
    "who_its_for": [
      "Video creators and short-form studios",
      "Marketing teams producing localized ad variants",
      "Enterprises building video generation into products"
    ]
  },
  {
    "slug": "google-ai-studio",
    "name": "Google AI Studio",
    "tagline": "Google's free playground and API gateway for Gemini, including Nano Banana image generation",
    "description": "Google AI Studio (aistudio.google.com) is Google's official developer and power-user interface for the Gemini API, maintained by Google DeepMind. It offers full model parameter control, system prompts, structured JSON output, code execution, and multimodal input testing with files, images, audio, and video. It is also the fastest way to try Google's generative media models, including the Nano Banana native image models (Gemini Flash Image) and Veo video, and to generate free Gemini API keys with a generous free tier.",
    "website_url": "https://aistudio.google.com",
    "category_slug": "llm-providers",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with daily rate limits across Gemini models (e.g. Flash-class models ~15 RPM / 1,500 requests per day); pay-as-you-go Gemini API pricing for production volume; media models (Nano Banana image, Veo video) billed per output. Verified July 2026.",
    "editor_rating": 4.4,
    "company_name": "Google",
    "founded_year": 2023,
    "key_features": [
      "Full prompt design with system instructions and parameters",
      "Free Gemini API keys with generous daily quotas",
      "Nano Banana (Gemini native image) generation and editing",
      "Veo video model access",
      "Structured JSON output and code execution",
      "Multimodal testing with files, images, audio, and video"
    ],
    "pros": [
      "Genuinely useful free tier for prototyping and small projects",
      "First access point for new Google DeepMind models",
      "Seamless path from playground to production Gemini API"
    ],
    "cons": [
      "Interface aimed at developers — steeper curve than gemini.google.com",
      "Free-tier rate limits too tight for production workloads",
      "Model naming and deprecations change frequently"
    ],
    "use_cases": [
      "Prototyping Gemini prompts before production integration",
      "Generating and editing images with Nano Banana models",
      "Testing multimodal inputs and structured outputs"
    ],
    "who_its_for": [
      "Developers building on the Gemini API",
      "Power users wanting more control than the Gemini app",
      "Creators testing Google's image and video models"
    ]
  },
  {
    "slug": "gpt-image",
    "name": "GPT Image API",
    "tagline": "OpenAI's image generation API — GPT Image 2 flagship with pay-per-image pricing",
    "description": "GPT Image is OpenAI's image generation model family on the OpenAI API, succeeding DALL-E (retired from the API in May 2026). The lineup spans GPT Image 2 (current flagship), GPT Image 1.5, and the budget GPT Image 1 Mini, all natively multimodal models that accept text and image input for generation and editing. Developers get three quality tiers (Low/Medium/High) and three aspect ratios with simple pay-per-image billing and no subscription requirement.",
    "website_url": "https://platform.openai.com/docs/guides/image-generation",
    "category_slug": "image-generation",
    "pricing_model": "paid",
    "pricing_details": "Pay-per-image via OpenAI API, no subscription: GPT Image 1 Mini ~$0.005-$0.052/image; GPT Image 1.5 ~$0.009-$0.20/image; GPT Image 2 flagship ~$0.006-$0.211/image by quality and size; $5 free credits for new accounts. Verified July 2026.",
    "editor_rating": 4.3,
    "company_name": "OpenAI",
    "founded_year": 2015,
    "key_features": [
      "GPT Image 2 flagship with strong prompt adherence and photorealism",
      "GPT Image 1 Mini for high-volume low-cost generation",
      "Text-to-image and reference-image editing in one API",
      "Three quality tiers and three aspect ratios per model",
      "Pay-per-image billing — failed generations not charged",
      "Same API key and billing as other OpenAI models"
    ],
    "pros": [
      "Strong instruction following and text rendering vs DALL-E era",
      "Simple per-image pricing with a genuinely cheap mini tier",
      "Easy drop-in for teams already on the OpenAI API"
    ],
    "cons": [
      "High-quality flagship images get expensive at volume",
      "Rapid model deprecations force migration planning",
      "No free ongoing tier beyond initial trial credits"
    ],
    "use_cases": [
      "Programmatic marketing and e-commerce image pipelines",
      "Product mockups and design iteration in apps",
      "High-volume social and content graphics via the mini tier"
    ],
    "who_its_for": [
      "Developers adding image generation to products",
      "Teams already standardized on the OpenAI API",
      "Automation builders needing predictable per-image costs"
    ]
  }
  ]::jsonb AS t(
    slug text,
    name text,
    tagline text,
    description text,
    website_url text,
    category_slug text,
    pricing_model text,
    pricing_details text,
    editor_rating numeric,
    company_name text,
    founded_year int,
    key_features jsonb,
    pros jsonb,
    cons jsonb,
    use_cases jsonb,
    who_its_for jsonb
  )
)
INSERT INTO public.tools (
  name,
  slug,
  tagline,
  description,
  website_url,
  category_id,
  pricing_model,
  pricing_details,
  editor_rating,
  is_verified,
  is_featured,
  status,
  published_at,
  company_name,
  founded_year,
  key_features,
  pros,
  cons,
  use_cases,
  who_its_for,
  meta_title,
  meta_description,
  pricing_as_of,
  last_verified_at
)
SELECT
  t.name,
  t.slug,
  t.tagline,
  t.description,
  t.website_url,
  c.id,
  t.pricing_model::pricing_model,
  t.pricing_details,
  t.editor_rating,
  false,
  false,
  'published'::tool_status,
  now(),
  t.company_name,
  t.founded_year,
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.key_features, '[]'::jsonb))),
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.pros, '[]'::jsonb))),
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.cons, '[]'::jsonb))),
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.use_cases, '[]'::jsonb))),
  ARRAY(SELECT jsonb_array_elements_text(COALESCE(t.who_its_for, '[]'::jsonb))),
  t.name || ' Review, Pricing, Alternatives | AiCensus',
  left(t.description, 155),
  '2026-07-20'::date,
  now()
FROM new_tools AS t
JOIN public.categories AS c ON c.slug = t.category_slug
ON CONFLICT (slug) DO NOTHING;

COMMIT;
