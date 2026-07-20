-- Fix miscategorized live tools + resolve crypto-infra entries (facts web-verified 2026-07-20).
--
-- Category fixes:
--   tavily:  llm-providers -> research-search (search/extract/crawl API for agents;
--            matches comparators exa/perplexity; acquired by Nebius Feb 2026, still operating)
--   mubert:  video-audio -> music-audio (pure AI music generation; matches soundraw)
--   aiva:    video-audio -> music-audio (pure AI music composition)
--
-- Crypto-infra decisions:
--   heurist: KEEP published; ai-agents -> models-infrastructure (decentralized AI
--            inference cloud + MCP agent mesh; active, last commit 2026-07-12)
-- Category UUIDs verified against live categories table 2026-07-20.
--   x402:    KEEP published; ai-agents -> models-infrastructure (open HTTP payment
--            protocol for agents; Linux Foundation x402 Foundation since Apr 2026,
--            165M+ transactions) — core agent-economy infrastructure
--   bankr:   KEEP published; stays ai-agents (it IS an AI agent product; v2 agent
--            runtime Apr 2026) — description updated with May 2026 prompt-injection
--            security incidents as a user caution
--   fonfik:  ARCHIVE (site live but it is a human/AI discussion forum, not an AI
--            tool; zero third-party coverage or traction evidence as of 2026-07-20).
--            successor_slug intentionally left NULL.

BEGIN;

-- tavily -> research-search
UPDATE public.tools
SET
  category_id = 'f4963bb0-1cfc-4584-865d-62acee6f7fd6',
  description = 'Tavily provides web search, extraction, crawling, and research APIs purpose-built for LLMs and AI agents, returning citation-ready results that drop directly into RAG pipelines and agent tool calls. Nebius agreed to acquire Tavily in February 2026; the product continues to operate under its own brand with the same API.',
  meta_description = 'Tavily provides web search, extraction, crawling, and research APIs purpose-built for LLMs and AI agents, with citation-ready results for RAG.',
  updated_at = now(),
  last_verified_at = now()
WHERE slug = 'tavily';

-- mubert -> music-audio
UPDATE public.tools
SET
  category_id = 'bb19783a-a692-4e8b-8deb-6f33558abe6c',
  updated_at = now(),
  last_verified_at = now()
WHERE slug = 'mubert';

-- aiva -> music-audio
UPDATE public.tools
SET
  category_id = 'bb19783a-a692-4e8b-8deb-6f33558abe6c',
  updated_at = now(),
  last_verified_at = now()
WHERE slug = 'aiva';

-- heurist: keep published, ai-agents -> models-infrastructure, refresh description
UPDATE public.tools
SET
  category_id = '133a8a99-2236-485e-8b52-f29ef177129e',
  description = 'Heurist is a decentralized AI-as-a-Service cloud offering serverless APIs for open-source LLMs and image-generation models, with GPU owners contributing compute permissionlessly. Heurist Mesh adds a marketplace of MCP-compatible specialist agents. Actively developed as of July 2026; relevant to developers exploring crypto-native AI inference and agent infrastructure.',
  meta_description = 'Heurist is a decentralized AI-as-a-Service cloud: serverless APIs for open-source LLMs and image models, plus an MCP agent marketplace.',
  updated_at = now(),
  last_verified_at = now()
WHERE slug = 'heurist';

-- x402: keep published, ai-agents -> models-infrastructure, refresh description
UPDATE public.tools
SET
  category_id = '133a8a99-2236-485e-8b52-f29ef177129e',
  description = 'x402 is an open payment protocol built around the HTTP 402 status code that lets AI agents and APIs settle stablecoin micropayments per request. Created by Coinbase and stewarded since April 2026 by the Linux Foundation''s x402 Foundation (participants include Cloudflare, Google, Stripe, and Visa), it processed 165M+ transactions by April 2026 and is core infrastructure for the agent economy.',
  meta_description = 'x402 is an open HTTP-native payment protocol for AI agents and APIs, stewarded by the Linux Foundation''s x402 Foundation since April 2026.',
  updated_at = now(),
  last_verified_at = now()
WHERE slug = 'x402';

-- bankr: keep published in ai-agents, refresh description with security caution
UPDATE public.tools
SET
  description = 'BANKR is an AI agent for crypto: users trade, swap, and manage wallets across Base, EVM L2s, and Solana via natural language on X, Farcaster, a web terminal, CLI, and API, and other agents can plug Bankr in as their wallet. Caution: in May 2026 prompt-injection exploits drained user wallets (about $150K across 14 wallets in one incident) before trading was paused and victims reimbursed - review agent wallet permissions carefully before use.',
  meta_description = 'BANKR is an AI agent for crypto trading and wallet management across Base, EVM L2s, and Solana via natural language. Note its May 2026 incidents.',
  updated_at = now(),
  last_verified_at = now()
WHERE slug = 'bankr';

-- fonfik: archive — live site, but a discussion forum, not an AI tool
UPDATE public.tools
SET
  status = 'archived',
  description = 'Archived 2026-07-20: fonfik.com is live, but Fonfik is a discussion forum where humans and AI agents post as equals - not an AI tool - with no third-party coverage or traction evidence. Poor fit for an AI-tools directory; retained for record-keeping. No successor.',
  updated_at = now(),
  last_verified_at = now()
WHERE slug = 'fonfik';

-- suno/udio: also AI music, not video-audio (consistency with mubert/aiva/soundraw)
UPDATE public.tools
SET
  category_id = (SELECT id FROM public.categories WHERE slug = 'music-audio'),
  updated_at = now(),
  last_verified_at = now()
WHERE slug IN ('suno', 'udio');

COMMIT;
