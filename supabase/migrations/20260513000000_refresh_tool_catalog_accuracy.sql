-- AiCensus tool catalog accuracy refresh
-- Prepared on 2026-05-13 after a multi-agent review of the published catalog.
-- This migration intentionally keeps existing slugs stable for SEO while
-- refreshing public-facing names, positioning, pricing notes, URLs, categories,
-- and archive status for tools that are no longer active standalone products.

BEGIN;

WITH updates AS (
  SELECT *
  FROM jsonb_to_recordset($updates$
[
  {
    "slug": "chatgpt",
    "website_url": "https://chatgpt.com",
    "pricing_model": "freemium",
    "pricing_details": "Free tier available; paid ChatGPT plans include Plus, Pro, Team/Business, and Enterprise tiers with higher limits and advanced features.",
    "tagline": "OpenAI's flagship AI assistant for writing, coding, research, images, files, and agentic work.",
    "description": "ChatGPT is OpenAI's general-purpose AI assistant for writing, coding, research, image creation, file analysis, voice, custom GPTs, projects, tasks, and agentic workflows. It is the mainstream default for people who want one AI workspace that can handle many everyday and professional tasks."
  },
  {
    "slug": "claude",
    "pricing_model": "freemium",
    "pricing_details": "Free tier available; paid plans include Pro, Max, Team, and Enterprise options with higher limits and expanded collaboration controls.",
    "tagline": "Anthropic's long-context assistant for writing, coding, analysis, and careful reasoning.",
    "description": "Claude is Anthropic's AI assistant for thoughtful writing, software work, document analysis, research synthesis, and complex multi-step reasoning. It is especially strong for long-context workflows, careful editing, and teams that value safety-oriented model behavior."
  },
  {
    "slug": "gemini",
    "pricing_model": "freemium",
    "pricing_details": "Free Gemini app access is available; advanced Gemini features are bundled into Google AI plans and Workspace/Cloud offerings.",
    "tagline": "Google's multimodal AI assistant across Search, Workspace, Android, and developer tools.",
    "description": "Gemini is Google's multimodal AI assistant and model family spanning chat, research, coding, image understanding, video understanding, Workspace help, Android assistance, and developer APIs. It is most valuable for users already working inside Google's ecosystem."
  },
  {
    "slug": "grok",
    "pricing_model": "freemium",
    "pricing_details": "Free access is limited; higher usage and advanced features are tied to X Premium and SuperGrok-style paid plans where available.",
    "tagline": "xAI's real-time assistant for chat, search, coding, images, and X-native context.",
    "description": "Grok is xAI's AI assistant for conversational answers, coding help, image generation, and real-time context from X. It is positioned as a fast, opinionated assistant for users who want current social context alongside general AI capability."
  },
  {
    "slug": "deepseek",
    "pricing_model": "freemium",
    "pricing_details": "Free consumer chat is available; API access is usage-based with pricing varying by model and token direction.",
    "tagline": "Efficient reasoning and coding models with low-cost API access.",
    "description": "DeepSeek offers consumer chat and API access to efficient language and reasoning models used for coding, research, math, and general assistant workflows. It is best known for strong capability-to-cost performance."
  },
  {
    "slug": "perplexity",
    "pricing_model": "freemium",
    "pricing_details": "Free search is available; Pro, Max, and Enterprise tiers add higher limits, advanced models, file workflows, and organization controls.",
    "tagline": "AI answer engine for cited web research and fast synthesis.",
    "description": "Perplexity is an AI-powered answer engine that searches the web, cites sources, and synthesizes research into concise responses. It is useful for current-event research, competitive analysis, shopping, and fast fact-finding with source trails."
  },
  {
    "slug": "notebooklm",
    "pricing_model": "freemium",
    "pricing_details": "Core NotebookLM is free; expanded limits and advanced capabilities are included in eligible Google AI plans.",
    "tagline": "Google's source-grounded notebook for research, reports, audio overviews, and study aids.",
    "description": "NotebookLM lets users upload sources and ask questions, generate summaries, create study aids, produce audio or video-style overviews, and synthesize reports grounded in their own material. It is built for students, researchers, writers, and teams working from a defined source set."
  },
  {
    "slug": "openai-api",
    "pricing_model": "paid",
    "pricing_details": "Usage-based pricing by model, token direction, tool, and modality; image, audio, realtime, batch, and fine-tuning features have separate rates.",
    "tagline": "Developer APIs for OpenAI models, tools, agents, realtime audio, images, and evaluation workflows.",
    "description": "The OpenAI API gives developers access to frontier language, reasoning, coding, vision, image, audio, realtime, embeddings, moderation, and agent-building capabilities. It is the direct path for building production AI features on top of OpenAI models."
  },
  {
    "slug": "anthropic-api",
    "pricing_model": "paid",
    "pricing_details": "Usage-based token pricing varies by Claude model, context length, and optional batch/caching features.",
    "tagline": "Claude API access for long-context reasoning, coding, tools, and enterprise-safe AI apps.",
    "description": "Anthropic API provides developers with Claude models for coding agents, document analysis, tool use, writing workflows, and long-context enterprise applications. It is a strong fit for teams building AI systems that need careful reasoning and reliable instruction following."
  },
  {
    "slug": "ai21-labs",
    "pricing_model": "freemium",
    "pricing_details": "Studio access includes trial credits; production API usage is billed by model and token volume.",
    "tagline": "Enterprise language models and task-specific APIs from AI21.",
    "description": "AI21 Labs provides Jamba language models and enterprise AI APIs for generation, editing, summarization, question answering, and business workflows. Its platform focuses on reliable language infrastructure for companies building AI into products."
  },
  {
    "slug": "cohere",
    "pricing_model": "freemium",
    "pricing_details": "Trial access is available; production usage is billed by model and endpoint, with enterprise deployment options.",
    "tagline": "Enterprise AI models for search, retrieval, reranking, embeddings, and secure generation.",
    "description": "Cohere provides enterprise-focused language models, embedding models, reranking APIs, retrieval tools, and secure deployment options. It is used by teams building search, support, knowledge, and agentic workflows over private data."
  },
  {
    "slug": "fireworks-ai",
    "pricing_model": "freemium",
    "pricing_details": "Starter credits are available; serverless, dedicated, fine-tuning, and batch inference are billed by usage and hardware profile.",
    "tagline": "Fast production inference and fine-tuning for open and custom AI models.",
    "description": "Fireworks AI is an inference platform for running open, proprietary, and fine-tuned models with serverless APIs, dedicated deployments, and production observability. It is built for teams that want low-latency model serving without managing GPU infrastructure directly."
  },
  {
    "slug": "groq",
    "pricing_model": "freemium",
    "pricing_details": "Developer access includes free usage limits; production API usage is billed by model and token volume.",
    "tagline": "Ultra-fast LLM inference for chat, agents, audio, and open model workloads.",
    "description": "Groq provides very low-latency inference for open and hosted models, including chat, tool-use, audio transcription, and agent workflows. It is strongest when response speed and high-throughput serving matter."
  },
  {
    "slug": "meta-llama",
    "pricing_model": "open_source",
    "pricing_details": "Model weights are available under Meta's Llama license; managed serving costs depend on the platform used.",
    "tagline": "Meta's open-weight Llama model family for local, cloud, and enterprise AI deployments.",
    "description": "Meta Llama is a family of open-weight language, multimodal, and safety models used across local inference, enterprise deployments, and cloud AI products. It is a foundational option for teams that want more control than closed model APIs provide."
  },
  {
    "slug": "mistral-ai",
    "pricing_model": "freemium",
    "pricing_details": "La Plateforme offers usage-based API pricing; Le Chat and enterprise deployments have separate free and paid plans.",
    "tagline": "European AI lab offering open, commercial, coding, reasoning, speech, and document models.",
    "description": "Mistral AI offers open-weight and commercial models through Le Chat, La Plateforme, enterprise deployments, coding tools, document AI, and multimodal APIs. It is a strong choice for teams wanting European AI infrastructure and a mix of open and hosted models."
  },
  {
    "slug": "openrouter",
    "pricing_model": "freemium",
    "pricing_details": "Free models are available; paid models are billed through OpenRouter credits with rates varying by provider and model.",
    "tagline": "One API and routing layer for hundreds of AI models across many providers.",
    "description": "OpenRouter lets developers access many AI models through one OpenAI-compatible API, compare providers, route traffic, and manage usage in one place. It is useful for teams that want model choice without integrating every provider separately."
  },
  {
    "slug": "together-ai",
    "pricing_model": "freemium",
    "pricing_details": "API usage is billed by model, token volume, endpoint type, and dedicated infrastructure where applicable.",
    "tagline": "Cloud platform for open model inference, fine-tuning, and GPU-backed AI applications.",
    "description": "Together AI provides serverless and dedicated inference, fine-tuning, embeddings, image models, and GPU infrastructure for open and custom models. It is a practical option for teams standardizing on open model workflows."
  },
  {
    "slug": "cursor",
    "pricing_model": "freemium",
    "pricing_details": "Hobby/free access is limited; Pro, Pro Plus, Ultra, Team, and Enterprise tiers add higher agent and model usage.",
    "tagline": "AI-native code editor with agents, codebase context, completions, and review workflows.",
    "description": "Cursor is an AI-first code editor built on VS Code that supports codebase-aware chat, multi-file edits, autonomous agents, tab completion, bug fixing, and repository-level workflows. It is a leading tool for developers who want AI embedded directly in their editor."
  },
  {
    "slug": "github-copilot",
    "pricing_model": "freemium",
    "pricing_details": "Free tier available; Pro, Pro Plus, Business, and Enterprise plans add higher usage, premium models, and organization controls.",
    "tagline": "GitHub's AI coding assistant for completions, chat, reviews, agents, and repository workflows.",
    "description": "GitHub Copilot helps developers write, explain, review, test, and refactor code across editors and GitHub. It now spans inline completion, chat, pull request help, agent workflows, CLI assistance, and enterprise governance."
  },
  {
    "slug": "devin",
    "website_url": "https://devin.ai",
    "pricing_model": "freemium",
    "pricing_details": "Limited free access may be available; paid Pro, team, and enterprise plans provide larger autonomous work allowances.",
    "tagline": "Cognition's autonomous AI software engineer for tickets, migrations, bugs, and projects.",
    "description": "Devin is an autonomous software engineering agent from Cognition that can plan work, edit code, run commands, use a browser, create pull requests, and handle multi-step engineering tasks. It is best for scoped tickets, migrations, debugging, and repetitive implementation work."
  },
  {
    "slug": "v0",
    "website_url": "https://v0.app",
    "pricing_model": "freemium",
    "pricing_details": "Free usage is limited; Team, Business, and enterprise Vercel plans add higher message and credit limits.",
    "tagline": "Vercel's AI app builder for React, Next.js, Tailwind, shadcn/ui, and full-stack prototypes.",
    "description": "v0 turns prompts, screenshots, and files into working React and Next.js interfaces with Tailwind and shadcn/ui conventions. It is useful for UI scaffolding, full-stack prototypes, and shipping frontend ideas into real code quickly."
  },
  {
    "slug": "bolt-new",
    "pricing_model": "freemium",
    "pricing_details": "Free daily/monthly token limits are available; Pro, Teams, and enterprise tiers provide more tokens and collaboration controls.",
    "tagline": "Browser-based AI app builder for full-stack prototypes and deployable web apps.",
    "description": "Bolt.new is an AI development environment that can generate, edit, run, and deploy full-stack web apps directly in the browser. It is useful for rapid prototypes, MVPs, and code-first product experiments."
  },
  {
    "slug": "lovable",
    "pricing_model": "freemium",
    "pricing_details": "Free credits are limited; paid Pro, Business, and enterprise plans add more build credits, collaboration, and controls.",
    "tagline": "Conversational app builder for shipping full-stack web products from prompts.",
    "description": "Lovable helps founders and teams build web apps by describing the product, iterating through chat, and connecting services like Supabase and GitHub. It is best for validating product ideas quickly while keeping a real codebase path open."
  },
  {
    "slug": "replit",
    "pricing_model": "freemium",
    "pricing_details": "Starter/free access is available; paid Core, Pro, and enterprise plans add more compute, AI, and deployment capacity.",
    "tagline": "Cloud development workspace with AI agents, hosting, databases, and collaboration.",
    "description": "Replit combines a browser IDE, AI coding agents, hosting, databases, secrets, and collaboration tools. It is useful for building and deploying apps without setting up a local development environment."
  },
  {
    "slug": "windsurf",
    "company_name": "Cognition",
    "pricing_model": "freemium",
    "pricing_details": "Free access is limited; paid Pro, Teams, and Enterprise tiers add higher agent/model usage and organization features.",
    "tagline": "Cognition's AI coding environment with Cascade agents and codebase context.",
    "description": "Windsurf is an AI coding editor formerly developed by Codeium and now part of Cognition. It provides codebase-aware chat, Cascade agent workflows, completions, terminal/context awareness, and team controls."
  },
  {
    "slug": "continue-dev",
    "pricing_model": "freemium",
    "pricing_details": "Open-source editor extensions remain available; paid team plans add managed usage, checks, and collaboration features.",
    "tagline": "Open-source AI coding assistant and code-review automation for teams.",
    "description": "Continue helps developers bring AI into their IDEs and workflows with customizable assistants, model choice, and source-controlled team configuration. Its newer product direction emphasizes AI checks and review workflows for engineering teams."
  },
  {
    "slug": "pieces",
    "pricing_model": "freemium",
    "pricing_details": "Free personal use is available; Pro and team plans add expanded memory, integrations, and collaboration features.",
    "tagline": "Long-term memory and workflow context for developers across apps and local work.",
    "description": "Pieces is an AI memory and workflow companion for developers that captures useful context, snippets, conversations, and activity across tools. It helps recall past decisions and connect work across editor, browser, and collaboration surfaces."
  },
  {
    "slug": "qodo",
    "pricing_model": "freemium",
    "pricing_details": "Developer/free access is available; Teams and Enterprise plans add review, testing, governance, and collaboration controls.",
    "tagline": "AI code quality platform for tests, reviews, PRs, and engineering governance.",
    "description": "Qodo provides AI tools for generating tests, reviewing pull requests, improving code quality, and enforcing engineering standards. It is aimed at teams that want AI assistance tied to quality and maintainability rather than only code generation."
  },
  {
    "slug": "sweep",
    "pricing_model": "paid",
    "pricing_details": "Paid personal and professional tiers are offered, with higher tiers adding more agent usage and IDE support.",
    "tagline": "AI coding assistant for JetBrains and developer workflows, evolved from the issue-to-PR bot.",
    "description": "Sweep has shifted from a GitHub issue-to-PR bot toward a broader AI coding assistant for developer workflows. It is best treated as a coding assistant rather than a fully autonomous open-source maintainer."
  },
  {
    "slug": "tabnine",
    "pricing_model": "paid",
    "pricing_details": "Paid developer and team plans are offered, with enterprise deployments and add-ons for private environments.",
    "tagline": "Enterprise AI coding assistant with private, compliant deployment options.",
    "description": "Tabnine provides AI code completion, chat, and agentic coding assistance with a focus on privacy, compliance, and enterprise deployment controls. It is a fit for organizations that need code AI inside stricter security boundaries."
  },
  {
    "slug": "sourcegraph-cody",
    "pricing_model": "enterprise",
    "pricing_details": "Cody is packaged with Sourcegraph enterprise offerings; pricing depends on seats, deployment, and organization needs.",
    "tagline": "Sourcegraph's AI coding assistant for large codebases and enterprise code intelligence.",
    "description": "Sourcegraph Cody uses Sourcegraph's code intelligence to answer questions, generate code, and assist with large codebases. It is most relevant for organizations already using Sourcegraph or needing deep repository-scale search and context."
  },
  {
    "slug": "adobe-firefly",
    "pricing_model": "freemium",
    "pricing_details": "Free generative credits are limited; paid Firefly, Creative Cloud, and enterprise plans add more credits and commercial workflows.",
    "tagline": "Adobe's generative AI suite for images, video, audio, design, and Creative Cloud workflows.",
    "description": "Adobe Firefly is Adobe's family of generative AI tools for images, video, vector, design assets, and creative editing inside Adobe products. It is built for commercial creative workflows, with Adobe-provided licensing and enterprise controls."
  },
  {
    "slug": "clipdrop",
    "company_name": "Jasper",
    "pricing_model": "freemium",
    "pricing_details": "Free tools are limited; paid plans and Jasper-owned workflows unlock higher usage and additional image editing capabilities.",
    "tagline": "AI image editing tools for cleanup, background removal, upscaling, relighting, and generation.",
    "description": "Clipdrop is an AI image editing suite for background removal, object cleanup, upscaling, relighting, text-to-image generation, and creative edits. It is now part of Jasper's creative AI ecosystem."
  },
  {
    "slug": "dall-e-3",
    "pricing_model": "freemium",
    "pricing_details": "Available through ChatGPT plans and OpenAI image APIs; API image pricing varies by model, size, and quality.",
    "tagline": "OpenAI image generation known for prompt following and ChatGPT integration.",
    "description": "DALL-E 3 remains an OpenAI image generation option available through ChatGPT-style workflows and APIs, though OpenAI's newer image models now handle many default ChatGPT image tasks. It is still recognized for prompt adherence and text-aware image creation."
  },
  {
    "slug": "flux",
    "website_url": "https://bfl.ai",
    "pricing_model": "freemium",
    "pricing_details": "Open-weight FLUX variants can be self-hosted under their licenses; hosted FLUX API usage is billed per image or credit.",
    "tagline": "Black Forest Labs image models for high-quality generation, editing, and open-weight workflows.",
    "description": "FLUX is a family of image generation and editing models from Black Forest Labs, with hosted APIs and open-weight variants used widely in creative and developer workflows. It is a strong option for teams that want high quality plus deployment flexibility."
  },
  {
    "slug": "freepik-ai",
    "pricing_model": "freemium",
    "pricing_details": "Free use is limited; paid Freepik AI and premium plans add more credits, assets, commercial features, and higher usage.",
    "tagline": "Creative AI suite for images, video, design assets, templates, and stock workflows.",
    "description": "Freepik AI bundles image generation, editing, upscaling, video tools, design templates, and stock creative assets. It is useful for marketers and designers who want generative tools inside a large asset marketplace."
  },
  {
    "slug": "ideogram",
    "pricing_model": "freemium",
    "pricing_details": "Free weekly credits are limited; paid Plus, Pro, and team plans add more generations, priority, and private creation features.",
    "tagline": "AI image generator especially strong at legible text, logos, posters, and design graphics.",
    "description": "Ideogram is an AI image generation platform known for high-quality typography inside images, prompt enhancement, style control, and design-focused outputs. It is especially useful for ads, posters, logos, thumbnails, and text-heavy creative."
  },
  {
    "slug": "leonardo-ai",
    "company_name": "Canva",
    "pricing_model": "freemium",
    "pricing_details": "Free daily tokens are available; paid Essential, Premium, Ultimate, and team/business plans add higher generation limits and commercial controls.",
    "tagline": "Canva-owned AI creative platform for images, motion, textures, and production assets.",
    "description": "Leonardo AI is a generative creative platform for images, game assets, design visuals, textures, motion, and fine-tuned visual workflows. It is now part of Canva and remains a strong tool for creators who need production-style image control."
  },
  {
    "slug": "midjourney",
    "pricing_model": "paid",
    "pricing_details": "Paid subscription plans provide GPU time and creation access; pricing varies by monthly or annual plan.",
    "tagline": "AI image generator known for high-end aesthetics, concept art, and visual exploration.",
    "description": "Midjourney is a leading AI image generation service for highly aesthetic visuals, concept art, moodboards, product concepts, and creative exploration. It remains a favorite for designers and creators who prioritize visual taste over API-style control."
  },
  {
    "slug": "playground-ai",
    "pricing_model": "freemium",
    "pricing_details": "Free use is limited; paid design and generation plans unlock more usage and advanced creative features.",
    "tagline": "AI-native design and image creation workspace for social, marketing, and product visuals.",
    "description": "Playground is an AI design and image creation tool for producing graphics, product shots, social assets, and creative variations. It is positioned more as a design workspace than a pure image model playground."
  },
  {
    "slug": "stable-diffusion",
    "pricing_model": "open_source",
    "pricing_details": "Open and community models can be self-hosted; commercial hosted APIs and newer model licenses vary by provider and use case.",
    "tagline": "Open image generation ecosystem for local, hosted, custom, and fine-tuned workflows.",
    "description": "Stable Diffusion is the broad open image generation ecosystem around Stability AI and community models. It powers local apps, custom fine-tunes, APIs, ControlNet-style workflows, LoRAs, and many creative tools."
  },
  {
    "slug": "beautiful-ai",
    "pricing_model": "paid",
    "pricing_details": "Paid Pro and Team plans are available, with enterprise options for larger organizations.",
    "tagline": "AI-assisted presentation software with smart slide templates and brand controls.",
    "description": "Beautiful.ai helps teams create polished presentations with smart templates, automated layout behavior, brand controls, collaboration, and AI-assisted drafting. It is built for recurring business presentation workflows."
  },
  {
    "slug": "figma-ai",
    "founded_year": 2012,
    "pricing_model": "freemium",
    "pricing_details": "Figma offers free and paid seat-based plans; AI features are included or billed depending on plan and workspace settings.",
    "tagline": "AI features inside Figma for design exploration, editing, search, and workflow acceleration.",
    "description": "Figma AI adds generation, editing, summarization, search, and workflow assistance to Figma's collaborative design platform. It is most useful for designers and product teams already building interfaces and design systems in Figma."
  },
  {
    "slug": "framer",
    "pricing_model": "freemium",
    "pricing_details": "Free sites are available; paid Basic, Pro, Scale, and enterprise plans add custom domains, CMS, traffic, and collaboration features.",
    "tagline": "No-code website builder with AI site generation, CMS, design, and publishing.",
    "description": "Framer is a visual website builder for designing, animating, managing, and publishing modern websites. Its AI features help generate site structure and content, while the core product focuses on polished no-code web publishing."
  },
  {
    "slug": "gamma",
    "pricing_model": "freemium",
    "pricing_details": "Free credits are available; Plus, Pro, and Ultra plans add higher credits, export, analytics, custom branding, and team features.",
    "tagline": "AI presentation, document, and webpage builder for turning ideas into polished narratives.",
    "description": "Gamma generates presentations, documents, and webpages from prompts, notes, or existing content. It is useful for fast decks, internal explainers, educational material, and visual storytelling without manually designing every slide."
  },
  {
    "slug": "tome",
    "status": "archived",
    "pricing_details": "Archived: Tome's original AI presentation product was sunset; the company domain now points to Lightfield, an AI-native CRM.",
    "tagline": "Archived AI presentation product from Tome.",
    "description": "Tome's original AI presentation and storytelling product is no longer an active standalone design tool. The company pivoted toward Lightfield, an AI-native CRM, so this directory entry is archived to avoid sending users to an outdated presentation product."
  },
  {
    "slug": "sora",
    "status": "archived",
    "pricing_details": "Archived: OpenAI discontinued Sora web and app experiences on 2026-04-26; Sora API sunset is scheduled for 2026-09-24.",
    "tagline": "Archived OpenAI text-to-video product.",
    "description": "Sora is archived in AiCensus because OpenAI discontinued the Sora web and app experiences on April 26, 2026. Existing API access is scheduled to be discontinued on September 24, 2026, so users should choose active video-generation alternatives."
  },
  {
    "slug": "playht",
    "status": "archived",
    "pricing_details": "Archived: PlayHT/PlayAI service shutdown reports and migration notices indicate the product is no longer a reliable active listing.",
    "tagline": "Archived AI voice generation service.",
    "description": "PlayHT is archived because the service is no longer a reliable active AI voice generation listing. Users looking for voice generation should compare active alternatives such as ElevenLabs, Murf AI, Deepgram, or Synthesia."
  },
  {
    "slug": "perplexity-pages",
    "status": "archived",
    "pricing_details": "Archived as a standalone tool: Perplexity temporarily retired page creation while rebuilding the Pages experience.",
    "tagline": "Archived standalone listing for Perplexity Pages.",
    "description": "Perplexity Pages is archived as a standalone AiCensus tool because the page creation feature has been temporarily retired and folded back into Perplexity's broader product roadmap. Users should start with the main Perplexity listing instead."
  },
  {
    "slug": "babyagi",
    "status": "archived",
    "pricing_details": "Archived: the original BabyAGI project is best treated as a historical open-source agent demo, not an active product.",
    "tagline": "Archived autonomous-agent demo that influenced later agent frameworks.",
    "description": "BabyAGI is archived because the original project is primarily a historical open-source autonomous-agent demo rather than an active product users should adopt today. Modern users should compare CrewAI, LangChain, LlamaIndex, AutoGPT, or OpenClaw."
  },
  {
    "slug": "runway",
    "pricing_model": "freemium",
    "pricing_details": "Free one-time credits are limited; paid Standard, Pro, Unlimited, and enterprise plans add more credits, models, and collaboration.",
    "tagline": "Professional AI video generation and editing platform for creators and studios.",
    "description": "Runway is a creative AI platform for text-to-video, image-to-video, video editing, motion control, generative fill, asset workflows, and studio-grade production experiments. It is one of the most established tools for AI-assisted video creation."
  },
  {
    "slug": "pika",
    "pricing_model": "freemium",
    "pricing_details": "Free credits are limited; paid tiers add more credits, faster generation, commercial use, and advanced video controls.",
    "tagline": "AI video generator for short-form clips, social content, effects, and fast experimentation.",
    "description": "Pika is an AI video tool for generating and editing short video clips from prompts, images, and creative effects. It is best for fast iteration, social-first creative, and playful video experiments."
  },
  {
    "slug": "kling-ai",
    "website_url": "https://kling.ai",
    "pricing_model": "freemium",
    "pricing_details": "Free credits are limited; paid plans and credit packs unlock higher usage, newer models, and faster generation.",
    "tagline": "Kuaishou's AI video platform for text-to-video, image-to-video, and creative effects.",
    "description": "Kling AI is an AI video generation platform offering text-to-video, image-to-video, motion control, and creative video effects. It is a strong alternative for creators comparing active AI video tools."
  },
  {
    "slug": "luma-dream-machine",
    "pricing_model": "freemium",
    "pricing_details": "Free use is limited; paid Plus, Pro, Ultra, and enterprise tiers provide more credits and commercial capacity.",
    "tagline": "Luma's AI video and image generation platform for cinematic scenes and camera motion.",
    "description": "Luma Dream Machine generates videos and images with cinematic camera motion, physical scene coherence, and creative controls. It is useful for product shots, cinematic clips, concept videos, and visual exploration."
  },
  {
    "slug": "hailuo-ai",
    "pricing_model": "freemium",
    "pricing_details": "Free credits are limited; paid credits and plans unlock more video/image generation capacity.",
    "tagline": "MiniMax creative AI platform for video, image, and multimodal generation.",
    "description": "Hailuo AI from MiniMax is a creative AI platform for generating videos, images, and multimodal content. It is useful for social clips, prompt-to-video experiments, and fast creative iteration."
  },
  {
    "slug": "heygen",
    "pricing_model": "freemium",
    "pricing_details": "Free access is limited; Creator, Pro, Business, and Enterprise tiers add more minutes, avatars, languages, and brand controls.",
    "tagline": "AI avatar video platform for translated, personalized, and business-ready talking-head content.",
    "description": "HeyGen creates AI avatar videos, translated videos, personalized outreach, and business video content from scripts. It is strongest for sales, training, onboarding, and localization workflows that need presenter-style video at scale."
  },
  {
    "slug": "synthesia",
    "pricing_model": "freemium",
    "pricing_details": "Free basic access is available; paid Starter, Creator, and Enterprise plans add more minutes, avatars, languages, and team controls.",
    "tagline": "Enterprise AI video platform for avatar-led training, internal comms, and localized content.",
    "description": "Synthesia lets teams create avatar-led videos from scripts for training, onboarding, support, internal communications, and localization. It is a mature enterprise option for scalable business video production."
  },
  {
    "slug": "elevenlabs",
    "pricing_model": "freemium",
    "pricing_details": "Free monthly characters are limited; Starter, Creator, Pro, Scale, Business, and enterprise plans add more usage and commercial features.",
    "tagline": "AI voice platform for speech generation, dubbing, voice cloning, sound effects, and conversational audio.",
    "description": "ElevenLabs provides AI voice generation, voice cloning, dubbing, speech-to-text, sound effects, and conversational audio tools. It is widely used by creators, media teams, developers, and businesses producing natural-sounding voice content."
  },
  {
    "slug": "deepgram",
    "pricing_model": "freemium",
    "pricing_details": "Free credits are available; speech-to-text, text-to-speech, and audio intelligence are billed by usage and model.",
    "tagline": "Speech AI APIs for transcription, realtime audio, text-to-speech, and voice agents.",
    "description": "Deepgram provides developer APIs for speech-to-text, text-to-speech, realtime transcription, audio intelligence, and voice-agent infrastructure. It is a strong fit for teams building production voice products."
  },
  {
    "slug": "descript",
    "pricing_model": "freemium",
    "pricing_details": "Free editing is limited; paid Hobbyist, Creator, Business, and enterprise plans add hours, exports, AI tools, and collaboration.",
    "tagline": "Transcript-based audio and video editor with AI voice, clips, captions, and production tools.",
    "description": "Descript lets creators edit audio and video by editing transcripts, remove filler words, generate captions, clone voices with consent, create clips, and produce podcasts or videos faster. It is a high-leverage editor for content teams."
  },
  {
    "slug": "opus-clip",
    "pricing_model": "freemium",
    "pricing_details": "Free credits are limited; Starter, Pro, and business tiers add more credits, exports, templates, and team workflows.",
    "tagline": "AI clipping platform that turns long videos into short-form social clips.",
    "description": "Opus Clip analyzes long-form videos and creates short clips with captions, framing, scores, and social-ready formats. It is useful for creators and marketers repurposing podcasts, webinars, streams, and YouTube videos."
  },
  {
    "slug": "suno",
    "pricing_model": "freemium",
    "pricing_details": "Free daily credits are limited; Pro and Premier plans add more credits, commercial use, stems, and advanced creation features.",
    "tagline": "AI music generation platform for songs, stems, lyrics, and creative audio production.",
    "description": "Suno generates songs, instrumentals, lyrics, vocals, and music variations from prompts. It is useful for musicians, creators, marketers, and hobbyists making original tracks quickly."
  },
  {
    "slug": "udio",
    "pricing_model": "freemium",
    "pricing_details": "Free creation is limited; paid Standard and Pro plans add more credits, priority, and advanced features.",
    "tagline": "AI music generator for songs, instrumentals, remixes, and creative music exploration.",
    "description": "Udio is an AI music generation tool for creating songs, instrumentals, variations, and prompt-guided music ideas. It is useful for creators exploring musical concepts and producing draft tracks quickly."
  },
  {
    "slug": "agentgpt",
    "pricing_model": "freemium",
    "pricing_details": "Open-source project is available; hosted Pro-style plans have historically offered higher agent limits and convenience features.",
    "tagline": "Browser-based autonomous-agent experiment for planning and executing goal loops.",
    "description": "AgentGPT is an early autonomous-agent interface that lets users name a goal and watch an agent break it into tasks. It is best viewed as an educational and experimental agent product rather than a modern production agent platform."
  },
  {
    "slug": "autogpt",
    "website_url": "https://agpt.co",
    "pricing_model": "open_source",
    "pricing_details": "Open-source framework is free to self-host; hosted/cloud availability and pricing vary as the AutoGPT platform evolves.",
    "tagline": "Open-source autonomous agent framework and platform for goal-driven AI workflows.",
    "description": "AutoGPT is an open-source agent project and platform for building autonomous, goal-driven AI workflows. It helped popularize agent loops and remains relevant for developers experimenting with agent orchestration."
  },
  {
    "slug": "bankr",
    "website_url": "https://bankr.bot",
    "pricing_model": "freemium",
    "pricing_details": "Bot access may be free to start; trading, network, and protocol fees depend on connected chains and actions.",
    "tagline": "AI crypto companion for onchain research, trading flows, and wallet-aware assistance.",
    "description": "BANKR is an AI-powered crypto assistant that helps users research, interact with, and act across onchain ecosystems. It is relevant to users who want conversational help around crypto markets and wallet-connected workflows."
  },
  {
    "slug": "clawhub",
    "category_slug": "mcp-skills-platforms",
    "pricing_model": "free",
    "tagline": "Registry and discovery hub for OpenClaw skills, plugins, and agent extensions.",
    "description": "ClawHub is a registry-style platform for discovering and sharing OpenClaw skills and plugins. It belongs with MCP and skills platforms rather than general AI agents."
  },
  {
    "slug": "crewai",
    "pricing_model": "open_source",
    "pricing_details": "Open-source framework is free; managed platform, enterprise, and control-plane features may be paid.",
    "tagline": "Multi-agent framework and platform for orchestrating role-based AI crews.",
    "description": "CrewAI helps developers build role-based multi-agent systems with tasks, tools, memory, flows, and orchestration patterns. It is popular for teams prototyping and operationalizing collaborative agent workflows."
  },
  {
    "slug": "heurist",
    "pricing_model": "open_source",
    "tagline": "Decentralized AI infrastructure and agent economy for inference, tools, and onchain workflows.",
    "description": "Heurist is a decentralized AI infrastructure project focused on model inference, agents, tool access, and onchain coordination. It is relevant to developers exploring crypto-native AI systems and agent economies."
  },
  {
    "slug": "llamaindex",
    "pricing_model": "freemium",
    "pricing_details": "Open-source framework is free; LlamaCloud/LlamaParse and managed platform features use paid credits or subscription tiers.",
    "tagline": "Data framework and managed services for RAG, agents, document parsing, and knowledge apps.",
    "description": "LlamaIndex helps developers connect private data to LLM applications through retrieval, indexing, agents, workflows, and document parsing. It is a common foundation for RAG systems and knowledge assistants."
  },
  {
    "slug": "phidata",
    "name": "Agno",
    "website_url": "https://www.agno.com",
    "company_name": "Agno",
    "pricing_model": "open_source",
    "pricing_details": "Agno's open-source framework is free; managed cloud and enterprise features may be paid.",
    "tagline": "Formerly Phidata, an open-source framework for building multimodal AI agents.",
    "description": "Agno, formerly Phidata, is an open-source framework for building multimodal agents with memory, tools, knowledge, and structured workflows. The AiCensus slug remains phidata for URL stability, but the public listing now reflects the current Agno name."
  },
  {
    "slug": "superagi",
    "pricing_model": "freemium",
    "pricing_details": "Free usage is limited; paid Starter, Business, and enterprise plans add more credits and production features.",
    "tagline": "Agent platform for building, deploying, and managing AI agents and workflows.",
    "description": "SuperAGI provides tools for creating, deploying, and operating AI agents and workflows. It is useful for teams exploring agent automation without starting entirely from scratch."
  },
  {
    "slug": "x402",
    "pricing_model": "open_source",
    "pricing_details": "Open protocol with no platform subscription by default; implementation costs and network fees depend on the stack used.",
    "tagline": "Open payment protocol for agentic and API-based machine-to-machine commerce.",
    "description": "x402 is an open protocol for enabling HTTP-native payments, agent payments, and API commerce. It is relevant to developers building monetized APIs, autonomous agents, and pay-per-use services."
  },
  {
    "slug": "composio",
    "pricing_model": "freemium",
    "pricing_details": "Free monthly action limits are available; paid plans add higher action volumes, managed auth, team controls, and enterprise support.",
    "tagline": "Tool integration, managed auth, and action layer for AI agents and MCP workflows.",
    "description": "Composio gives AI agents access to hundreds of apps through managed authentication, tools, triggers, and integration APIs. It is useful for developers building agents that need reliable third-party actions."
  },
  {
    "slug": "glama",
    "pricing_model": "freemium",
    "pricing_details": "Free discovery is available; paid Starter, Pro, and Business plans add higher usage, monitoring, and team features.",
    "tagline": "MCP server directory and gateway for discovering, testing, and managing AI tools.",
    "description": "Glama helps users discover MCP servers, evaluate integrations, and connect tools into AI workflows. It is part of the growing MCP and agent tooling ecosystem."
  },
  {
    "slug": "langflow",
    "pricing_model": "open_source",
    "pricing_details": "Open-source Langflow remains available; hosted and enterprise options depend on current maintainers and deployment model.",
    "tagline": "Visual open-source builder for LangChain-style agents, flows, and RAG apps.",
    "description": "Langflow is a visual builder for composing LLM flows, agents, retrieval pipelines, and integrations. It remains useful as an open-source way to prototype AI workflows visually."
  },
  {
    "slug": "manus-ai",
    "category_slug": "ai-agents",
    "pricing_model": "freemium",
    "pricing_details": "Free or trial access is limited; paid plans provide more autonomous agent runs and workspace capacity.",
    "tagline": "General AI agent for browsing, research, coding, files, and multi-step task execution.",
    "description": "Manus AI is a general-purpose autonomous agent that can browse, research, write, code, manipulate files, and complete multi-step digital tasks. It belongs in AI Agents rather than MCP platforms."
  },
  {
    "slug": "relevance-ai",
    "category_slug": "ai-agents",
    "pricing_model": "freemium",
    "pricing_details": "Free action limits are available; Pro, Team, and enterprise tiers add more actions, users, and deployment controls.",
    "tagline": "No-code AI workforce platform for building agents, tools, and automations.",
    "description": "Relevance AI lets teams build AI agents, tools, and workflows without heavy engineering overhead. It is aimed at operational teams creating AI workforces for sales, support, research, and internal processes."
  },
  {
    "slug": "wordware",
    "pricing_model": "freemium",
    "pricing_details": "Free building is limited; paid plans add more execution, collaboration, and production capacity.",
    "tagline": "Prompt and agent development environment for building AI workflows with context.",
    "description": "Wordware helps builders create, test, and ship AI workflows with structured prompts, context, tools, and collaboration. Its positioning has shifted toward AI context and agent experimentation rather than a simple prompt playground."
  },
  {
    "slug": "koboldai",
    "name": "KoboldAI",
    "website_url": "https://koboldai.com",
    "pricing_model": "open_source",
    "tagline": "Open local AI writing and roleplay ecosystem centered on KoboldCpp and KoboldAI Lite.",
    "description": "KoboldAI is an open-source local AI ecosystem for creative writing, roleplay, chat, and model hosting. The current active center of gravity is KoboldCpp and KoboldAI Lite, which support local inference, browser UI workflows, and community model usage."
  },
  {
    "slug": "ollama",
    "pricing_model": "freemium",
    "pricing_details": "Local runtime is free; paid cloud or hosted features may be offered separately.",
    "tagline": "The easiest way to run open models locally and serve them through a developer-friendly API.",
    "description": "Ollama lets users download, run, and serve open-weight models locally with simple commands and an OpenAI-style API. It is one of the friendliest entry points for local AI on laptops and servers."
  },
  {
    "slug": "lm-studio",
    "pricing_model": "freemium",
    "pricing_details": "Personal/local use is available; team and enterprise licensing applies for commercial organization workflows.",
    "tagline": "Desktop app for discovering, running, chatting with, and serving local AI models.",
    "description": "LM Studio is a desktop app for downloading, running, and testing local language models with a chat UI and local server. It is useful for privacy-sensitive users and developers evaluating open models locally."
  },
  {
    "slug": "open-webui",
    "pricing_model": "open_source",
    "pricing_details": "Self-hosted Open WebUI is open-source; commercial and enterprise usage should review current licensing and support options.",
    "tagline": "Self-hosted AI interface for Ollama, OpenAI-compatible APIs, tools, RAG, and teams.",
    "description": "Open WebUI is a self-hosted chat and AI workspace that connects to Ollama and OpenAI-compatible APIs. It supports users, tools, files, RAG workflows, model routing, and team-style local AI usage."
  },
  {
    "slug": "text-generation-webui",
    "name": "TextGen",
    "website_url": "https://github.com/oobabooga/text-generation-webui",
    "pricing_model": "open_source",
    "tagline": "Open-source web UI for running, testing, and serving local language models.",
    "description": "TextGen, formerly commonly called text-generation-webui, is an open-source web interface for loading and experimenting with local language models. It remains popular among users who want deep model and sampler control."
  },
  {
    "slug": "copy-ai",
    "pricing_model": "paid",
    "pricing_details": "Paid Chat, Growth, Expansion, Scale, and enterprise plans focus on GTM workflows, agents, and workflow automation.",
    "tagline": "GTM AI platform for sales, marketing, content, and workflow automation.",
    "description": "Copy.ai has evolved from a copywriting assistant into a go-to-market AI platform for sales, marketing, content operations, and workflow automation. It is aimed at teams building repeatable GTM processes with AI agents."
  },
  {
    "slug": "frase",
    "pricing_model": "paid",
    "pricing_details": "Paid Starter, Professional, Scale, and business options support SEO, AI visibility, and content workflows.",
    "tagline": "SEO and AI-search content platform for briefs, optimization, and visibility tracking.",
    "description": "Frase helps teams research search intent, create content briefs, optimize articles, and track AI/search visibility. It is relevant for marketers working across SEO and emerging generative search surfaces."
  },
  {
    "slug": "grammarly",
    "pricing_model": "freemium",
    "pricing_details": "Free writing help is available; Pro and Enterprise tiers add advanced rewrite, tone, brand, and governance features.",
    "tagline": "AI writing assistant for grammar, clarity, rewriting, tone, and business communication.",
    "description": "Grammarly provides writing assistance across apps, including grammar, clarity, tone, rewrites, summaries, and AI drafting. It is useful for individuals and teams that want communication polish everywhere they write."
  },
  {
    "slug": "jasper",
    "pricing_model": "paid",
    "pricing_details": "Paid Creator/Pro-style plans and Business/enterprise options add brand voice, campaigns, agents, governance, and collaboration.",
    "tagline": "Marketing AI platform for brand voice, campaigns, content, agents, and enterprise workflows.",
    "description": "Jasper is a marketing-focused AI platform for brand voice, campaign content, creative workflows, agents, and enterprise content operations. It is designed for teams that need repeatable branded marketing output."
  },
  {
    "slug": "writer",
    "pricing_model": "enterprise",
    "pricing_details": "Enterprise pricing is custom, with platform features for agents, governance, models, knowledge, and workflow automation.",
    "tagline": "Enterprise generative AI platform for agents, knowledge work, governance, and business workflows.",
    "description": "Writer is an enterprise AI platform for building agents, automating workflows, governing content, and applying company knowledge to business processes. It is positioned for regulated and large organizations that need controlled AI adoption."
  },
  {
    "slug": "writesonic",
    "pricing_model": "freemium",
    "pricing_details": "Free access is limited; paid creator, professional, team, and business options add more AI search visibility and content capacity.",
    "tagline": "AI writing and search-visibility platform for content, SEO, GEO, and marketing workflows.",
    "description": "Writesonic provides AI writing, chatbot, SEO, and generative search visibility tools for marketers. Its newer positioning emphasizes helping brands appear and perform inside AI search and answer engines."
  },
  {
    "slug": "microsoft-copilot",
    "pricing_model": "freemium",
    "pricing_details": "Consumer Copilot has free and paid options; Microsoft 365 Copilot and enterprise plans are billed per user with organization controls.",
    "tagline": "Microsoft's AI assistant across Windows, Edge, Microsoft 365, and enterprise workflows.",
    "description": "Microsoft Copilot provides AI assistance across web search, Windows, Edge, Office apps, Teams, Outlook, and enterprise Microsoft 365 data. It is most valuable for organizations standardized on Microsoft tools."
  },
  {
    "slug": "notion-ai",
    "pricing_model": "freemium",
    "pricing_details": "AI features are tied to Notion plans and add-ons; team and enterprise pricing varies by workspace needs.",
    "tagline": "AI writing, summarization, search, and knowledge assistance inside Notion workspaces.",
    "description": "Notion AI adds writing help, summaries, Q&A, translation, meeting notes, and knowledge assistance inside Notion. It is useful for teams that already manage docs, wikis, roadmaps, and projects in Notion."
  },
  {
    "slug": "mem-ai",
    "pricing_model": "freemium",
    "pricing_details": "Free or trial access is limited; paid plans add more memory, search, and collaboration capacity.",
    "tagline": "AI-native notes and memory workspace for capturing, searching, and connecting knowledge.",
    "description": "Mem is an AI-native notes and knowledge workspace designed to capture ideas, connect related notes, and retrieve context later. It is useful for people who want a personal or team memory layer."
  },
  {
    "slug": "make-com",
    "pricing_model": "freemium",
    "pricing_details": "Free operations are limited; paid Core, Pro, Teams, and Enterprise plans add more operations, scheduling, and governance.",
    "tagline": "Visual automation platform for connecting apps, APIs, AI tools, and business workflows.",
    "description": "Make.com is a visual workflow automation platform for connecting apps, APIs, databases, and AI tools. It is useful for teams that want flexible no-code automation beyond simple trigger-action flows."
  },
  {
    "slug": "zapier",
    "pricing_model": "freemium",
    "pricing_details": "Free Zaps are limited; paid Professional, Team, and Enterprise plans add more tasks, apps, AI features, and governance.",
    "tagline": "No-code automation platform with AI agents, app integrations, tables, interfaces, and workflows.",
    "description": "Zapier connects thousands of apps through automations, AI-powered workflows, agents, tables, interfaces, and app actions. It is a default choice for business users who want to automate SaaS workflows without custom code."
  },
  {
    "slug": "reclaim-ai",
    "pricing_model": "freemium",
    "pricing_details": "Free scheduling is limited; paid plans add more calendars, habits, team features, and scheduling controls.",
    "tagline": "AI calendar assistant for time blocking, focus time, habits, and smart scheduling.",
    "description": "Reclaim AI automatically schedules focus time, habits, tasks, breaks, and meetings around calendar availability. It is useful for individuals and teams trying to protect deep work and reduce scheduling friction."
  },
  {
    "slug": "taskade",
    "pricing_model": "freemium",
    "pricing_details": "Free workspaces are limited; paid Pro, Teams, and enterprise plans add more AI, projects, storage, and collaboration.",
    "tagline": "Collaborative AI workspace for tasks, notes, mind maps, agents, and team workflows.",
    "description": "Taskade combines tasks, docs, mind maps, chat, and AI agents in one collaborative workspace. It is useful for small teams that want lightweight project management with built-in AI assistance."
  },
  {
    "slug": "gumloop",
    "pricing_model": "freemium",
    "pricing_details": "Free runs are limited; paid plans add higher workflow usage, integrations, and team features.",
    "tagline": "No-code AI automation builder for workflows, agents, scraping, docs, and app actions.",
    "description": "Gumloop lets teams build AI-powered automations visually across web data, documents, spreadsheets, SaaS apps, and custom workflows. It is useful for operations teams that need flexible AI workflow automation."
  },
  {
    "slug": "consensus",
    "category_slug": "research-search",
    "pricing_model": "freemium",
    "pricing_details": "Free research queries are limited; paid Premium and organization plans add more AI-powered searches and research features.",
    "tagline": "AI research search engine for evidence-backed answers from scientific papers.",
    "description": "Consensus searches scientific literature and summarizes evidence around research questions, helping users see what peer-reviewed studies suggest. It belongs in Research & Search rather than general healthcare."
  },
  {
    "slug": "semantic-scholar",
    "category_slug": "research-search",
    "pricing_model": "free",
    "pricing_details": "Free academic search and API access are available subject to rate limits and terms.",
    "tagline": "Free AI-powered academic search engine and research graph from Semantic Scholar.",
    "description": "Semantic Scholar is a free academic search engine and research graph for finding papers, authors, citations, related work, and scholarly context. It belongs in Research & Search."
  },
  {
    "slug": "elicit",
    "pricing_model": "freemium",
    "pricing_details": "Free credits are limited; paid Plus, Pro, Scale, and organization options add more paper search, extraction, and review capacity.",
    "tagline": "AI research assistant for literature search, paper screening, extraction, and synthesis.",
    "description": "Elicit helps researchers search academic papers, screen studies, extract structured data, summarize evidence, and build literature reviews. It is useful for systematic research workflows and early-stage evidence synthesis."
  },
  {
    "slug": "tavily",
    "category_slug": "llm-providers",
    "pricing_model": "freemium",
    "pricing_details": "Free monthly credits are limited; paid developer and enterprise plans add higher search/extract/crawl usage.",
    "tagline": "Search, extract, and crawl API built for LLMs and AI agents.",
    "description": "Tavily provides web search, extraction, and crawling APIs designed for LLM and agent applications. It is more of an AI infrastructure/API tool than a consumer research search product."
  },
  {
    "slug": "you-com",
    "pricing_model": "freemium",
    "pricing_details": "Free search/chat is available; Pro, Max, Enterprise, and API options add higher model access, agents, and organization controls.",
    "tagline": "AI search and assistant platform with research, agents, and customizable workflows.",
    "description": "You.com combines AI search, chat, research, agents, and productivity workflows. It is useful for people who want a search-first AI assistant with model choice and productivity features."
  },
  {
    "slug": "brainly",
    "pricing_model": "freemium",
    "pricing_details": "Free homework help is available; paid subscriptions remove ads and add expanded AI/tutoring features.",
    "tagline": "Student learning platform with homework help, explanations, and AI study support.",
    "description": "Brainly provides student homework help, explanations, community answers, and AI-supported study assistance. It is useful for learners who need step-by-step support across school subjects."
  },
  {
    "slug": "quizlet",
    "name": "Quizlet",
    "pricing_model": "freemium",
    "pricing_details": "Free study tools are available; Quizlet Plus adds advanced practice, AI features, offline access, and fewer limits.",
    "tagline": "Study platform with flashcards, practice tests, explanations, and AI-powered learning tools.",
    "description": "Quizlet is a study platform for flashcards, practice tests, explanations, learning modes, and AI-powered study help. The older Q-Chat branding should no longer be treated as the primary product."
  },
  {
    "slug": "socratic",
    "pricing_model": "free",
    "pricing_details": "Free Google learning support; availability can vary by platform and region, with some functionality increasingly overlapping Google Lens and Gemini.",
    "tagline": "Google homework help and learning app for explanations across school subjects.",
    "description": "Socratic by Google is a free learning app and web experience for getting explanations and resources across math, science, literature, and other school subjects. Availability and app support should be treated as legacy compared with newer Google Lens and Gemini learning workflows."
  },
  {
    "slug": "alphafold",
    "pricing_model": "free",
    "pricing_details": "AlphaFold tools and databases are free for many research uses; AlphaFold Server and AlphaFold 3 access have specific terms, especially for commercial use.",
    "tagline": "DeepMind protein-structure prediction system and database for biology research.",
    "description": "AlphaFold is DeepMind's AI system and database for predicting protein structures and supporting molecular biology research. Its public database and server workflows are research-oriented and governed by specific access and use terms."
  },
  {
    "slug": "benchling",
    "pricing_model": "enterprise",
    "pricing_details": "Enterprise pricing is custom and depends on products, seats, regulated workflows, and deployment needs.",
    "tagline": "R&D cloud platform with AI capabilities for biotech, pharma, and scientific organizations.",
    "description": "Benchling is an enterprise R&D platform for biotech and pharma teams, covering lab notebooks, molecular biology, sample management, workflows, analytics, and AI-assisted research operations."
  },
  {
    "slug": "fonfik",
    "category_slug": "ai-agents",
    "pricing_model": "free",
    "pricing_details": "Public access is free while the platform evolves; agent participation and account features may change.",
    "tagline": "Where human and digital minds meet.",
    "description": "Fonfik is a social platform where humans and AI agents can participate in shared discussions and community-style interactions. It belongs in AI Agents rather than remaining uncategorized."
  },
  {
    "slug": "moltbook",
    "pricing_model": "free",
    "pricing_details": "Early-access platform; API keys and access flows changed after security resets and acquisition-related updates.",
    "tagline": "Social network and identity layer for AI agents.",
    "description": "Moltbook is a social network-style platform where AI agents can post, interact, and verify identity. The listing should be treated as early-access and security-sensitive rather than a mature mainstream automation product."
  }
]
$updates$::jsonb) AS u(
    slug text,
    status text,
    name text,
    tagline text,
    description text,
    website_url text,
    category_slug text,
    pricing_model text,
    pricing_details text,
    company_name text,
    founded_year integer
  )
)
UPDATE public.tools AS t
SET
  status = CASE WHEN u.status IS NOT NULL THEN u.status::tool_status ELSE t.status END,
  name = COALESCE(u.name, t.name),
  tagline = COALESCE(u.tagline, t.tagline),
  description = COALESCE(u.description, t.description),
  website_url = COALESCE(u.website_url, t.website_url),
  category_id = CASE
    WHEN u.category_slug IS NOT NULL THEN COALESCE(
      (SELECT c.id FROM public.categories AS c WHERE c.slug = u.category_slug),
      t.category_id
    )
    ELSE t.category_id
  END,
  pricing_model = CASE
    WHEN u.pricing_model IS NOT NULL THEN u.pricing_model::pricing_model
    ELSE t.pricing_model
  END,
  pricing_details = COALESCE(u.pricing_details, t.pricing_details),
  company_name = COALESCE(u.company_name, t.company_name),
  founded_year = COALESCE(u.founded_year, t.founded_year),
  meta_title = CASE
    WHEN u.name IS NOT NULL THEN u.name || ' Review, Pricing, Alternatives | AiCensus'
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
