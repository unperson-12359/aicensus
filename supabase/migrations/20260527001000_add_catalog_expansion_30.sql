-- Add 30 catalog expansion tools (Q2 2026)
-- Includes Venice AI, coding agents, automation infra, creative tools, and vertical picks

BEGIN;

WITH new_tools AS (
  SELECT *
  FROM jsonb_to_recordset($tools$[
  {
    "slug": "venice-ai",
    "name": "Venice AI",
    "tagline": "Private, uncensored AI chat with local encryption and optional API access",
    "description": "Venice AI is a privacy-first AI assistant that runs inference without storing prompts on company servers. It offers uncensored chat, image generation, and document analysis with optional Diem token payments or a Pro subscription. An OpenAI-compatible API is available for developers who want private inference without traditional cloud logging.",
    "website_url": "https://venice.ai",
    "category_slug": "chatbots-assistants",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with daily limits; Venice Pro about $18/month; API pay-as-you-go with Diem credits",
    "editor_rating": 4.2,
    "company_name": "Venice.ai",
    "founded_year": 2024,
    "key_features": [
      "Private inference with no prompt storage",
      "Uncensored chat and image generation",
      "OpenAI-compatible API",
      "Local encryption options",
      "Diem token payment support"
    ],
    "pros": [
      "Strong privacy positioning vs mainstream chatbots",
      "Uncensored responses for creative and research use",
      "API access for private app integrations"
    ],
    "cons": [
      "Smaller model selection than ChatGPT or Claude",
      "Token-based API pricing can be opaque",
      "Niche brand awareness outside privacy communities"
    ],
    "use_cases": [
      "Private AI chat without cloud logging",
      "Uncensored creative writing",
      "Privacy-conscious API integrations"
    ],
    "who_its_for": [
      "Privacy-focused users",
      "Developers needing private inference APIs",
      "Writers wanting fewer content filters"
    ]
  },
  {
    "slug": "factory",
    "name": "Factory",
    "tagline": "Enterprise AI software engineers that ship code autonomously",
    "description": "Factory builds autonomous coding agents called Droids that integrate with GitHub, Jira, and Slack to implement features, fix bugs, and open pull requests. Enterprise teams use Factory to augment engineering velocity while keeping work inside existing SDLC workflows and security boundaries.",
    "website_url": "https://factory.ai",
    "category_slug": "coding-development",
    "pricing_model": "enterprise",
    "pricing_details": "Enterprise pricing; contact sales for team deployment",
    "editor_rating": 4.3,
    "company_name": "Factory AI",
    "founded_year": 2023,
    "key_features": [
      "Autonomous Droid agents for coding tasks",
      "GitHub and Jira integration",
      "Pull request generation and review",
      "Enterprise security controls",
      "Multi-repo orchestration"
    ],
    "pros": [
      "Purpose-built for enterprise SDLC integration",
      "Strong focus on production code quality",
      "Works alongside existing developer tools"
    ],
    "cons": [
      "Enterprise-only pricing with no self-serve tier",
      "Requires mature Git and CI workflows",
      "Less suited for solo hobby projects"
    ],
    "use_cases": [
      "Automating bug fixes from tickets",
      "Feature implementation from specs",
      "Large-scale codebase maintenance"
    ],
    "who_its_for": [
      "Enterprise engineering teams",
      "Platform teams scaling AI-assisted development",
      "CTOs evaluating agentic coding at scale"
    ]
  },
  {
    "slug": "roo-code",
    "name": "Roo Code",
    "tagline": "Open-source VS Code agent for autonomous coding in your editor",
    "description": "Roo Code is an open-source AI coding agent extension for VS Code forked from the Cline lineage. It reads your codebase, edits files, runs terminal commands, and supports multiple LLM providers. Developers who want a transparent, self-hosted agent workflow in VS Code use Roo Code as an alternative to closed commercial coding assistants.",
    "website_url": "https://roocode.com",
    "category_slug": "coding-development",
    "pricing_model": "open_source",
    "pricing_details": "Free open-source extension; pay for your own LLM API keys (OpenAI, Anthropic, etc.)",
    "editor_rating": 4.4,
    "company_name": "Roo Code",
    "founded_year": 2024,
    "key_features": [
      "VS Code extension with full codebase access",
      "Multi-provider LLM support",
      "Terminal command execution",
      "Diff-based file editing",
      "MCP server integration"
    ],
    "pros": [
      "Fully open source and auditable",
      "Bring your own API keys and models",
      "Active community fork of Cline"
    ],
    "cons": [
      "Requires managing your own API costs",
      "VS Code only — no JetBrains support",
      "Setup complexity for non-technical users"
    ],
    "use_cases": [
      "Autonomous feature implementation in VS Code",
      "Refactoring large codebases with agent assistance",
      "Self-hosted coding agent workflows"
    ],
    "who_its_for": [
      "Developers preferring open-source tooling",
      "Teams with BYOK LLM policies",
      "Cline users exploring maintained forks"
    ]
  },
  {
    "slug": "graphite",
    "name": "Graphite",
    "tagline": "Stacked pull requests and AI-powered code review for faster shipping",
    "description": "Graphite is a code review platform built around stacked diffs — breaking large changes into small, reviewable PRs. Its AI reviewer Diamond catches bugs and suggests improvements inline. Engineering teams at fast-moving startups use Graphite to reduce review bottlenecks and ship smaller changes more frequently.",
    "website_url": "https://graphite.dev",
    "category_slug": "coding-development",
    "pricing_model": "freemium",
    "pricing_details": "Free for individuals; Team plans from about $25/user/month; Enterprise custom",
    "editor_rating": 4.5,
    "company_name": "Graphite",
    "founded_year": 2020,
    "key_features": [
      "Stacked PR workflow (gt CLI)",
      "AI reviewer Diamond",
      "GitHub integration",
      "Merge queue automation",
      "PR inbox and notifications"
    ],
    "pros": [
      "Best-in-class stacked diff workflow",
      "AI review catches real bugs pre-merge",
      "Significantly speeds up review cycles"
    ],
    "cons": [
      "Learning curve for stacked PR paradigm",
      "Primarily GitHub-focused",
      "AI reviewer requires paid tier"
    ],
    "use_cases": [
      "Breaking large features into reviewable stacks",
      "AI-assisted pre-merge code review",
      "Accelerating startup engineering velocity"
    ],
    "who_its_for": [
      "Engineering teams on GitHub",
      "Startups shipping multiple PRs daily",
      "Developers frustrated with large PR review delays"
    ]
  },
  {
    "slug": "greptile",
    "name": "Greptile",
    "tagline": "AI that indexes your entire codebase for review and Q&A",
    "description": "Greptile builds a semantic index of your GitHub repositories and uses it to power AI code review, natural language codebase Q&A, and onboarding assistance. It understands cross-file dependencies and architectural patterns, making it useful for teams with large or legacy codebases where context retrieval is the bottleneck.",
    "website_url": "https://greptile.com",
    "category_slug": "coding-development",
    "pricing_model": "freemium",
    "pricing_details": "Free tier for small repos; Pro from about $20/user/month; Enterprise custom",
    "editor_rating": 4.3,
    "company_name": "Greptile",
    "founded_year": 2023,
    "key_features": [
      "Full-repo semantic indexing",
      "AI pull request review",
      "Natural language codebase Q&A",
      "GitHub App integration",
      "Cross-file dependency awareness"
    ],
    "pros": [
      "Deep whole-repo context vs single-file tools",
      "Useful for onboarding to unfamiliar codebases",
      "Integrates directly into PR workflow"
    ],
    "cons": [
      "Indexing large monorepos can be slow initially",
      "GitHub-centric integration",
      "Review quality varies by language"
    ],
    "use_cases": [
      "AI code review on every pull request",
      "Onboarding engineers to legacy repos",
      "Architecture questions across large codebases"
    ],
    "who_its_for": [
      "Engineering teams with large codebases",
      "Tech leads doing architecture reviews",
      "New hires ramping on complex repos"
    ]
  },
  {
    "slug": "warp",
    "name": "Warp",
    "tagline": "AI-native terminal with blocks, workflows, and agent mode",
    "description": "Warp is a modern terminal rebuilt for productivity with command blocks, AI command suggestions, and Agent Mode that executes multi-step shell workflows from natural language. Available on macOS and Linux, it targets developers who live in the terminal and want AI assistance without leaving their shell environment.",
    "website_url": "https://warp.dev",
    "category_slug": "coding-development",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with AI limits; Warp Pro about $15/month; Team plans available",
    "editor_rating": 4.4,
    "company_name": "Warp",
    "founded_year": 2020,
    "key_features": [
      "Block-based command output",
      "AI command search and generation",
      "Agent Mode for multi-step workflows",
      "Workflows and notebooks",
      "Team sharing and collaboration"
    ],
    "pros": [
      "Genuinely reimagines terminal UX",
      "Agent Mode handles complex shell tasks well",
      "Fast and polished native app"
    ],
    "cons": [
      "Not available on Windows natively",
      "AI features require subscription",
      "Different paradigm from traditional terminals"
    ],
    "use_cases": [
      "AI-assisted shell scripting and debugging",
      "Shared team terminal workflows",
      "DevOps command automation"
    ],
    "who_its_for": [
      "macOS and Linux developers",
      "DevOps and SRE engineers",
      "Teams wanting collaborative terminal sessions"
    ]
  },
  {
    "slug": "e2b",
    "name": "E2B",
    "tagline": "Secure cloud sandboxes for AI agents to run code safely",
    "description": "E2B provides Firecracker microVM sandboxes that AI agents use to execute arbitrary code safely in the cloud. Developers integrate E2B via SDK to give coding agents, data analysis bots, and autonomous workflows an isolated runtime. Used by AI agent frameworks as the standard execution layer for untrusted code.",
    "website_url": "https://e2b.dev",
    "category_slug": "ai-agents",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with sandbox hours; Pro from about $100/month; usage-based overage",
    "editor_rating": 4.5,
    "company_name": "E2B",
    "founded_year": 2023,
    "key_features": [
      "Firecracker microVM isolation",
      "Python and JavaScript SDKs",
      "Custom environment templates",
      "Sub-second sandbox startup",
      "Persistent filesystem support"
    ],
    "pros": [
      "Industry-standard agent sandbox infrastructure",
      "Fast cold starts vs traditional VMs",
      "Well-documented SDK with agent framework integrations"
    ],
    "cons": [
      "Usage-based pricing scales with agent activity",
      "Requires cloud connectivity",
      "Not a end-user product — developer infrastructure"
    ],
    "use_cases": [
      "Safe code execution for AI coding agents",
      "Data analysis sandboxes for LLM workflows",
      "Autonomous agent runtime environments"
    ],
    "who_its_for": [
      "AI agent developers",
      "Framework builders (LangChain, CrewAI, etc.)",
      "Teams building production agent systems"
    ]
  },
  {
    "slug": "browserbase",
    "name": "Browserbase",
    "tagline": "Headless browser infrastructure for AI web agents",
    "description": "Browserbase provides managed headless browser sessions optimized for AI agents that need to navigate websites, fill forms, and extract data. It handles CAPTCHAs, proxies, and session persistence so developers can focus on agent logic rather than browser automation plumbing.",
    "website_url": "https://browserbase.com",
    "category_slug": "agents-automation",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with session limits; Developer from about $99/month; Enterprise custom",
    "editor_rating": 4.4,
    "company_name": "Browserbase",
    "founded_year": 2024,
    "key_features": [
      "Managed headless Chrome sessions",
      "CAPTCHA and bot detection handling",
      "Session recording and replay",
      "Playwright and Puppeteer compatible",
      "Proxy and fingerprint rotation"
    ],
    "pros": [
      "Purpose-built for AI agent web browsing",
      "Handles anti-bot measures out of the box",
      "Simple API vs self-hosting Playwright farms"
    ],
    "cons": [
      "Pricing adds up with high session volume",
      "Dependent on target site stability",
      "Requires developer integration — not no-code"
    ],
    "use_cases": [
      "Web scraping agents for LLM workflows",
      "Automated form filling and data entry",
      "Competitive intelligence gathering bots"
    ],
    "who_its_for": [
      "AI agent developers needing web access",
      "Automation engineers building web bots",
      "Startups building AI research assistants"
    ]
  },
  {
    "slug": "pipedream",
    "name": "Pipedream",
    "tagline": "Developer-first workflow automation with 3,000+ integrations",
    "description": "Pipedream is a low-code automation platform where developers write JavaScript or Python steps connected to thousands of APIs. AI features help generate workflow code, and the platform supports triggers, scheduled jobs, and event-driven pipelines. Popular for connecting LLM APIs to business tools without managing infrastructure.",
    "website_url": "https://pipedream.com",
    "category_slug": "agents-automation",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with daily credits; Advanced from about $29/month; Business custom",
    "editor_rating": 4.3,
    "company_name": "Pipedream",
    "founded_year": 2019,
    "key_features": [
      "3,000+ app integrations",
      "JavaScript and Python code steps",
      "AI-assisted workflow generation",
      "Event triggers and cron schedules",
      "Managed serverless execution"
    ],
    "pros": [
      "Developer-friendly vs Zapier no-code approach",
      "Generous free tier for prototyping",
      "Excellent for LLM API orchestration"
    ],
    "cons": [
      "Code-first — not ideal for non-developers",
      "Complex workflows can hit execution limits",
      "UI less polished than Make or Zapier"
    ],
    "use_cases": [
      "LLM API pipelines connecting to Slack, email, CRM",
      "Scheduled data sync between SaaS tools",
      "Event-driven automation for startups"
    ],
    "who_its_for": [
      "Developers building automation workflows",
      "Startups connecting AI APIs to business tools",
      "Teams outgrowing Zapier's no-code limits"
    ]
  },
  {
    "slug": "litellm",
    "name": "LiteLLM",
    "tagline": "Open-source LLM gateway for routing, logging, and cost control",
    "description": "LiteLLM is an open-source proxy that provides a unified OpenAI-compatible API across 100+ LLM providers. Teams self-host it to manage API keys, track spend, set rate limits, and failover between models. It is widely used as the infrastructure layer behind production AI applications that need provider flexibility.",
    "website_url": "https://litellm.ai",
    "category_slug": "models-infrastructure",
    "pricing_model": "open_source",
    "pricing_details": "Free open-source self-hosted; LiteLLM Cloud managed proxy with usage-based pricing",
    "editor_rating": 4.5,
    "company_name": "BerriAI",
    "founded_year": 2023,
    "key_features": [
      "Unified API for 100+ LLM providers",
      "Cost tracking and budget limits",
      "Automatic failover and load balancing",
      "OpenAI-compatible endpoint",
      "Logging and observability dashboard"
    ],
    "pros": [
      "Eliminates vendor lock-in for LLM APIs",
      "Production-grade logging and cost controls",
      "Active open-source community"
    ],
    "cons": [
      "Self-hosting requires DevOps expertise",
      "Adds latency vs direct provider calls",
      "Configuration complexity for advanced routing"
    ],
    "use_cases": [
      "Multi-provider LLM routing in production apps",
      "Cost tracking across team API usage",
      "Failover between OpenAI, Anthropic, and open models"
    ],
    "who_its_for": [
      "Platform engineers managing LLM infrastructure",
      "Teams needing provider-agnostic API layer",
      "Startups controlling AI API spend"
    ]
  },
  {
    "slug": "pulse-mcp",
    "name": "PulseMCP",
    "tagline": "Curated directory and discovery hub for MCP servers",
    "description": "PulseMCP is the leading directory for Model Context Protocol servers, helping developers discover, compare, and integrate MCP tools into Claude, Cursor, and other MCP-compatible clients. It tracks server quality, documentation, and community ratings as the MCP ecosystem grows rapidly.",
    "website_url": "https://www.pulsemcp.com",
    "category_slug": "mcp-skills-platforms",
    "pricing_model": "free",
    "pricing_details": "Free directory and discovery platform",
    "editor_rating": 4.2,
    "company_name": "PulseMCP",
    "founded_year": 2024,
    "key_features": [
      "MCP server directory with search",
      "Server quality ratings and reviews",
      "Integration guides per client",
      "New server submission workflow",
      "Category and tag filtering"
    ],
    "pros": [
      "Essential discovery layer for growing MCP ecosystem",
      "Saves time finding quality MCP servers",
      "Community-driven quality signals"
    ],
    "cons": [
      "Directory only — not a MCP server itself",
      "Quality varies across listed servers",
      "Ecosystem still maturing rapidly"
    ],
    "use_cases": [
      "Finding MCP servers for specific workflows",
      "Evaluating MCP server quality before integration",
      "Staying current on new MCP releases"
    ],
    "who_its_for": [
      "Developers building MCP-powered workflows",
      "Cursor and Claude Desktop power users",
      "Teams standardizing on MCP integrations"
    ]
  },
  {
    "slug": "reve",
    "name": "Reve",
    "tagline": "AI image generation with exceptional typography and text rendering",
    "description": "Reve Image is an AI image generator that excels at rendering readable text, logos, and typography within generated images — a longstanding weakness of diffusion models. Designers and marketers use Reve for social graphics, posters, and branded visuals where text accuracy matters as much as visual quality.",
    "website_url": "https://app.reve.com",
    "category_slug": "image-generation",
    "pricing_model": "freemium",
    "pricing_details": "Free credits on signup; paid credit packs and subscription plans",
    "editor_rating": 4.3,
    "company_name": "Reve",
    "founded_year": 2024,
    "key_features": [
      "Strong in-image typography rendering",
      "High-quality photorealistic generation",
      "Style and brand consistency controls",
      "Fast generation times",
      "Commercial usage rights on paid plans"
    ],
    "pros": [
      "Best-in-class text rendering in AI images",
      "Useful for marketing and social content",
      "Competitive quality vs Midjourney for branded work"
    ],
    "cons": [
      "Smaller community than Midjourney or DALL-E",
      "Credit system can be confusing",
      "Less control over fine-grained composition"
    ],
    "use_cases": [
      "Social media graphics with readable text",
      "Marketing posters and ad creatives",
      "Logo and brand asset exploration"
    ],
    "who_its_for": [
      "Marketing designers",
      "Social media managers",
      "Small business owners creating branded visuals"
    ]
  },
  {
    "slug": "comfyui",
    "name": "ComfyUI",
    "tagline": "Node-based open-source interface for Stable Diffusion workflows",
    "description": "ComfyUI is a powerful node-based GUI for building complex Stable Diffusion and Flux image generation pipelines. Power users chain models, LoRAs, ControlNets, and upscalers visually without writing code. It is the standard tool for advanced AI image generation workflows in the open-source community.",
    "website_url": "https://comfy.org",
    "category_slug": "image-generation",
    "pricing_model": "open_source",
    "pricing_details": "Free open-source; self-hosted; pay for GPU compute or cloud hosting",
    "editor_rating": 4.6,
    "company_name": "Comfy Org",
    "founded_year": 2023,
    "key_features": [
      "Visual node-based workflow editor",
      "Support for SD, Flux, and custom models",
      "ControlNet and LoRA integration",
      "Workflow save, share, and remix",
      "API mode for programmatic generation"
    ],
    "pros": [
      "Most flexible open-source image gen workflow tool",
      "Huge community workflow library",
      "No vendor lock-in — runs locally or on any GPU"
    ],
    "cons": [
      "Steep learning curve for beginners",
      "Requires GPU hardware or cloud setup",
      "UI can feel overwhelming initially"
    ],
    "use_cases": [
      "Custom Stable Diffusion pipeline building",
      "Batch image generation with complex pipelines",
      "Research and experimentation with new models"
    ],
    "who_its_for": [
      "Advanced AI art practitioners",
      "Researchers experimenting with diffusion models",
      "Studios needing reproducible generation pipelines"
    ]
  },
  {
    "slug": "pixverse",
    "name": "PixVerse",
    "tagline": "High-quality AI text-to-video generation platform",
    "description": "PixVerse is an AI video generation platform that produces cinematic text-to-video clips with strong motion coherence and visual quality. It offers style presets, camera motion controls, and character consistency features. Content creators and marketers use PixVerse for short-form video content without traditional production costs.",
    "website_url": "https://pixverse.ai",
    "category_slug": "video-audio",
    "pricing_model": "freemium",
    "pricing_details": "Free daily credits; Standard about $10/month; Pro about $30/month",
    "editor_rating": 4.2,
    "company_name": "PixVerse",
    "founded_year": 2023,
    "key_features": [
      "Text-to-video generation",
      "Camera motion and style controls",
      "Character consistency across clips",
      "HD and 4K output options",
      "Template library for quick starts"
    ],
    "pros": [
      "Strong motion quality vs early video gen tools",
      "Affordable pricing for creators",
      "Good character consistency features"
    ],
    "cons": [
      "Shorter clip lengths than traditional video",
      "Quality inconsistent on complex scenes",
      "Competition from Kling, Runway, and Sora"
    ],
    "use_cases": [
      "Social media short-form video content",
      "Marketing video prototypes",
      "Concept visualization for filmmakers"
    ],
    "who_its_for": [
      "Content creators and influencers",
      "Marketing teams on tight budgets",
      "Indie filmmakers exploring AI video"
    ]
  },
  {
    "slug": "ltx-studio",
    "name": "LTX Studio",
    "tagline": "AI filmmaking studio for scripted video production",
    "description": "LTX Studio by Lightricks is an AI-powered filmmaking platform that turns scripts into storyboards, scenes, and edited video sequences. It combines generative video, character consistency, and timeline editing in one studio workflow. Filmmakers and creative agencies use it to pre-visualize and produce narrative content faster.",
    "website_url": "https://ltx.studio",
    "category_slug": "video-audio",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with watermarks; Lite about $15/month; Pro about $35/month",
    "editor_rating": 4.3,
    "company_name": "Lightricks",
    "founded_year": 2024,
    "key_features": [
      "Script-to-storyboard generation",
      "Character and scene consistency",
      "Timeline video editing",
      "Multiple shot types and camera angles",
      "Export to standard video formats"
    ],
    "pros": [
      "End-to-end filmmaking workflow vs single clip generators",
      "Strong character consistency across scenes",
      "Backed by established Lightricks team"
    ],
    "cons": [
      "Still early — output quality varies",
      "Not a replacement for professional production",
      "Learning curve for non-filmmakers"
    ],
    "use_cases": [
      "Pre-visualization for film and TV pitches",
      "Storyboard generation from scripts",
      "Indie narrative content production"
    ],
    "who_its_for": [
      "Filmmakers and directors",
      "Creative agencies producing video concepts",
      "Content studios exploring AI-native production"
    ]
  },
  {
    "slug": "moises",
    "name": "Moises",
    "tagline": "AI stem separation and music production studio",
    "description": "Moises is an AI-powered music app that separates audio into stems (vocals, drums, bass, etc.), adjusts tempo and pitch, and provides a browser-based DAW for practice and production. Used by 70M+ musicians for learning songs, creating karaoke tracks, and remixing. The AI Studio tier adds advanced generation features.",
    "website_url": "https://moises.ai",
    "category_slug": "music-audio",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with limits; Premium about $4/month; Pro about $10/month",
    "editor_rating": 4.5,
    "company_name": "Moises Systems",
    "founded_year": 2019,
    "key_features": [
      "AI stem separation (vocals, drums, bass, etc.)",
      "Tempo and pitch adjustment",
      "Browser-based DAW",
      "Chord detection and lyrics sync",
      "AI voice and instrument generation (Studio tier)"
    ],
    "pros": [
      "Best-in-class stem separation quality",
      "Accessible to musicians at all skill levels",
      "Generous free tier for practice use"
    ],
    "cons": [
      "Advanced AI generation requires paid tier",
      "Stem quality degrades on complex mixes",
      "Mobile app more polished than web DAW"
    ],
    "use_cases": [
      "Learning songs by isolating instrument tracks",
      "Creating karaoke and practice backing tracks",
      "Remixing and mashup creation"
    ],
    "who_its_for": [
      "Musicians and music students",
      "DJs and remix artists",
      "Music teachers creating practice materials"
    ]
  },
  {
    "slug": "soundraw",
    "name": "SOUNDRAW",
    "tagline": "AI-generated royalty-free music for creators and businesses",
    "description": "SOUNDRAW generates original, royalty-free background music tailored to mood, genre, and length using AI. Creators customize tracks by adjusting instruments, tempo, and energy without music production skills. Widely used by YouTubers, podcasters, and businesses needing affordable, copyright-safe music.",
    "website_url": "https://soundraw.io",
    "category_slug": "music-audio",
    "pricing_model": "freemium",
    "pricing_details": "Free preview and limited downloads; Creator about $17/month; Artist Pro about $37/month",
    "editor_rating": 4.2,
    "company_name": "SOUNDRAW",
    "founded_year": 2020,
    "key_features": [
      "AI music generation by mood and genre",
      "Instrument and energy customization",
      "Royalty-free commercial licensing",
      "Length adjustment without quality loss",
      "API for app integrations"
    ],
    "pros": [
      "Truly royalty-free — no copyright claims",
      "Fast customization without music theory knowledge",
      "Affordable vs stock music libraries"
    ],
    "cons": [
      "Generated tracks can sound generic",
      "Less unique than hiring a composer",
      "Limited genre depth vs professional libraries"
    ],
    "use_cases": [
      "YouTube and podcast background music",
      "Corporate video soundtracks",
      "App and game background music via API"
    ],
    "who_its_for": [
      "YouTubers and content creators",
      "Small businesses needing affordable music",
      "App developers integrating music generation"
    ]
  },
  {
    "slug": "relume",
    "name": "Relume",
    "tagline": "AI sitemap and wireframe generator for Webflow and Figma",
    "description": "Relume uses AI to generate sitemaps, wireframes, and style guides from a text brief, then exports directly to Webflow and Figma. Web designers and agencies use it to accelerate the discovery and wireframing phase of client projects, turning hours of planning into minutes of AI-assisted generation.",
    "website_url": "https://relume.io",
    "category_slug": "design-creative",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with project limits; Starter about $32/month; Pro about $48/month",
    "editor_rating": 4.4,
    "company_name": "Relume",
    "founded_year": 2022,
    "key_features": [
      "AI sitemap generation from briefs",
      "Wireframe export to Figma and Webflow",
      "Component library with 1,000+ elements",
      "Style guide generation",
      "Copywriting assistance for page content"
    ],
    "pros": [
      "Dramatically speeds up project discovery phase",
      "Direct Webflow export saves rebuild time",
      "Large component library for consistent designs"
    ],
    "cons": [
      "Output requires designer refinement",
      "Best suited for marketing sites, not complex apps",
      "Webflow-centric — less value without Webflow"
    ],
    "use_cases": [
      "Rapid client sitemap and wireframe proposals",
      "Webflow site scaffolding from AI briefs",
      "Agency pitch deck visual generation"
    ],
    "who_its_for": [
      "Web designers and agencies",
      "Webflow developers",
      "Freelancers accelerating project scoping"
    ]
  },
  {
    "slug": "lex",
    "name": "Lex",
    "tagline": "AI-native word processor for writers and teams",
    "description": "Lex is a modern writing app built from the ground up with AI assistance — not bolted onto a traditional editor. It offers inline AI completions, tone adjustments, feedback requests, and collaborative editing. Writers who find Google Docs too basic and Notion too unstructured use Lex as their primary long-form writing environment.",
    "website_url": "https://lex.page",
    "category_slug": "writing-content",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with AI limits; Pro about $12/month; Team plans available",
    "editor_rating": 4.3,
    "company_name": "Every",
    "founded_year": 2023,
    "key_features": [
      "AI-native inline writing assistance",
      "Tone and style adjustment",
      "Feedback and comment requests",
      "Distraction-free writing interface",
      "Team collaboration and sharing"
    ],
    "pros": [
      "Purpose-built for AI-assisted writing vs add-on approach",
      "Clean, focused interface for long-form content",
      "Strong community of professional writers"
    ],
    "cons": [
      "Smaller feature set than Notion or Google Docs",
      "AI limits on free tier are restrictive",
      "No offline mode"
    ],
    "use_cases": [
      "Long-form article and essay writing",
      "Newsletter and blog draft creation",
      "Collaborative writing with AI feedback"
    ],
    "who_its_for": [
      "Professional writers and journalists",
      "Newsletter authors",
      "Content teams wanting AI-native workflows"
    ]
  },
  {
    "slug": "krisp",
    "name": "Krisp",
    "tagline": "AI noise cancellation and meeting notes on any call app",
    "description": "Krisp removes background noise from calls in real time using on-device AI processing — working with Zoom, Teams, Meet, and any other app. Its AI Meeting Assistant transcribes calls, generates summaries, and extracts action items. Used by remote teams and call center agents for clearer communication and automatic meeting documentation.",
    "website_url": "https://krisp.ai",
    "category_slug": "productivity",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with 60 min/day noise cancellation; Pro about $8/month; Business about $12/user/month",
    "editor_rating": 4.5,
    "company_name": "Krisp",
    "founded_year": 2017,
    "key_features": [
      "Real-time AI noise cancellation",
      "Works with any call app (Zoom, Teams, etc.)",
      "AI meeting transcription and summaries",
      "Action item extraction",
      "On-device processing for privacy"
    ],
    "pros": [
      "Best-in-class noise cancellation",
      "App-agnostic — works everywhere",
      "On-device processing protects call privacy"
    ],
    "cons": [
      "Meeting notes feature requires paid tier",
      "Mac and Windows only — no mobile app",
      "Transcription accuracy varies by accent"
    ],
    "use_cases": [
      "Clear remote calls in noisy environments",
      "Automatic meeting transcription and summaries",
      "Call center agent noise suppression"
    ],
    "who_its_for": [
      "Remote workers and freelancers",
      "Call center and support teams",
      "Managers wanting automatic meeting notes"
    ]
  },
  {
    "slug": "exa",
    "name": "Exa",
    "tagline": "Neural search API built for AI agents and RAG pipelines",
    "description": "Exa (formerly Metaphor) provides a search API optimized for LLM retrieval — returning clean, structured web content rather than SEO-optimized snippets. AI agent developers and RAG pipeline builders use Exa to give their systems real-time, high-quality web knowledge with semantic search capabilities.",
    "website_url": "https://exa.ai",
    "category_slug": "research-search",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with 1,000 searches/month; Pro from about $25/month; Enterprise custom",
    "editor_rating": 4.4,
    "company_name": "Exa",
    "founded_year": 2021,
    "key_features": [
      "Neural semantic search API",
      "Clean content extraction for RAG",
      "Real-time web indexing",
      "Similar page discovery",
      "Structured JSON output for agents"
    ],
    "pros": [
      "Purpose-built for LLM retrieval vs traditional search APIs",
      "High-quality content extraction",
      "Strong semantic search accuracy"
    ],
    "cons": [
      "Developer API only — no consumer search UI",
      "Pricing scales with search volume",
      "Smaller index than Google for obscure queries"
    ],
    "use_cases": [
      "RAG pipeline web retrieval",
      "AI agent real-time knowledge lookup",
      "Research automation for AI workflows"
    ],
    "who_its_for": [
      "AI agent developers",
      "RAG pipeline engineers",
      "Startups building AI research tools"
    ]
  },
  {
    "slug": "scispace",
    "name": "SciSpace",
    "tagline": "AI research workspace for reading and understanding scientific papers",
    "description": "SciSpace (formerly Typeset) is an AI-powered research platform for reading, understanding, and writing scientific papers. It explains complex passages, answers questions about PDFs, generates literature reviews, and helps with citation formatting. Used by 280M+ researchers worldwide as an AI copilot for academic work.",
    "website_url": "https://scispace.com",
    "category_slug": "research-search",
    "pricing_model": "freemium",
    "pricing_details": "Free tier with limits; Premium about $12/month; Teams custom",
    "editor_rating": 4.4,
    "company_name": "SciSpace",
    "founded_year": 2016,
    "key_features": [
      "AI paper explanation and Q&A",
      "Literature review generation",
      "Citation and reference management",
      "PDF annotation and highlighting",
      "Research paper discovery search"
    ],
    "pros": [
      "Excellent for understanding dense academic papers",
      "Literature review generation saves hours",
      "Large user base with active community"
    ],
    "cons": [
      "AI explanations can oversimplify nuance",
      "Premium required for heavy research use",
      "Not a replacement for reading primary sources"
    ],
    "use_cases": [
      "Understanding complex research papers quickly",
      "Generating literature review drafts",
      "Discovering related research papers"
    ],
    "who_its_for": [
      "Graduate students and PhD researchers",
      "Academic librarians and research assistants",
      "R&D teams surveying scientific literature"
    ]
  },
  {
    "slug": "dust",
    "name": "Dust",
    "tagline": "Build and deploy custom AI agents for your team's workflows",
    "description": "Dust is an enterprise platform for building, deploying, and managing custom AI agents connected to company data sources. Teams create agents for sales, support, engineering, and HR workflows without writing code. Dust handles data connectors, context retrieval, and agent orchestration for organizations adopting AI across departments.",
    "website_url": "https://dust.tt",
    "category_slug": "chatbots-assistants",
    "pricing_model": "freemium",
    "pricing_details": "Free tier for individuals; Pro about $29/user/month; Enterprise custom",
    "editor_rating": 4.3,
    "company_name": "Dust",
    "founded_year": 2023,
    "key_features": [
      "No-code custom agent builder",
      "Company data source connectors",
      "Multi-agent orchestration",
      "Slack and Notion integrations",
      "Usage analytics and governance"
    ],
    "pros": [
      "Enterprise-ready agent platform with governance",
      "Strong data connector ecosystem",
      "No-code builder accessible to non-engineers"
    ],
    "cons": [
      "Enterprise features require paid tiers",
      "Less flexible than custom-coded agents",
      "Smaller community than open-source alternatives"
    ],
    "use_cases": [
      "Internal knowledge base Q&A agents",
      "Sales and support workflow automation",
      "HR and onboarding assistant agents"
    ],
    "who_its_for": [
      "Enterprise teams deploying AI agents",
      "Operations leaders automating workflows",
      "Companies with structured internal data"
    ]
  },
  {
    "slug": "isomorphic-labs",
    "name": "Isomorphic Labs",
    "tagline": "DeepMind spinout using AI for drug discovery",
    "description": "Isomorphic Labs is an AI drug discovery company spun out of Google DeepMind, applying AlphaFold-class models to predict protein structures and design novel therapeutics. It partners with pharmaceutical companies including Eli Lilly and Novartis to accelerate the drug development pipeline using foundation models trained on biological data.",
    "website_url": "https://isomorphiclabs.com",
    "category_slug": "ai-science-healthcare",
    "pricing_model": "enterprise",
    "pricing_details": "Enterprise partnerships; not a consumer product",
    "editor_rating": 4.5,
    "company_name": "Isomorphic Labs",
    "founded_year": 2021,
    "key_features": [
      "AI protein structure prediction",
      "Drug candidate design and optimization",
      "Pharmaceutical company partnerships",
      "AlphaFold-derived foundation models",
      "Clinical pipeline acceleration"
    ],
    "pros": [
      "World-class AI research pedigree from DeepMind",
      "Major pharma partnerships validate approach",
      "Potential to dramatically reduce drug discovery timelines"
    ],
    "cons": [
      "Not accessible to individual researchers or startups",
      "Long timelines before clinical impact visible",
      "Highly specialized — not a general AI tool"
    ],
    "use_cases": [
      "Pharmaceutical drug candidate identification",
      "Protein structure prediction for research",
      "Accelerating preclinical drug development"
    ],
    "who_its_for": [
      "Pharmaceutical R&D teams",
      "Computational biology researchers",
      "Biotech investors evaluating AI drug discovery"
    ]
  },
  {
    "slug": "hex",
    "name": "Hex",
    "tagline": "AI-native collaborative data notebook for analytics teams",
    "description": "Hex is a collaborative data workspace combining SQL, Python, and no-code cells with AI assistance for exploration, visualization, and sharing. Analytics teams use Hex instead of Jupyter notebooks for production-quality data apps with built-in collaboration, versioning, and stakeholder sharing without engineering overhead.",
    "website_url": "https://hex.tech",
    "category_slug": "data-analytics",
    "pricing_model": "freemium",
    "pricing_details": "Free tier for individuals; Team from about $36/user/month; Enterprise custom",
    "editor_rating": 4.5,
    "company_name": "Hex Technologies",
    "founded_year": 2019,
    "key_features": [
      "SQL, Python, and no-code cell types",
      "AI-assisted query and chart generation",
      "Collaborative editing and commenting",
      "App publishing for stakeholders",
      "Data warehouse connectors (Snowflake, BigQuery, etc.)"
    ],
    "pros": [
      "Best collaborative notebook experience for data teams",
      "AI assistance speeds up exploration significantly",
      "Stakeholder-friendly app publishing"
    ],
    "cons": [
      "Team pricing adds up for large analytics orgs",
      "Less flexible than raw Jupyter for research",
      "Requires cloud connectivity"
    ],
    "use_cases": [
      "Exploratory data analysis with team collaboration",
      "Publishing data apps for business stakeholders",
      "Replacing static Jupyter notebooks in production"
    ],
    "who_its_for": [
      "Data analysts and analytics engineers",
      "BI teams wanting modern notebook workflows",
      "Startups building data culture without heavy infra"
    ]
  },
  {
    "slug": "deepinfra",
    "name": "DeepInfra",
    "tagline": "Low-cost API inference for open-source LLMs and embeddings",
    "description": "DeepInfra provides fast, affordable API access to open-source models including Llama, Mistral, Qwen, and embedding models. Developers choose DeepInfra for cost-sensitive production workloads where open model quality is sufficient. It offers competitive per-token pricing and low-latency inference without self-hosting GPU infrastructure.",
    "website_url": "https://deepinfra.com",
    "category_slug": "llm-providers",
    "pricing_model": "paid",
    "pricing_details": "Pay-as-you-go per token; no minimum; competitive open-model pricing",
    "editor_rating": 4.3,
    "company_name": "DeepInfra",
    "founded_year": 2022,
    "key_features": [
      "Open-source LLM API (Llama, Mistral, Qwen, etc.)",
      "Embedding model API",
      "Competitive per-token pricing",
      "Low-latency inference",
      "OpenAI-compatible API format"
    ],
    "pros": [
      "Among the cheapest open-model inference APIs",
      "Wide model selection updated frequently",
      "Simple pay-as-you-go with no commitments"
    ],
    "cons": [
      "Open models only — no GPT-4 or Claude access",
      "Less enterprise support than AWS or Azure",
      "Uptime SLA requires enterprise tier"
    ],
    "use_cases": [
      "Cost-sensitive LLM API integrations",
      "Embedding generation at scale",
      "Prototyping with open models before fine-tuning"
    ],
    "who_its_for": [
      "Developers building cost-conscious AI apps",
      "Startups avoiding proprietary model lock-in",
      "Teams running embedding pipelines at scale"
    ]
  },
  {
    "slug": "amazon-bedrock",
    "name": "Amazon Bedrock",
    "tagline": "AWS managed service for foundation models from multiple providers",
    "description": "Amazon Bedrock gives AWS customers access to foundation models from Anthropic, Meta, Mistral, Amazon, and others through a unified API with enterprise security, fine-tuning, and knowledge base integration. Enterprises already on AWS use Bedrock to deploy AI applications with VPC isolation, IAM controls, and existing cloud billing.",
    "website_url": "https://aws.amazon.com/bedrock",
    "category_slug": "llm-providers",
    "pricing_model": "paid",
    "pricing_details": "Pay-per-token per model; varies by provider; AWS billing integration",
    "editor_rating": 4.4,
    "company_name": "Amazon Web Services",
    "founded_year": 2023,
    "key_features": [
      "Multi-provider model access (Claude, Llama, Titan, etc.)",
      "Knowledge base RAG integration",
      "Model fine-tuning on proprietary data",
      "VPC and IAM enterprise security",
      "Agents and tool use orchestration"
    ],
    "pros": [
      "Native AWS integration for existing cloud customers",
      "Enterprise security and compliance certifications",
      "Multi-model access without separate vendor contracts"
    ],
    "cons": [
      "AWS complexity for non-cloud-native teams",
      "Pricing opaque without careful cost monitoring",
      "Model availability lags direct provider access"
    ],
    "use_cases": [
      "Enterprise AI apps on existing AWS infrastructure",
      "RAG knowledge bases with company documents",
      "Fine-tuning models on proprietary data"
    ],
    "who_its_for": [
      "AWS enterprise customers",
      "Cloud architects deploying AI at scale",
      "Teams requiring VPC-isolated model inference"
    ]
  },
  {
    "slug": "llamafile",
    "name": "Llamafile",
    "tagline": "Single-file portable local LLM — download and run anywhere",
    "description": "Llamafile packages open-weight LLMs into a single executable file that runs on macOS, Linux, and Windows without installation or GPU drivers. Created by Mozilla founder Brendan Eich's team at Justine Tunney, it democratizes local AI by removing the complexity of Python environments, CUDA setup, and model weight management.",
    "website_url": "https://llamafile.ai",
    "category_slug": "local-open-source",
    "pricing_model": "open_source",
    "pricing_details": "Free open-source; download and run locally with no API costs",
    "editor_rating": 4.4,
    "company_name": "Mozilla (Justine Tunney)",
    "founded_year": 2023,
    "key_features": [
      "Single executable file per model",
      "Cross-platform (macOS, Linux, Windows)",
      "No Python or CUDA installation required",
      "Built-in web UI and OpenAI-compatible API",
      "CPU and GPU inference support"
    ],
    "pros": [
      "Simplest possible local LLM setup",
      "Truly portable — copy file and run",
      "No cloud dependency or API costs"
    ],
    "cons": [
      "Limited to bundled open-weight models",
      "Performance depends heavily on local hardware",
      "Not suitable for production serving at scale"
    ],
    "use_cases": [
      "Running LLMs offline on any machine",
      "Privacy-sensitive local AI without cloud APIs",
      "Quick local model testing without environment setup"
    ],
    "who_its_for": [
      "Privacy-conscious individual users",
      "Developers wanting simple local LLM setup",
      "Air-gapped or offline environments"
    ]
  },
  {
    "slug": "brilliant",
    "name": "Brilliant",
    "tagline": "Interactive STEM learning with AI-powered tutoring",
    "description": "Brilliant teaches math, science, and computer science through interactive problem-solving rather than passive video lectures. Its AI tutor provides personalized hints and explanations adapted to each learner's pace. With courses in algebra, calculus, ML fundamentals, and programming, it serves students and professionals building quantitative skills.",
    "website_url": "https://brilliant.org",
    "category_slug": "ai-education",
    "pricing_model": "freemium",
    "pricing_details": "Free courses available; Premium about $15/month; annual discounts",
    "editor_rating": 4.5,
    "company_name": "Brilliant",
    "founded_year": 2012,
    "key_features": [
      "Interactive problem-solving courses",
      "AI tutor with personalized hints",
      "Math, science, CS, and ML curricula",
      "Mobile and web apps",
      "Progress tracking and streaks"
    ],
    "pros": [
      "Genuinely interactive vs passive video courses",
      "AI tutor adapts to individual learning pace",
      "Strong foundations for ML and data science paths"
    ],
    "cons": [
      "Premium required for full course access",
      "Less depth than university-level courses",
      "AI tutor still maturing vs human tutoring"
    ],
    "use_cases": [
      "Building math and CS foundations for AI careers",
      "Interactive ML and data science learning",
      "Supplementing formal education with practice"
    ],
    "who_its_for": [
      "Students learning STEM fundamentals",
      "Professionals upskilling in quantitative fields",
      "Parents seeking interactive education tools"
    ]
  },
  {
    "slug": "inworld-ai",
    "name": "Inworld AI",
    "tagline": "Runtime AI for intelligent NPCs and interactive characters in games",
    "description": "Inworld AI provides a runtime engine for creating intelligent, memory-persistent NPCs in video games and virtual worlds. Game developers configure character personalities, knowledge, and emotional responses that adapt to player behavior in real time. Used by studios including Xbox Game Studios and Ubisoft for next-generation interactive storytelling.",
    "website_url": "https://inworld.ai",
    "category_slug": "ai-3d-game-dev",
    "pricing_model": "freemium",
    "pricing_details": "Free developer tier; Studio from about $10/month; Enterprise custom for large studios",
    "editor_rating": 4.4,
    "company_name": "Inworld AI",
    "founded_year": 2021,
    "key_features": [
      "Real-time NPC personality and dialogue engine",
      "Persistent character memory across sessions",
      "Unity and Unreal Engine integration",
      "Emotional response and behavior modeling",
      "Voice and animation sync"
    ],
    "pros": [
      "Purpose-built for game NPCs vs generic chatbots",
      "Strong studio partnerships and game engine integrations",
      "Persistent memory creates genuinely dynamic characters"
    ],
    "cons": [
      "Requires game development expertise to integrate",
      "Runtime costs scale with concurrent players",
      "Output quality depends on character configuration"
    ],
    "use_cases": [
      "Dynamic NPC dialogue in RPGs and open-world games",
      "Interactive storytelling in virtual experiences",
      "Training simulations with adaptive AI characters"
    ],
    "who_its_for": [
      "Game developers and studios",
      "Interactive experience designers",
      "VR and metaverse platform builders"
    ]
  }
]$tools$::jsonb) AS t(
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
  meta_description
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
  left(t.description, 155)
FROM new_tools AS t
JOIN public.categories AS c ON c.slug = t.category_slug
ON CONFLICT (slug) DO UPDATE SET
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  website_url = excluded.website_url,
  category_id = excluded.category_id,
  pricing_model = excluded.pricing_model,
  pricing_details = excluded.pricing_details,
  editor_rating = excluded.editor_rating,
  is_verified = excluded.is_verified,
  is_featured = excluded.is_featured,
  status = excluded.status,
  published_at = COALESCE(public.tools.published_at, excluded.published_at),
  company_name = excluded.company_name,
  founded_year = excluded.founded_year,
  key_features = excluded.key_features,
  pros = excluded.pros,
  cons = excluded.cons,
  use_cases = excluded.use_cases,
  who_its_for = excluded.who_its_for,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  updated_at = now();

COMMIT;
