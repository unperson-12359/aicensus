-- ============================================================
-- AiCensus Batch 3: 6 New Categories + 100 New Tools
-- Run this in Supabase SQL Editor to expand the directory
-- ============================================================

-- ============================================================
-- STEP 1: Add 6 new categories
-- ============================================================

INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('LLM Providers & APIs', 'llm-providers', 'Foundation model companies and API platforms powering the AI ecosystem — from frontier models to inference endpoints.', 'cpu', 10),
  ('Local & Open Source AI', 'local-open-source', 'Run AI models locally on your hardware. Privacy-first, offline-capable, open-source tools for self-hosted inference.', 'hard-drive', 11),
  ('MCP & Skills Platforms', 'mcp-skills-platforms', 'Platforms that aggregate AI skills, tools, and integrations — orchestration layers, MCP servers, and agent marketplaces.', 'puzzle', 12),
  ('AI Education', 'ai-education', 'AI-powered learning tools, tutors, and educational platforms that personalize education at scale.', 'graduation-cap', 13),
  ('AI Science & Healthcare', 'ai-science-healthcare', 'AI tools advancing scientific research, drug discovery, medical diagnostics, and academic literature analysis.', 'flask-conical', 14),
  ('AI 3D & Game Dev', 'ai-3d-game-dev', 'AI tools for 3D model generation, game asset creation, and interactive content development.', 'box', 15);

-- ============================================================
-- STEP 2: Insert 100 new tools
-- ============================================================

DO $$
DECLARE
  cat_chatbots UUID;
  cat_research UUID;
  cat_coding UUID;
  cat_image UUID;
  cat_video UUID;
  cat_writing UUID;
  cat_design UUID;
  cat_productivity UUID;
  cat_agents UUID;
  cat_data UUID;
  cat_llm UUID;
  cat_local UUID;
  cat_mcp UUID;
  cat_education UUID;
  cat_science UUID;
  cat_3d UUID;
BEGIN
  SELECT id INTO cat_chatbots FROM categories WHERE slug = 'chatbots-assistants';
  SELECT id INTO cat_research FROM categories WHERE slug = 'research-search';
  SELECT id INTO cat_coding FROM categories WHERE slug = 'coding-development';
  SELECT id INTO cat_image FROM categories WHERE slug = 'image-generation';
  SELECT id INTO cat_video FROM categories WHERE slug = 'video-audio';
  SELECT id INTO cat_writing FROM categories WHERE slug = 'writing-content';
  SELECT id INTO cat_design FROM categories WHERE slug = 'design-creative';
  SELECT id INTO cat_productivity FROM categories WHERE slug = 'productivity';
  SELECT id INTO cat_agents FROM categories WHERE slug = 'ai-agents';
  SELECT id INTO cat_data FROM categories WHERE slug = 'data-analytics';
  SELECT id INTO cat_llm FROM categories WHERE slug = 'llm-providers';
  SELECT id INTO cat_local FROM categories WHERE slug = 'local-open-source';
  SELECT id INTO cat_mcp FROM categories WHERE slug = 'mcp-skills-platforms';
  SELECT id INTO cat_education FROM categories WHERE slug = 'ai-education';
  SELECT id INTO cat_science FROM categories WHERE slug = 'ai-science-healthcare';
  SELECT id INTO cat_3d FROM categories WHERE slug = 'ai-3d-game-dev';

  -- ========================================
  -- LLM PROVIDERS & APIs (10 tools)
  -- ========================================

  -- 1. OpenAI API
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'OpenAI API',
    'openai-api',
    'The most widely adopted AI API — powering GPT-4o, o1, DALL-E, and Whisper.',
    'The OpenAI API provides programmatic access to GPT-4o, o1/o3 reasoning models, DALL-E 3, Whisper, and TTS. It powers thousands of apps with text generation, vision, code, embeddings, and function calling. The de facto standard for building AI-powered applications.',
    'https://platform.openai.com',
    cat_llm,
    'paid',
    'Pay-per-token. GPT-4o: ~$2.50/1M input tokens. Volume discounts available.',
    4.7,
    true, true, 'published', now(),
    'OpenAI', 2020,
    ARRAY['GPT-4o, o1, o3 model family', 'Function calling and structured outputs', 'Vision, audio, and image generation APIs', 'Fine-tuning and embeddings', 'Batch API for cost savings'],
    ARRAY['Largest model ecosystem and community', 'Excellent documentation and SDKs', 'Reliable uptime and fast inference'],
    ARRAY['Can get expensive at scale', 'Rate limits on free tier', 'Closed-source models'],
    ARRAY['Building AI chatbots and assistants', 'Document processing pipelines', 'Code generation tools', 'Content creation at scale'],
    ARRAY['Software developers', 'AI startups', 'Enterprise teams', 'Product managers']
  );

  -- 2. Anthropic API
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Anthropic API',
    'anthropic-api',
    'Access Claude models via API — industry-leading for coding, analysis, and long-context tasks.',
    'The Anthropic API provides access to the Claude model family including Opus, Sonnet, and Haiku. Known for best-in-class coding performance, 200K context windows, and tool use capabilities. The API of choice for developers who need reliable, safe, and highly capable AI.',
    'https://console.anthropic.com',
    cat_llm,
    'paid',
    'Pay-per-token. Sonnet: ~$3/1M input tokens. Opus: ~$15/1M input tokens.',
    4.8,
    true, true, 'published', now(),
    'Anthropic', 2021,
    ARRAY['Claude Opus, Sonnet, and Haiku models', '200K token context window', 'Tool use and function calling', 'Vision and PDF understanding', 'Prompt caching for cost reduction'],
    ARRAY['Best-in-class coding and analysis', 'Massive context window', 'Strong safety and reliability'],
    ARRAY['Higher price point for Opus', 'Smaller model selection than OpenAI', 'No image generation'],
    ARRAY['Code generation and review', 'Long document analysis', 'Enterprise AI applications', 'Research and data extraction'],
    ARRAY['Software developers', 'AI engineers', 'Enterprise teams', 'Researchers']
  );

  -- 3. Mistral AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Mistral AI',
    'mistral-ai',
    'Europe''s leading AI lab — open-weight models with frontier performance at competitive prices.',
    'Mistral AI offers a range of open-weight and proprietary models including Mistral Large, Mixtral, and Codestral. Known for excellent multilingual performance and cost efficiency. Their open-weight approach gives developers flexibility to self-host or use their managed API.',
    'https://mistral.ai',
    cat_llm,
    'freemium',
    'Free tier available. Pay-per-token on API. Mistral Large: ~$2/1M input tokens.',
    4.4,
    true, false, 'published', now(),
    'Mistral AI', 2023,
    ARRAY['Mistral Large, Medium, and Small models', 'Mixtral mixture-of-experts architecture', 'Codestral for code generation', 'Open-weight models for self-hosting', 'Strong multilingual capabilities'],
    ARRAY['Excellent price-to-performance ratio', 'Open-weight models available', 'Strong European data compliance'],
    ARRAY['Smaller ecosystem than OpenAI', 'Less established enterprise support', 'Fewer multimodal capabilities'],
    ARRAY['Cost-efficient AI applications', 'Multilingual content generation', 'Code generation with Codestral', 'EU-compliant AI deployments'],
    ARRAY['European businesses', 'Cost-conscious developers', 'Open-source enthusiasts', 'Multilingual teams']
  );

  -- 4. Cohere
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Cohere',
    'cohere',
    'Enterprise AI platform specializing in RAG, embeddings, and text understanding.',
    'Cohere provides enterprise-focused AI models optimized for retrieval-augmented generation (RAG), semantic search, and text classification. Their Command, Embed, and Rerank models are designed for production workloads with strong grounding and citation capabilities.',
    'https://cohere.com',
    cat_llm,
    'freemium',
    'Free trial tier. Production pricing based on usage. Enterprise plans available.',
    4.2,
    true, false, 'published', now(),
    'Cohere', 2019,
    ARRAY['Command R+ for RAG and grounded generation', 'Best-in-class embedding models', 'Rerank API for search quality', 'Multilingual support (100+ languages)', 'Deployable on private cloud'],
    ARRAY['Industry-leading RAG capabilities', 'Excellent embedding and rerank models', 'Enterprise-grade security and compliance'],
    ARRAY['Smaller model selection for general tasks', 'Less known than OpenAI/Anthropic', 'Limited consumer-facing products'],
    ARRAY['Enterprise search and knowledge bases', 'Document retrieval and Q&A systems', 'Customer support automation', 'Multilingual content classification'],
    ARRAY['Enterprise AI teams', 'Search engineers', 'NLP researchers', 'Customer support teams']
  );

  -- 5. AI21 Labs
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'AI21 Labs',
    'ai21-labs',
    'Jamba model family — hybrid SSM-Transformer architecture for efficient long-context AI.',
    'AI21 Labs builds the Jamba model family, featuring a novel hybrid SSM-Transformer architecture that delivers efficient long-context processing. Their models excel at enterprise text generation, summarization, and paraphrasing tasks with strong grounding capabilities.',
    'https://www.ai21.com',
    cat_llm,
    'freemium',
    'Free tier available. Pay-per-token pricing. Enterprise plans available.',
    4.0,
    true, false, 'published', now(),
    'AI21 Labs', 2017,
    ARRAY['Jamba hybrid SSM-Transformer models', 'Efficient long-context processing', 'Task-specific APIs (summarize, paraphrase)', 'Grounded generation with citations', 'Custom model fine-tuning'],
    ARRAY['Innovative architecture for efficiency', 'Strong text understanding APIs', 'Good enterprise integrations'],
    ARRAY['Less widely adopted than competitors', 'Fewer multimodal capabilities', 'Smaller community and ecosystem'],
    ARRAY['Document summarization', 'Content paraphrasing and rewriting', 'Enterprise text generation', 'Long document processing'],
    ARRAY['Enterprise content teams', 'Technical writers', 'Legal professionals', 'Publishing companies']
  );

  -- 6. Meta Llama
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Meta Llama',
    'meta-llama',
    'Meta''s open-source LLM family — the most popular foundation for self-hosted and fine-tuned AI.',
    'Meta''s Llama is the most widely adopted open-source LLM family. Llama 3 and 4 models range from 8B to 405B parameters, offering frontier-class performance that can be self-hosted, fine-tuned, and deployed without API costs. The backbone of the open-source AI ecosystem.',
    'https://llama.meta.com',
    cat_llm,
    'open_source',
    'Free to download and use. Community license for commercial use.',
    4.6,
    true, true, 'published', now(),
    'Meta', 2023,
    ARRAY['Llama 3 and 4 model family (8B to 405B)', 'Open weights for self-hosting', 'Commercial-friendly license', 'Fine-tuning and customization support', 'Massive community ecosystem'],
    ARRAY['Completely free and open-source', 'Can be self-hosted for privacy', 'Huge community and fine-tune ecosystem'],
    ARRAY['Requires significant compute for large models', 'No managed API from Meta directly', 'Self-hosting requires ML expertise'],
    ARRAY['Self-hosted AI deployments', 'Custom fine-tuned models', 'Privacy-sensitive applications', 'Research and experimentation'],
    ARRAY['ML engineers', 'AI researchers', 'Privacy-conscious organizations', 'Open-source developers']
  );

  -- 7. Together AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Together AI',
    'together-ai',
    'Run 200+ open-source models via fast, affordable API — the one-stop shop for open AI.',
    'Together AI provides a unified API to run 200+ open-source models including Llama, Mistral, and Stable Diffusion. Known for blazing-fast inference speeds and competitive pricing. A popular choice for developers who want open-source model access without managing infrastructure.',
    'https://www.together.ai',
    cat_llm,
    'freemium',
    'Free credits to start. Pay-per-token. Llama 3 70B: ~$0.90/1M tokens.',
    4.3,
    true, false, 'published', now(),
    'Together AI', 2022,
    ARRAY['200+ open-source models via single API', 'Fast inference with custom infrastructure', 'Fine-tuning and custom model training', 'Serverless and dedicated endpoints', 'Image generation with Stable Diffusion'],
    ARRAY['Huge model selection', 'Very competitive pricing', 'Fast inference speeds'],
    ARRAY['Less polished than OpenAI/Anthropic SDKs', 'Model quality varies', 'Newer company with less track record'],
    ARRAY['Running open-source models without infrastructure', 'A/B testing different models', 'Cost-effective AI applications', 'Fine-tuning open models'],
    ARRAY['AI developers', 'Startups', 'Researchers', 'Cost-conscious teams']
  );

  -- 8. Groq
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Groq',
    'groq',
    'The fastest AI inference — custom LPU chips delivering 10x speed for open-source models.',
    'Groq builds custom Language Processing Unit (LPU) chips that deliver the fastest inference speeds in the industry. Running models like Llama 3 and Mixtral at 500+ tokens/second, Groq makes real-time AI interactions feel instant. Their free API tier makes it accessible to all developers.',
    'https://groq.com',
    cat_llm,
    'freemium',
    'Generous free tier. Pay-per-token for higher limits. Very competitive pricing.',
    4.5,
    true, true, 'published', now(),
    'Groq', 2016,
    ARRAY['Custom LPU hardware for fastest inference', '500+ tokens/second generation speed', 'Llama, Mixtral, and Gemma models', 'Generous free API tier', 'OpenAI-compatible API format'],
    ARRAY['Fastest inference speeds available', 'Generous free tier', 'OpenAI-compatible API'],
    ARRAY['Limited model selection', 'No fine-tuning support', 'Availability can be constrained'],
    ARRAY['Real-time AI applications', 'Chatbots requiring instant responses', 'Latency-sensitive workloads', 'Prototyping and development'],
    ARRAY['Developers building real-time AI', 'Startups needing fast inference', 'Hobbyists and experimenters']
  );

  -- 9. Fireworks AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Fireworks AI',
    'fireworks-ai',
    'High-performance inference platform — fast, cheap, and optimized for production workloads.',
    'Fireworks AI is a production-grade inference platform offering fast, affordable access to open-source and proprietary models. Known for their optimized serving infrastructure, function calling support, and JSON mode. A strong choice for teams building production AI applications.',
    'https://fireworks.ai',
    cat_llm,
    'freemium',
    'Free tier with rate limits. Pay-per-token. Competitive with Together AI pricing.',
    4.2,
    true, false, 'published', now(),
    'Fireworks AI', 2022,
    ARRAY['Optimized inference for production', 'Function calling and JSON mode', 'Custom model deployment', 'Serverless and on-demand options', 'Grammar-based structured generation'],
    ARRAY['Very fast inference', 'Strong production features', 'Good developer experience'],
    ARRAY['Less well-known brand', 'Smaller model selection', 'Documentation could be more comprehensive'],
    ARRAY['Production AI applications', 'Structured data extraction', 'API-driven AI products', 'Cost-efficient batch processing'],
    ARRAY['Backend developers', 'AI product teams', 'Data engineers', 'Startups']
  );

  -- 10. OpenRouter
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'OpenRouter',
    'openrouter',
    'One API, every model — unified access to OpenAI, Anthropic, Google, Meta, and 200+ more.',
    'OpenRouter is a unified API gateway that provides access to models from every major provider through a single API key. Compare pricing, switch between models instantly, and never get locked into one provider. The Swiss Army knife of AI APIs.',
    'https://openrouter.ai',
    cat_llm,
    'freemium',
    'Free models available. Pay-per-token with transparent markup. No subscription required.',
    4.4,
    true, true, 'published', now(),
    'OpenRouter', 2023,
    ARRAY['Unified API for 200+ models from all providers', 'Transparent per-model pricing', 'Automatic fallback between providers', 'Free models available', 'OpenAI-compatible API format'],
    ARRAY['Access every model through one API', 'No vendor lock-in', 'Free models for experimentation'],
    ARRAY['Slight markup over direct provider pricing', 'Dependent on upstream provider availability', 'Less control than direct API access'],
    ARRAY['Comparing models across providers', 'Building model-agnostic applications', 'Development and prototyping', 'Cost optimization across providers'],
    ARRAY['AI developers', 'Indie hackers', 'Researchers comparing models', 'Teams avoiding vendor lock-in']
  );

  -- ========================================
  -- LOCAL & OPEN SOURCE AI (10 tools)
  -- ========================================

  -- 11. Ollama
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Ollama',
    'ollama',
    'Run LLMs locally with one command — the easiest way to get AI running on your machine.',
    'Ollama makes running large language models locally as easy as a single terminal command. Supporting Llama, Mistral, Gemma, Phi, and dozens more, it handles model downloads, quantization, and serving automatically. The most popular tool for local AI inference.',
    'https://ollama.com',
    cat_local,
    'open_source',
    'Completely free and open-source.',
    4.7,
    true, true, 'published', now(),
    'Ollama', 2023,
    ARRAY['One-command model download and run', 'Supports 100+ models (Llama, Mistral, Gemma, etc.)', 'OpenAI-compatible API server', 'GPU acceleration on Mac, Windows, Linux', 'Model customization with Modelfiles'],
    ARRAY['Incredibly easy to set up', 'Completely free and private', 'Huge model library'],
    ARRAY['Requires decent hardware for larger models', 'No cloud sync or collaboration', 'Limited to text models (no image gen)'],
    ARRAY['Private local AI assistant', 'Offline AI development', 'Testing models before API deployment', 'Learning about LLMs hands-on'],
    ARRAY['Developers', 'Privacy-conscious users', 'AI hobbyists', 'Students learning ML']
  );

  -- 12. LM Studio
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'LM Studio',
    'lm-studio',
    'Beautiful desktop app for running LLMs locally — discover, download, and chat with AI models.',
    'LM Studio provides a polished desktop interface for discovering, downloading, and running local LLMs. With a built-in model browser, chat interface, and local API server, it makes local AI accessible to non-technical users. Supports GGUF models with automatic GPU optimization.',
    'https://lmstudio.ai',
    cat_local,
    'free',
    'Free for personal use. Business licenses available.',
    4.5,
    true, true, 'published', now(),
    'LM Studio', 2023,
    ARRAY['Beautiful desktop GUI for local LLMs', 'Built-in model browser and downloader', 'Local API server (OpenAI-compatible)', 'Automatic GPU/CPU optimization', 'Chat interface with conversation history'],
    ARRAY['Most user-friendly local LLM tool', 'Great model discovery experience', 'No terminal knowledge required'],
    ARRAY['Larger download size than Ollama', 'Limited to GGUF format models', 'Business use requires license'],
    ARRAY['Local AI chat without technical setup', 'Comparing different models side by side', 'Running a local API server', 'Privacy-first AI usage'],
    ARRAY['Non-technical AI enthusiasts', 'Privacy-conscious professionals', 'Developers wanting quick local setup', 'Students exploring AI']
  );

  -- 13. Jan
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Jan',
    'jan',
    'Open-source ChatGPT alternative that runs 100% offline on your computer.',
    'Jan is an open-source desktop app that runs AI models entirely offline. It provides a clean ChatGPT-like interface with local model management, extensions, and a local API server. Designed to be the open-source replacement for cloud-based AI assistants.',
    'https://jan.ai',
    cat_local,
    'open_source',
    'Completely free and open-source. MIT license.',
    4.2,
    true, false, 'published', now(),
    'Jan', 2023,
    ARRAY['100% offline ChatGPT alternative', 'Clean desktop chat interface', 'Extension system for plugins', 'Local API server', 'Cross-platform (Windows, Mac, Linux)'],
    ARRAY['Fully open-source and free', 'Clean and intuitive interface', 'Active development community'],
    ARRAY['Newer and less stable than alternatives', 'Smaller model library', 'Extension ecosystem still growing'],
    ARRAY['Offline AI assistant', 'Private conversations', 'Open-source AI development', 'Local model experimentation'],
    ARRAY['Open-source advocates', 'Privacy-focused users', 'Developers', 'Hobbyists']
  );

  -- 14. GPT4All
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'GPT4All',
    'gpt4all',
    'Free, local, privacy-aware AI — run chatbots on consumer hardware with no GPU required.',
    'GPT4All by Nomic AI runs large language models on consumer-grade hardware, including machines without a GPU. It focuses on making AI accessible to everyone with a simple installer and curated model library optimized for CPU inference.',
    'https://www.nomic.ai/gpt4all',
    cat_local,
    'open_source',
    'Completely free. Open-source under MIT license.',
    4.1,
    true, false, 'published', now(),
    'Nomic AI', 2023,
    ARRAY['Runs on CPU — no GPU required', 'Simple one-click installer', 'Curated model library', 'Local document Q&A (LocalDocs)', 'Cross-platform desktop app'],
    ARRAY['Works without GPU', 'Very easy installation', 'LocalDocs for document Q&A'],
    ARRAY['Slower than GPU-accelerated alternatives', 'Fewer models than Ollama', 'Limited customization options'],
    ARRAY['AI on older hardware', 'Private document Q&A', 'Offline AI assistant', 'Learning about local LLMs'],
    ARRAY['Users without GPUs', 'Privacy-conscious individuals', 'Educators', 'Small businesses']
  );

  -- 15. LocalAI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'LocalAI',
    'localai',
    'Self-hosted OpenAI-compatible API — drop-in replacement for cloud AI in your infrastructure.',
    'LocalAI is a self-hosted, OpenAI-compatible API server that acts as a drop-in replacement for OpenAI''s API. It supports text, image, audio generation, and embeddings using local models. Perfect for organizations that need AI capabilities without sending data to the cloud.',
    'https://localai.io',
    cat_local,
    'open_source',
    'Free and open-source. Apache 2.0 license.',
    4.0,
    true, false, 'published', now(),
    'LocalAI', 2023,
    ARRAY['OpenAI API-compatible endpoint', 'Text, image, audio, and embedding support', 'Docker-based deployment', 'No GPU required (optional acceleration)', 'Model gallery for easy downloads'],
    ARRAY['True drop-in OpenAI replacement', 'Supports multiple modalities', 'Docker makes deployment easy'],
    ARRAY['Requires DevOps knowledge to deploy', 'Slower than cloud APIs', 'Less polished than commercial alternatives'],
    ARRAY['Self-hosted AI infrastructure', 'Air-gapped environment AI', 'Enterprise data sovereignty', 'OpenAI API migration to local'],
    ARRAY['DevOps engineers', 'Enterprise IT teams', 'Security-conscious organizations', 'Self-hosting enthusiasts']
  );

  -- 16. Open WebUI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Open WebUI',
    'open-webui',
    'Self-hosted ChatGPT-style interface for Ollama and OpenAI-compatible APIs.',
    'Open WebUI (formerly Ollama WebUI) provides a rich, self-hosted web interface for interacting with local and cloud AI models. Features include conversation management, RAG with document uploads, model management, web search integration, and multi-user support.',
    'https://openwebui.com',
    cat_local,
    'open_source',
    'Free and open-source. Docker deployment.',
    4.4,
    true, false, 'published', now(),
    'Open WebUI', 2023,
    ARRAY['Rich ChatGPT-like web interface', 'RAG with document upload', 'Multi-user support with roles', 'Web search integration', 'Works with Ollama and OpenAI APIs'],
    ARRAY['Best web UI for local models', 'Feature-rich with RAG and search', 'Active community development'],
    ARRAY['Requires Docker and some technical setup', 'Can be resource-heavy', 'Updates can sometimes break configs'],
    ARRAY['Team-shared local AI interface', 'Document Q&A with RAG', 'Self-hosted ChatGPT replacement', 'Model management dashboard'],
    ARRAY['Teams running local AI', 'System administrators', 'Developers', 'Organizations needing self-hosted AI']
  );

  -- 17. llama.cpp
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'llama.cpp',
    'llama-cpp',
    'The C/C++ engine powering local AI — lightning-fast inference that Ollama and LM Studio build on.',
    'llama.cpp is the foundational C/C++ library for running quantized LLMs on consumer hardware. Created by Georgi Gerganov, it powers tools like Ollama and LM Studio behind the scenes. It supports GGUF model format, GPU offloading, and runs on virtually any platform.',
    'https://github.com/ggml-org/llama.cpp',
    cat_local,
    'open_source',
    'Free and open-source. MIT license.',
    4.5,
    true, false, 'published', now(),
    'ggml.org', 2023,
    ARRAY['C/C++ for maximum performance', 'GGUF quantization format', 'GPU offloading (CUDA, Metal, Vulkan)', 'Server mode with OpenAI-compatible API', 'Runs on everything from Raspberry Pi to servers'],
    ARRAY['Fastest local inference engine', 'Runs on virtually any hardware', 'Foundation of the local AI ecosystem'],
    ARRAY['Command-line interface only', 'Requires compilation for best performance', 'Steep learning curve for beginners'],
    ARRAY['Building local AI applications', 'Maximum performance local inference', 'Embedded AI in apps', 'Research and benchmarking'],
    ARRAY['C/C++ developers', 'ML engineers', 'Embedded systems developers', 'Performance enthusiasts']
  );

  -- 18. vLLM
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'vLLM',
    'vllm',
    'High-throughput LLM serving engine — the production standard for GPU inference at scale.',
    'vLLM is a high-throughput serving engine for LLMs that uses PagedAttention for efficient memory management. It delivers 2-4x higher throughput than naive serving and is the go-to choice for production deployments on GPU clusters. Used by major AI companies for inference at scale.',
    'https://vllm.ai',
    cat_local,
    'open_source',
    'Free and open-source. Apache 2.0 license.',
    4.3,
    true, false, 'published', now(),
    'vLLM', 2023,
    ARRAY['PagedAttention for efficient memory', '2-4x throughput improvement', 'OpenAI-compatible API server', 'Continuous batching for concurrency', 'Supports most popular model architectures'],
    ARRAY['Industry-standard for production serving', 'Dramatically higher throughput', 'Active development and community'],
    ARRAY['Requires GPU infrastructure', 'Complex setup for multi-GPU', 'Not ideal for single-user local use'],
    ARRAY['Production LLM serving', 'High-concurrency AI APIs', 'Model serving infrastructure', 'Batch inference pipelines'],
    ARRAY['ML infrastructure engineers', 'AI companies', 'DevOps teams', 'Cloud platform builders']
  );

  -- 19. Kobold AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'KoboldAI',
    'koboldai',
    'AI-powered creative writing suite — the go-to tool for interactive fiction and storytelling.',
    'KoboldAI is a browser-based interface for AI-assisted creative writing, interactive fiction, and role-playing. It supports both local and cloud models with features tailored for creative writing like memory, world info, and author''s note. A beloved tool in the creative AI community.',
    'https://github.com/KoboldAI/KoboldAI-Client',
    cat_local,
    'open_source',
    'Free and open-source.',
    3.9,
    true, false, 'published', now(),
    'KoboldAI Community', 2021,
    ARRAY['Browser-based creative writing interface', 'Memory and world info systems', 'Author''s note for style guidance', 'Supports local and cloud models', 'Interactive fiction and adventure mode'],
    ARRAY['Best tool for AI creative writing', 'Rich world-building features', 'Active creative writing community'],
    ARRAY['Niche focus on creative writing', 'Can be complex to set up', 'Interface feels dated'],
    ARRAY['Interactive fiction writing', 'AI-assisted novel writing', 'Role-playing and storytelling', 'Creative writing exploration'],
    ARRAY['Fiction writers', 'Game designers', 'Role-playing enthusiasts', 'Creative writing hobbyists']
  );

  -- 20. text-generation-webui
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'text-generation-webui',
    'text-generation-webui',
    'The Swiss Army knife of local AI — Gradio interface supporting every model format and backend.',
    'text-generation-webui (by oobabooga) is a comprehensive Gradio-based web UI for running local LLMs. It supports virtually every model format (GGUF, GPTQ, AWQ, EXL2) and backend (llama.cpp, ExLlamaV2, Transformers). The most flexible tool for power users who want maximum control.',
    'https://github.com/oobabooga/text-generation-webui',
    cat_local,
    'open_source',
    'Free and open-source. AGPL license.',
    4.1,
    true, false, 'published', now(),
    'oobabooga', 2023,
    ARRAY['Supports every model format and backend', 'Gradio web interface', 'Extensions system (RAG, TTS, vision)', 'LoRA loading and training', 'API server for programmatic access'],
    ARRAY['Maximum flexibility and format support', 'Rich extension ecosystem', 'Great for model experimentation'],
    ARRAY['Complex setup process', 'Can be unstable with updates', 'Steep learning curve'],
    ARRAY['Testing different model formats', 'LoRA fine-tuning and merging', 'Advanced local AI workflows', 'Research and experimentation'],
    ARRAY['ML engineers', 'AI researchers', 'Power users', 'Model fine-tuners']
  );

  -- ========================================
  -- MCP & SKILLS PLATFORMS (8 tools)
  -- ========================================

  -- 21. Manus AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Manus AI',
    'manus-ai',
    'The general-purpose AI agent that thinks, plans, and executes complex tasks autonomously.',
    'Manus AI is an autonomous AI agent that can browse the web, write code, manage files, and complete complex multi-step tasks. It creates a virtual computer environment for each task and works through problems step-by-step with real-time progress visibility.',
    'https://manus.im',
    cat_mcp,
    'freemium',
    'Free tier with limited tasks. Pro plans available.',
    4.3,
    true, true, 'published', now(),
    'Manus AI', 2025,
    ARRAY['Autonomous multi-step task execution', 'Virtual computer environment per task', 'Web browsing and research', 'Code writing and file management', 'Real-time progress tracking'],
    ARRAY['Impressive autonomous task completion', 'Can handle truly complex workflows', 'Visual progress tracking'],
    ARRAY['Can be slow on complex tasks', 'Limited free tier', 'Results can be inconsistent'],
    ARRAY['Automated research and reports', 'Data collection and analysis', 'Code project scaffolding', 'Complex multi-step workflows'],
    ARRAY['Researchers', 'Business analysts', 'Developers', 'Content teams']
  );

  -- 22. Smithery
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Smithery',
    'smithery',
    'The marketplace for MCP servers — discover and install AI tool integrations in one click.',
    'Smithery is the leading marketplace for Model Context Protocol (MCP) servers. Browse, discover, and install tool integrations that extend AI assistants like Claude with capabilities like database access, API calls, file management, and custom workflows.',
    'https://smithery.ai',
    cat_mcp,
    'freemium',
    'Free to browse and install. Premium servers may have fees.',
    4.2,
    true, true, 'published', now(),
    'Smithery', 2025,
    ARRAY['MCP server marketplace and registry', 'One-click installation', 'Curated and community servers', 'Integration with Claude and other assistants', 'Server documentation and ratings'],
    ARRAY['Largest MCP server directory', 'Easy discovery and installation', 'Growing community'],
    ARRAY['MCP ecosystem still early', 'Some servers are experimental', 'Limited to MCP-compatible assistants'],
    ARRAY['Extending AI assistant capabilities', 'Discovering MCP integrations', 'Building custom AI workflows', 'Connecting AI to tools and APIs'],
    ARRAY['AI developers', 'Claude users', 'Automation enthusiasts', 'Tool builders']
  );

  -- 23. Glama MCP
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Glama',
    'glama',
    'AI gateway with built-in MCP server directory — route, monitor, and extend your AI stack.',
    'Glama provides an AI gateway that routes requests to multiple LLM providers while also maintaining a curated directory of MCP servers. It helps teams manage their AI infrastructure with monitoring, cost tracking, and tool integrations in one platform.',
    'https://glama.ai',
    cat_mcp,
    'free',
    'Free tier available. Usage-based pricing for gateway.',
    4.0,
    true, false, 'published', now(),
    'Glama', 2024,
    ARRAY['AI gateway with multi-provider routing', 'MCP server directory', 'Cost tracking and monitoring', 'API key management', 'Usage analytics dashboard'],
    ARRAY['Combined gateway and MCP directory', 'Good cost visibility', 'Multi-provider support'],
    ARRAY['Newer platform with smaller community', 'Gateway adds latency', 'Limited advanced features'],
    ARRAY['Managing AI API costs', 'Discovering MCP servers', 'Multi-provider AI routing', 'AI usage monitoring'],
    ARRAY['AI platform teams', 'DevOps engineers', 'Budget-conscious developers', 'Technical managers']
  );

  -- 24. Composio
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Composio',
    'composio',
    'Integration platform for AI agents — connect LLMs to 250+ tools with managed authentication.',
    'Composio provides a managed integration layer that connects AI agents to 250+ external tools and services. It handles authentication, API management, and provides pre-built actions for tools like GitHub, Slack, Gmail, and databases, so developers can focus on agent logic.',
    'https://composio.dev',
    cat_mcp,
    'freemium',
    'Free tier with 1000 actions/mo. Pro plans for higher limits.',
    4.2,
    true, false, 'published', now(),
    'Composio', 2024,
    ARRAY['250+ tool integrations', 'Managed OAuth and authentication', 'Pre-built actions for popular services', 'Works with LangChain, CrewAI, Autogen', 'MCP server support'],
    ARRAY['Huge integration library', 'Handles auth complexity', 'Framework-agnostic'],
    ARRAY['Free tier can be limiting', 'Some integrations are basic', 'Documentation still evolving'],
    ARRAY['Building AI agents with tool access', 'Automating workflows via AI', 'Connecting LLMs to SaaS tools', 'Agent-powered business processes'],
    ARRAY['AI agent developers', 'Automation engineers', 'Full-stack developers', 'Startup builders']
  );

  -- 25. Relevance AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Relevance AI',
    'relevance-ai',
    'Build and deploy AI agents and tools without code — the no-code agent platform.',
    'Relevance AI lets you build AI agents and custom AI tools without writing code. Create multi-step AI workflows, connect to APIs, process documents, and deploy agents that can be shared with your team. Think Zapier but with AI-native capabilities.',
    'https://relevanceai.com',
    cat_mcp,
    'freemium',
    'Free tier available. Team: $19/mo. Business plans available.',
    4.1,
    true, false, 'published', now(),
    'Relevance AI', 2020,
    ARRAY['No-code AI agent builder', 'Multi-step workflow creation', 'API and tool integrations', 'Document processing pipelines', 'Team sharing and collaboration'],
    ARRAY['No coding required', 'Visual workflow builder', 'Good for non-technical teams'],
    ARRAY['Less flexible than code-based solutions', 'Can get expensive at scale', 'Learning curve for complex workflows'],
    ARRAY['Building AI agents without code', 'Automating document workflows', 'Creating team AI tools', 'Customer-facing AI bots'],
    ARRAY['Non-technical teams', 'Operations managers', 'Marketing teams', 'Small businesses']
  );

  -- 26. Langflow
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Langflow',
    'langflow',
    'Visual IDE for building AI applications — drag-and-drop LangChain workflow builder.',
    'Langflow is a visual IDE for building multi-agent and RAG applications. Using a drag-and-drop interface, you can connect LLMs, vector stores, tools, and logic into complex AI workflows. Built on top of LangChain, it bridges the gap between visual builders and production code.',
    'https://www.langflow.org',
    cat_mcp,
    'open_source',
    'Free and open-source. DataStax offers managed cloud version.',
    4.1,
    true, false, 'published', now(),
    'Langflow (DataStax)', 2023,
    ARRAY['Drag-and-drop AI workflow builder', 'Built on LangChain ecosystem', 'RAG and multi-agent support', 'Export to Python code', 'Self-hosted or cloud deployment'],
    ARRAY['Visual builder lowers barrier to entry', 'Exports to production code', 'Strong LangChain integration'],
    ARRAY['Can be slow for complex flows', 'Requires LangChain knowledge for advanced use', 'Self-hosting needs resources'],
    ARRAY['Prototyping AI workflows visually', 'Building RAG applications', 'Creating multi-agent systems', 'Teaching AI application development'],
    ARRAY['AI developers', 'Product teams', 'Educators', 'Prototypers']
  );

  -- 27. Flowise
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Flowise',
    'flowise',
    'Open-source low-code platform for building LLM apps with a visual drag-and-drop UI.',
    'Flowise is an open-source, low-code tool for building customized LLM orchestration flows and AI agents. Its visual interface makes it easy to create chatbots, Q&A systems, and AI workflows by connecting components like LLMs, memory, tools, and vector stores.',
    'https://flowiseai.com',
    cat_mcp,
    'open_source',
    'Free and open-source. Cloud hosting available.',
    4.0,
    true, false, 'published', now(),
    'Flowise', 2023,
    ARRAY['Visual drag-and-drop flow builder', 'Pre-built LLM and tool components', 'API endpoint generation', 'Embedded chat widget', 'Self-hosted with Docker'],
    ARRAY['Easy visual interface', 'Quick to prototype', 'Good documentation'],
    ARRAY['Limited to pre-built components', 'Performance at scale can be an issue', 'Fewer components than Langflow'],
    ARRAY['Building chatbots quickly', 'Creating Q&A systems', 'Prototyping AI flows', 'Non-developer AI application building'],
    ARRAY['Citizen developers', 'Small business owners', 'Product managers', 'AI enthusiasts']
  );

  -- 28. Wordware
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Wordware',
    'wordware',
    'Natural language programming for AI — build AI agents by writing plain English instructions.',
    'Wordware lets you build AI agents and workflows using natural language instead of code. Write instructions in plain English, connect tools and APIs, and deploy AI agents that can handle complex business processes. It''s programming in prose.',
    'https://www.wordware.ai',
    cat_mcp,
    'freemium',
    'Free tier available. Pro plans for production use.',
    4.0,
    true, false, 'published', now(),
    'Wordware', 2024,
    ARRAY['Natural language programming', 'AI agent creation without code', 'Tool and API integrations', 'Version control for prompts', 'Collaborative editing'],
    ARRAY['Truly accessible to non-developers', 'Intuitive natural language approach', 'Good for rapid prototyping'],
    ARRAY['Less precise than code-based tools', 'Complex logic can be hard to express', 'Younger platform with less ecosystem'],
    ARRAY['Creating AI agents with plain English', 'Business process automation', 'Rapid AI prototyping', 'Non-technical AI development'],
    ARRAY['Non-technical founders', 'Business analysts', 'Product managers', 'Citizen developers']
  );

  -- ========================================
  -- AI EDUCATION (8 tools)
  -- ========================================

  -- 29. Khanmigo
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Khanmigo',
    'khanmigo',
    'Khan Academy''s AI tutor — personalized learning powered by GPT-4 with Socratic teaching.',
    'Khanmigo is Khan Academy''s AI-powered tutor built on GPT-4. Instead of giving answers directly, it guides students through problems using the Socratic method. It also helps teachers create lesson plans, generate assessments, and differentiate instruction.',
    'https://www.khanmigo.ai',
    cat_education,
    'freemium',
    'Free for teachers. Students: $4/mo or $44/year. District pricing available.',
    4.5,
    true, true, 'published', now(),
    'Khan Academy', 2023,
    ARRAY['Socratic tutoring method', 'GPT-4 powered explanations', 'Lesson plan generation for teachers', 'Math, science, and humanities support', 'Progress tracking and insights'],
    ARRAY['Pedagogically sound approach', 'Affordable pricing', 'Trusted Khan Academy brand'],
    ARRAY['Limited to Khan Academy curriculum', 'Not suitable for advanced college topics', 'Requires internet connection'],
    ARRAY['Math and science tutoring', 'Homework help without cheating', 'Teacher lesson planning', 'Personalized learning paths'],
    ARRAY['K-12 students', 'Teachers', 'Parents', 'Homeschooling families']
  );

  -- 30. Duolingo Max
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Duolingo Max',
    'duolingo-max',
    'AI-powered language learning — practice conversations with AI and get explanations for mistakes.',
    'Duolingo Max adds GPT-4 powered features to the world''s most popular language learning app. Roleplay lets you practice real conversations with AI characters, while Explain My Answer provides detailed explanations for why your answers were right or wrong.',
    'https://www.duolingo.com',
    cat_education,
    'paid',
    'Duolingo Max: $29.99/mo or $167.99/year. Super: $12.99/mo.',
    4.4,
    true, true, 'published', now(),
    'Duolingo', 2023,
    ARRAY['AI Roleplay conversations', 'Explain My Answer feature', 'Video Call with AI characters', 'Gamified learning with streaks', '40+ languages available'],
    ARRAY['Most engaging language learning app', 'AI conversations feel natural', 'Excellent gamification keeps you motivated'],
    ARRAY['Max tier is expensive', 'AI features only for select languages', 'Not sufficient for fluency alone'],
    ARRAY['Daily language practice', 'Conversation practice with AI', 'Understanding grammar mistakes', 'Learning basics of new languages'],
    ARRAY['Language learners', 'Travelers', 'Students', 'Casual learners']
  );

  -- 31. Quizlet Q-Chat
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Quizlet Q-Chat',
    'quizlet',
    'AI study buddy that turns your notes into personalized quizzes, flashcards, and practice tests.',
    'Quizlet''s Q-Chat AI tutor transforms studying with personalized quizzes, adaptive flashcards, and conversational tutoring. Upload your notes or textbook content and Q-Chat creates custom study materials tailored to your learning pace and weak areas.',
    'https://quizlet.com',
    cat_education,
    'freemium',
    'Free basic tier. Quizlet Plus: $7.99/mo. Annual: $35.99/year.',
    4.2,
    true, false, 'published', now(),
    'Quizlet', 2023,
    ARRAY['AI-generated flashcards from notes', 'Adaptive practice tests', 'Q-Chat conversational tutor', 'Spaced repetition learning', '500M+ existing study sets'],
    ARRAY['Massive existing content library', 'Effective spaced repetition', 'AI generates study materials from any content'],
    ARRAY['AI features require paid plan', 'Can promote rote memorization', 'Quality varies across user-created content'],
    ARRAY['Exam preparation', 'Vocabulary memorization', 'Study material creation', 'Self-paced reviewing'],
    ARRAY['College students', 'High school students', 'Medical students', 'Certification preppers']
  );

  -- 32. Photomath
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Photomath',
    'photomath',
    'Point your camera at any math problem — get step-by-step solutions instantly.',
    'Photomath uses AI to solve math problems from a photo. Point your camera at a handwritten or printed equation and get instant, step-by-step solutions with multiple solving methods. Now owned by Google, it covers everything from basic arithmetic to calculus.',
    'https://photomath.com',
    cat_education,
    'freemium',
    'Free basic solutions. Photomath Plus: $9.99/mo for detailed explanations.',
    4.3,
    true, false, 'published', now(),
    'Google (Photomath)', 2014,
    ARRAY['Camera-based math problem solving', 'Step-by-step solution explanations', 'Multiple solving methods shown', 'Handwritten equation recognition', 'Covers arithmetic through calculus'],
    ARRAY['Instant solutions from photos', 'Excellent step-by-step explanations', 'Works with handwritten problems'],
    ARRAY['Can enable cheating without learning', 'Plus subscription needed for full explanations', 'Struggles with complex word problems'],
    ARRAY['Understanding math step-by-step', 'Checking homework answers', 'Learning alternative solving methods', 'Quick math help on the go'],
    ARRAY['Math students (all levels)', 'Parents helping with homework', 'Teachers creating examples', 'Self-learners']
  );

  -- 33. MagicSchool AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'MagicSchool AI',
    'magicschool-ai',
    'AI toolkit built specifically for teachers — lesson plans, rubrics, IEPs, and more in seconds.',
    'MagicSchool AI provides 60+ AI tools designed specifically for educators. Generate lesson plans, create differentiated materials, write IEPs, build rubrics, and draft parent communications — all aligned to educational standards and best practices.',
    'https://www.magicschool.ai',
    cat_education,
    'freemium',
    'Free tier for teachers. MagicSchool Plus for schools and districts.',
    4.3,
    true, false, 'published', now(),
    'MagicSchool AI', 2023,
    ARRAY['60+ teacher-specific AI tools', 'Lesson plan generator', 'IEP and rubric creation', 'Differentiated material generation', 'Standards-aligned content'],
    ARRAY['Purpose-built for educators', 'Huge time-saver for teachers', 'Free tier is generous'],
    ARRAY['Output quality varies by subject', 'Requires review and customization', 'Limited student-facing features'],
    ARRAY['Lesson planning', 'Creating assessments and rubrics', 'Writing IEPs', 'Parent communication drafts'],
    ARRAY['K-12 teachers', 'School administrators', 'Special education teachers', 'Curriculum designers']
  );

  -- 34. Socratic by Google
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Socratic by Google',
    'socratic',
    'Google''s free AI homework helper — snap a photo and get visual explanations.',
    'Socratic by Google helps students understand homework problems with visual, step-by-step explanations. Take a photo of a question or type it in, and Socratic finds the best resources and explanations from across the web, powered by Google AI.',
    'https://socratic.org',
    cat_education,
    'free',
    'Completely free. No ads or premium tiers.',
    4.0,
    true, false, 'published', now(),
    'Google', 2019,
    ARRAY['Photo-based question solving', 'Visual step-by-step explanations', 'Curated educational resources', 'Covers math, science, history, English', 'Powered by Google AI and Search'],
    ARRAY['Completely free with no limits', 'Backed by Google quality', 'Visual explanations are excellent'],
    ARRAY['Limited to common subjects', 'Not as detailed as Photomath for math', 'Mobile app only'],
    ARRAY['Quick homework help', 'Understanding concepts visually', 'Finding relevant study resources', 'Science and history questions'],
    ARRAY['High school students', 'Middle school students', 'Self-learners', 'Parents helping kids']
  );

  -- 35. Wolfram Alpha
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Wolfram Alpha',
    'wolfram-alpha',
    'Computational knowledge engine — the gold standard for math, science, and data answers.',
    'Wolfram Alpha is a computational knowledge engine that answers factual queries by computing answers from structured data. Unlike search engines, it computes exact answers for math, science, engineering, and data questions. The backbone of Siri''s knowledge and a trusted academic tool.',
    'https://www.wolframalpha.com',
    cat_education,
    'freemium',
    'Free basic queries. Pro: $7.25/mo. Pro Premium: $12/mo with step-by-step.',
    4.5,
    true, true, 'published', now(),
    'Wolfram Research', 2009,
    ARRAY['Computational answers (not search results)', 'Step-by-step math solutions', 'Data visualization and graphing', 'Covers math, physics, chemistry, statistics', 'Natural language query input'],
    ARRAY['Provides exact computed answers', 'Trusted in academia', 'Incredible depth for STEM subjects'],
    ARRAY['Struggles with conversational queries', 'Interface feels dated', 'Pro needed for step-by-step'],
    ARRAY['Solving complex math problems', 'Engineering calculations', 'Statistical analysis', 'Scientific data lookups'],
    ARRAY['STEM students', 'Engineers', 'Scientists', 'Data analysts', 'Academics']
  );

  -- 36. Brainly
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Brainly',
    'brainly',
    'AI-enhanced peer learning platform — get answers from students, verified by AI.',
    'Brainly combines community-sourced answers with AI verification and explanation. Students ask questions and get answers from peers, which are then enhanced and verified by AI for accuracy. With 350M+ users, it''s one of the largest education communities.',
    'https://brainly.com',
    cat_education,
    'freemium',
    'Free with ads. Brainly Plus: $6/mo for ad-free and AI features.',
    3.9,
    true, false, 'published', now(),
    'Brainly', 2009,
    ARRAY['Community + AI answer verification', 'AI-powered explanations', 'Photo-based question input', '350M+ user community', 'Covers all school subjects'],
    ARRAY['Massive question-answer database', 'AI verification improves accuracy', 'Free tier available'],
    ARRAY['Answer quality can be inconsistent', 'Ads on free tier', 'Can promote answer-copying'],
    ARRAY['Getting homework help', 'Understanding concepts from peers', 'Finding explained solutions', 'Studying for exams'],
    ARRAY['Students (all ages)', 'Parents', 'Tutors', 'Self-learners']
  );

  -- ========================================
  -- AI SCIENCE & HEALTHCARE (6 tools)
  -- ========================================

  -- 37. AlphaFold
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'AlphaFold',
    'alphafold',
    'DeepMind''s Nobel Prize-winning AI — predicts 3D protein structures from amino acid sequences.',
    'AlphaFold by Google DeepMind solved one of biology''s grand challenges: predicting protein 3D structure from sequence. The AlphaFold Protein Structure Database contains 200M+ predicted structures, accelerating drug discovery, disease research, and our understanding of life.',
    'https://alphafold.ebi.ac.uk',
    cat_science,
    'free',
    'Completely free. Open-source model and database.',
    4.9,
    true, true, 'published', now(),
    'Google DeepMind', 2020,
    ARRAY['Protein structure prediction from sequence', '200M+ predicted structures database', 'Nobel Prize in Chemistry 2024', 'AlphaFold 3 predicts molecular interactions', 'Open-source and freely accessible'],
    ARRAY['Revolutionary scientific breakthrough', 'Free and open access', 'Massive pre-computed database'],
    ARRAY['Requires biology expertise to interpret', 'Predictions not always experimental-grade', 'Complex setup for custom predictions'],
    ARRAY['Drug discovery research', 'Understanding disease mechanisms', 'Protein engineering', 'Biological research'],
    ARRAY['Biologists', 'Pharmaceutical researchers', 'Biotech companies', 'Academic researchers']
  );

  -- 38. Insilico Medicine
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Insilico Medicine',
    'insilico-medicine',
    'AI-powered drug discovery platform — from target identification to clinical trials.',
    'Insilico Medicine uses AI across the entire drug discovery pipeline: identifying disease targets, generating novel molecules, and predicting clinical trial outcomes. Their platform has already advanced AI-discovered drugs to human clinical trials.',
    'https://insilico.com',
    cat_science,
    'enterprise',
    'Enterprise partnerships. Research collaborations available.',
    4.3,
    true, false, 'published', now(),
    'Insilico Medicine', 2014,
    ARRAY['End-to-end AI drug discovery', 'Target identification with PandaOmics', 'Molecule generation with Chemistry42', 'Clinical trial outcome prediction', 'Multiple drugs in clinical trials'],
    ARRAY['Full pipeline AI drug discovery', 'Real drugs in clinical trials', 'Strong publication record'],
    ARRAY['Enterprise-only pricing', 'Not accessible to individual researchers', 'Drug discovery timelines are still long'],
    ARRAY['Drug target identification', 'Novel molecule design', 'Clinical trial optimization', 'Pharmaceutical R&D acceleration'],
    ARRAY['Pharmaceutical companies', 'Biotech startups', 'Drug discovery researchers', 'Clinical research organizations']
  );

  -- 39. Consensus
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Consensus',
    'consensus',
    'AI-powered academic search — find what science says with evidence-based answers.',
    'Consensus is an AI search engine that extracts and synthesizes findings from 200M+ scientific papers. Ask a research question in plain English and get evidence-based answers with citations, consensus meters, and study summaries.',
    'https://consensus.app',
    cat_science,
    'freemium',
    'Free tier with limited searches. Premium: $8.99/mo for unlimited.',
    4.4,
    true, true, 'published', now(),
    'Consensus', 2021,
    ARRAY['AI search across 200M+ papers', 'Consensus meter for scientific agreement', 'Study quality indicators', 'Citation extraction and synthesis', 'Natural language queries'],
    ARRAY['Evidence-based answers from real papers', 'Consensus meter shows scientific agreement', 'Great for literature reviews'],
    ARRAY['Limited to published research', 'Free tier has search limits', 'May miss very recent papers'],
    ARRAY['Literature reviews', 'Evidence-based decision making', 'Research question exploration', 'Fact-checking scientific claims'],
    ARRAY['Researchers', 'Students', 'Healthcare professionals', 'Science journalists', 'Policy makers']
  );

  -- 40. Semantic Scholar
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Semantic Scholar',
    'semantic-scholar',
    'AI-powered research tool by Allen AI — discover relevant papers with intelligent recommendations.',
    'Semantic Scholar by the Allen Institute for AI uses machine learning to help researchers find relevant academic papers. It extracts key information, identifies influential citations, and provides AI-generated summaries (TLDR) for 200M+ papers across all scientific fields.',
    'https://www.semanticscholar.org',
    cat_science,
    'free',
    'Completely free. Open API available.',
    4.3,
    true, false, 'published', now(),
    'Allen Institute for AI', 2015,
    ARRAY['200M+ academic papers indexed', 'AI-generated paper summaries (TLDR)', 'Citation influence analysis', 'Research feed recommendations', 'Free open API for developers'],
    ARRAY['Completely free with no limits', 'Excellent citation analysis', 'AI summaries save reading time'],
    ARRAY['Less comprehensive than Google Scholar', 'TLDR summaries can oversimplify', 'Recommendation algorithm needs tuning'],
    ARRAY['Finding relevant research papers', 'Understanding citation networks', 'Tracking research fields', 'Literature discovery'],
    ARRAY['Academic researchers', 'PhD students', 'Research librarians', 'Science communicators']
  );

  -- 41. Abridge
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Abridge',
    'abridge',
    'AI medical scribe — automatically documents patient-doctor conversations into structured notes.',
    'Abridge uses AI to listen to patient-doctor conversations and automatically generate structured clinical documentation. It reduces physician documentation burden by up to 70%, letting doctors focus on patients instead of typing. Integrated with major EHR systems.',
    'https://www.abridge.com',
    cat_science,
    'enterprise',
    'Enterprise pricing for health systems. Per-provider licensing.',
    4.4,
    true, false, 'published', now(),
    'Abridge', 2018,
    ARRAY['AI-powered clinical documentation', 'Real-time conversation transcription', 'EHR integration (Epic, Oracle Health)', 'Structured note generation', 'Multi-specialty support'],
    ARRAY['Dramatically reduces documentation burden', 'Integrated with major EHR systems', 'Improves patient-doctor interaction'],
    ARRAY['Enterprise-only pricing', 'Requires institutional adoption', 'Privacy concerns with recording'],
    ARRAY['Clinical documentation automation', 'Reducing physician burnout', 'Improving patient encounters', 'EHR note generation'],
    ARRAY['Hospitals and health systems', 'Physicians', 'Healthcare administrators', 'Medical practices']
  );

  -- 42. Benchling
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Benchling',
    'benchling',
    'AI-powered R&D platform — the operating system for biotech and pharmaceutical research.',
    'Benchling is the leading cloud platform for life sciences R&D, combining electronic lab notebooks, molecular biology tools, and AI-powered insights. Used by 1000+ biotech and pharma companies to manage experiments, track samples, and accelerate research.',
    'https://www.benchling.com',
    cat_science,
    'enterprise',
    'Free academic tier. Enterprise plans for biotech/pharma.',
    4.2,
    true, false, 'published', now(),
    'Benchling', 2012,
    ARRAY['Electronic lab notebook (ELN)', 'DNA/protein sequence design tools', 'Sample and inventory management', 'AI-powered research insights', 'Regulatory compliance features'],
    ARRAY['Industry-standard for biotech R&D', 'Free for academic researchers', 'Comprehensive platform'],
    ARRAY['Complex onboarding process', 'Enterprise pricing is high', 'Overkill for small labs'],
    ARRAY['Managing biotech R&D workflows', 'DNA and protein design', 'Lab inventory tracking', 'Regulatory-compliant documentation'],
    ARRAY['Biotech companies', 'Pharmaceutical firms', 'Academic research labs', 'Bioinformatics teams']
  );

  -- ========================================
  -- AI 3D & GAME DEV (6 tools)
  -- ========================================

  -- 43. Meshy
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Meshy',
    'meshy',
    'AI 3D model generator — create textured 3D assets from text or images in minutes.',
    'Meshy generates production-ready 3D models from text descriptions or reference images. It handles both geometry and textures, outputting models in standard formats (GLB, FBX, OBJ) ready for games, AR/VR, and 3D printing. One of the fastest text-to-3D tools available.',
    'https://www.meshy.ai',
    cat_3d,
    'freemium',
    'Free tier with credits. Pro: $20/mo. Unlimited: $60/mo.',
    4.3,
    true, true, 'published', now(),
    'Meshy', 2023,
    ARRAY['Text-to-3D model generation', 'Image-to-3D conversion', 'Automatic texturing and PBR materials', 'Multiple export formats (GLB, FBX, OBJ)', 'AI texture generation for existing models'],
    ARRAY['Fast 3D model generation', 'Good quality textures', 'Multiple export formats'],
    ARRAY['Models need cleanup for production', 'Limited control over geometry', 'Credits system can be restrictive'],
    ARRAY['Game asset creation', 'Rapid prototyping 3D concepts', '3D printing model generation', 'AR/VR content creation'],
    ARRAY['Game developers', '3D artists', 'AR/VR creators', 'Product designers', 'Hobbyists']
  );

  -- 44. Tripo AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Tripo AI',
    'tripo-ai',
    'High-quality AI 3D generation — create detailed models with animation-ready topology.',
    'Tripo AI specializes in generating high-quality 3D models with clean topology suitable for animation and game engines. Its models feature proper UV mapping, PBR textures, and can be generated from text, images, or multi-view inputs.',
    'https://www.tripo3d.ai',
    cat_3d,
    'freemium',
    'Free tier with daily credits. Paid plans from $9.90/mo.',
    4.1,
    true, false, 'published', now(),
    'Tripo', 2023,
    ARRAY['Text and image to 3D generation', 'Clean animation-ready topology', 'PBR texture generation', 'Multi-view input support', 'Rigging-ready output'],
    ARRAY['Better topology than most competitors', 'Good for animation workflows', 'Affordable pricing'],
    ARRAY['Generation can be slow', 'Limited style control', 'Complex scenes not supported'],
    ARRAY['Creating 3D characters', 'Game asset prototyping', 'Animation-ready model creation', '3D content for social media'],
    ARRAY['3D animators', 'Game developers', 'Content creators', 'Digital artists']
  );

  -- 45. Spline AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Spline AI',
    'spline-ai',
    'AI-powered 3D design tool for the web — create interactive 3D experiences with prompts.',
    'Spline is a collaborative 3D design tool with built-in AI generation. Create 3D scenes, animations, and interactive web experiences using text prompts or manual tools. Export directly to web with real-time rendering and interactions.',
    'https://spline.design',
    cat_3d,
    'freemium',
    'Free tier available. Pro: $9/mo. Team plans available.',
    4.2,
    true, false, 'published', now(),
    'Spline', 2020,
    ARRAY['AI 3D generation from text prompts', 'Collaborative real-time editing', 'Web-native 3D rendering', 'Interactive 3D animations', 'React and vanilla JS export'],
    ARRAY['Best tool for web-based 3D', 'Real-time collaboration', 'Easy export to web'],
    ARRAY['Limited for production game assets', 'Performance can lag with complex scenes', 'AI generation quality varies'],
    ARRAY['Interactive website 3D elements', 'Product mockups and demos', 'Animated landing pages', 'Collaborative 3D design'],
    ARRAY['Web designers', 'Frontend developers', 'Product designers', 'Marketing teams']
  );

  -- 46. Scenario
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Scenario',
    'scenario',
    'AI art generation for games — train custom models on your art style for consistent game assets.',
    'Scenario is an AI art platform built specifically for game developers. Train custom AI models on your game''s art style, then generate consistent 2D and 3D assets that match your visual direction. Used by studios to accelerate asset production.',
    'https://www.scenario.com',
    cat_3d,
    'freemium',
    'Free tier available. Pro: $29/mo. Studio and Enterprise plans.',
    4.2,
    true, false, 'published', now(),
    'Scenario', 2022,
    ARRAY['Custom model training on your art style', 'Style-consistent asset generation', '2D sprites, textures, and concept art', 'Batch generation for production', 'API for pipeline integration'],
    ARRAY['Style consistency across assets', 'Purpose-built for game dev', 'Custom model training'],
    ARRAY['Training requires quality reference art', 'Learning curve for model training', 'Can be expensive for large teams'],
    ARRAY['Game asset generation', 'Concept art iteration', 'Texture and sprite creation', 'Maintaining visual consistency at scale'],
    ARRAY['Game studios', 'Indie game developers', 'Concept artists', 'Art directors']
  );

  -- 47. Sloyd
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Sloyd',
    'sloyd',
    'AI 3D model generator with parametric control — adjust and customize generated models.',
    'Sloyd generates 3D models from text prompts with unique parametric controls that let you adjust proportions, style, and details after generation. Models are game-ready with proper topology, UV mapping, and low poly counts.',
    'https://www.sloyd.ai',
    cat_3d,
    'freemium',
    'Free tier with credits. Pro: $12/mo. Studio: $36/mo.',
    4.0,
    true, false, 'published', now(),
    'Sloyd', 2021,
    ARRAY['Text-to-3D with parametric editing', 'Game-ready topology and UVs', 'Adjustable proportions and details', 'Low-poly optimized output', 'Unity and Unreal plugins'],
    ARRAY['Unique parametric customization', 'Game-engine ready output', 'Good low-poly optimization'],
    ARRAY['Limited to certain object categories', 'Less realistic than Meshy', 'Smaller model variety'],
    ARRAY['Game prop and item creation', 'Rapid 3D prototyping', 'Low-poly game assets', 'Customizable 3D content'],
    ARRAY['Game developers', 'Level designers', 'Indie developers', '3D hobbyists']
  );

  -- 48. CSM (Common Sense Machines)
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'CSM',
    'csm',
    'AI 3D world generation — create entire 3D scenes and environments from images or text.',
    'CSM (Common Sense Machines) generates 3D worlds and environments from single images, text descriptions, or video. Unlike tools that create single objects, CSM focuses on full scene generation with spatial understanding and environmental context.',
    'https://csm.ai',
    cat_3d,
    'freemium',
    'Free demo available. API pricing for production use.',
    3.9,
    true, false, 'published', now(),
    'Common Sense Machines', 2021,
    ARRAY['Full 3D scene generation', 'Image-to-3D world creation', 'Spatial understanding and layout', 'Video-to-3D conversion', 'API for integration'],
    ARRAY['Unique scene-level generation', 'Good spatial understanding', 'Supports multiple input types'],
    ARRAY['Still in early development', 'Quality inconsistent for complex scenes', 'Limited documentation'],
    ARRAY['Creating 3D environments', 'Virtual world prototyping', 'Scene reconstruction from photos', 'Game level design assistance'],
    ARRAY['Game developers', 'VR/AR creators', 'Architects', 'Film previsualization teams']
  );

  -- ========================================
  -- EXPAND: AI AGENTS (8 tools)
  -- ========================================

  -- 49. CrewAI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'CrewAI',
    'crewai',
    'Build teams of AI agents that collaborate — role-based multi-agent orchestration framework.',
    'CrewAI lets you create teams of AI agents, each with defined roles, goals, and tools, that collaborate to complete complex tasks. Think of it as building an AI company where each agent is a specialist that works together on projects.',
    'https://www.crewai.com',
    cat_agents,
    'open_source',
    'Open-source framework. CrewAI+ cloud platform available.',
    4.3,
    true, true, 'published', now(),
    'CrewAI', 2023,
    ARRAY['Role-based agent definition', 'Multi-agent collaboration', 'Task delegation and planning', 'Tool integration per agent', 'Sequential and hierarchical workflows'],
    ARRAY['Intuitive role-based design', 'Active community', 'Great documentation'],
    ARRAY['Can be slow with many agents', 'Debugging multi-agent flows is hard', 'Token usage adds up quickly'],
    ARRAY['Automated research teams', 'Content creation pipelines', 'Data analysis workflows', 'Customer service automation'],
    ARRAY['AI developers', 'Automation engineers', 'Technical founders', 'AI researchers']
  );

  -- 50. AutoGPT
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'AutoGPT',
    'autogpt',
    'The original autonomous AI agent — set a goal and let it plan and execute independently.',
    'AutoGPT pioneered the autonomous AI agent concept. Give it a goal in natural language and it will create a plan, execute steps, browse the web, write code, and iterate until the goal is achieved. Now evolved into a full agent platform with a visual builder.',
    'https://agpt.co',
    cat_agents,
    'open_source',
    'Open-source. Cloud platform with free and paid tiers.',
    4.0,
    true, true, 'published', now(),
    'AutoGPT', 2023,
    ARRAY['Autonomous goal-driven execution', 'Web browsing and research', 'Code writing and execution', 'Visual agent builder', 'Plugin ecosystem'],
    ARRAY['Pioneered autonomous AI agents', 'Full task autonomy', 'Active open-source community'],
    ARRAY['Can get stuck in loops', 'Expensive in API tokens', 'Results can be unpredictable'],
    ARRAY['Automated web research', 'Code project generation', 'Market analysis', 'Autonomous task completion'],
    ARRAY['AI enthusiasts', 'Developers', 'Researchers', 'Experimenters']
  );

  -- 51. LangChain
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'LangChain',
    'langchain',
    'The most popular framework for building LLM applications — chains, agents, and RAG made easy.',
    'LangChain is the dominant open-source framework for building applications with large language models. It provides composable components for chains, agents, RAG, memory, and tool use. Available in Python and JavaScript with LangSmith for observability.',
    'https://www.langchain.com',
    cat_agents,
    'open_source',
    'Open-source framework. LangSmith: free tier + paid plans.',
    4.4,
    true, true, 'published', now(),
    'LangChain', 2022,
    ARRAY['Composable LLM application framework', 'Agent and tool use support', 'RAG and retrieval pipelines', 'LangSmith for debugging and monitoring', 'Python and JavaScript SDKs'],
    ARRAY['Largest LLM framework ecosystem', 'Excellent documentation', 'Huge integration library'],
    ARRAY['Can be over-abstracted for simple tasks', 'Frequent breaking changes', 'Learning curve for the full framework'],
    ARRAY['Building RAG applications', 'Creating AI agents', 'LLM application development', 'Prototyping AI workflows'],
    ARRAY['AI developers', 'Backend engineers', 'Data scientists', 'AI startups']
  );

  -- 52. LlamaIndex
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'LlamaIndex',
    'llamaindex',
    'The data framework for LLM apps — connect your data to AI with powerful indexing and retrieval.',
    'LlamaIndex specializes in connecting LLMs to your data. It provides tools for data ingestion, indexing, and retrieval that power production RAG applications. If LangChain is the Swiss Army knife, LlamaIndex is the precision tool for data-heavy AI apps.',
    'https://www.llamaindex.ai',
    cat_agents,
    'open_source',
    'Open-source framework. LlamaCloud for managed services.',
    4.3,
    true, false, 'published', now(),
    'LlamaIndex', 2022,
    ARRAY['Data connectors for 160+ sources', 'Advanced indexing strategies', 'Production-grade RAG pipelines', 'Agent framework with tool use', 'LlamaCloud for managed parsing'],
    ARRAY['Best-in-class for data and RAG', 'Great data connector library', 'Clean API design'],
    ARRAY['Narrower scope than LangChain', 'Less community content', 'Complex for simple use cases'],
    ARRAY['Enterprise knowledge bases', 'Document Q&A systems', 'Data-heavy AI applications', 'RAG pipeline development'],
    ARRAY['Data engineers', 'AI developers', 'Enterprise teams', 'RAG specialists']
  );

  -- 53. Phidata
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Phidata',
    'phidata',
    'Build production-ready AI agents with memory, knowledge, and tools in pure Python.',
    'Phidata is a framework for building AI agents that combine LLMs with memory, knowledge bases, and tools. It focuses on production readiness with built-in monitoring, evaluation, and deployment features. Write agents in pure Python without complex abstractions.',
    'https://www.phidata.com',
    cat_agents,
    'open_source',
    'Open-source. Cloud platform for monitoring and deployment.',
    4.1,
    true, false, 'published', now(),
    'Phidata', 2023,
    ARRAY['Pure Python agent framework', 'Built-in memory and knowledge', 'Production monitoring tools', 'Pre-built agent templates', 'Multi-model support'],
    ARRAY['Clean Pythonic API', 'Production-focused features', 'Good starter templates'],
    ARRAY['Smaller community than LangChain', 'Less documentation', 'Fewer integrations'],
    ARRAY['Building production AI agents', 'Knowledge-base powered assistants', 'Multi-tool AI workflows', 'Enterprise agent deployment'],
    ARRAY['Python developers', 'AI engineers', 'Backend developers', 'Startups']
  );

  -- 54. SuperAGI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'SuperAGI',
    'superagi',
    'Open-source autonomous AI agent framework with a graphical interface for managing agents.',
    'SuperAGI is an open-source framework for building, managing, and running autonomous AI agents. It provides a web-based GUI for creating agents, monitoring their execution, and managing tools. Supports concurrent agent runs with resource management.',
    'https://superagi.com',
    cat_agents,
    'open_source',
    'Free and open-source. Cloud platform available.',
    3.9,
    true, false, 'published', now(),
    'SuperAGI', 2023,
    ARRAY['Web GUI for agent management', 'Concurrent agent execution', 'Tool marketplace', 'Performance telemetry', 'Resource management'],
    ARRAY['Visual agent management interface', 'Good for running multiple agents', 'Active development'],
    ARRAY['Setup can be complex', 'Resource intensive', 'Documentation gaps'],
    ARRAY['Running multiple autonomous agents', 'Agent experimentation', 'Automated workflow management', 'AI research'],
    ARRAY['AI researchers', 'Developers', 'Automation enthusiasts', 'Technical teams']
  );

  -- 55. AgentGPT
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'AgentGPT',
    'agentgpt',
    'Deploy autonomous AI agents from your browser — no code, no setup, just set a goal.',
    'AgentGPT lets you deploy autonomous AI agents directly in your browser. Name your agent, give it a goal, and watch it plan and execute tasks. No coding or setup required — the most accessible way to experience autonomous AI agents.',
    'https://agentgpt.reworkd.ai',
    cat_agents,
    'open_source',
    'Free to use in browser. Open-source for self-hosting.',
    3.8,
    true, false, 'published', now(),
    'Reworkd', 2023,
    ARRAY['Browser-based agent deployment', 'No-code agent creation', 'Goal-driven task execution', 'Real-time execution visibility', 'Self-hostable'],
    ARRAY['Zero setup required', 'Accessible to non-developers', 'Free to use'],
    ARRAY['Limited capabilities vs code-based agents', 'Can be unreliable for complex tasks', 'Basic tool access'],
    ARRAY['Trying autonomous AI agents', 'Simple automated research', 'Task planning exploration', 'AI agent demonstrations'],
    ARRAY['AI curious users', 'Non-technical professionals', 'Students', 'Educators']
  );

  -- 56. BabyAGI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'BabyAGI',
    'babyagi',
    'Minimalist task-driven autonomous agent — elegant simplicity for AI agent research.',
    'BabyAGI is a minimalist autonomous agent that creates, prioritizes, and executes tasks using LLMs. Created by Yohei Nakajima, its elegant simplicity (originally just 140 lines of code) makes it perfect for understanding how autonomous agents work and for research.',
    'https://babyagi.org',
    cat_agents,
    'open_source',
    'Free and open-source.',
    3.7,
    true, false, 'published', now(),
    'Yohei Nakajima', 2023,
    ARRAY['Task creation and prioritization loop', 'Minimalist and educational codebase', 'Vector store integration', 'Extensible architecture', 'Framework for agent research'],
    ARRAY['Elegant and educational design', 'Great for learning agent concepts', 'Easy to extend and modify'],
    ARRAY['Limited practical capabilities', 'More research tool than production tool', 'Minimal built-in tools'],
    ARRAY['Learning about AI agents', 'Agent architecture research', 'Prototyping agent concepts', 'Educational demonstrations'],
    ARRAY['AI researchers', 'Students', 'Agent framework developers', 'Educators']
  );

  -- ========================================
  -- EXPAND: CODING & DEVELOPMENT (8 tools)
  -- ========================================

  -- 57. Tabnine
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Tabnine',
    'tabnine',
    'AI code assistant with privacy-first approach — runs on your infrastructure, trained on permissive code only.',
    'Tabnine is an AI code completion tool that prioritizes privacy and IP safety. Unlike competitors, its models are trained only on permissive open-source code, and it can run entirely on your infrastructure. Supports 30+ languages across all major IDEs.',
    'https://www.tabnine.com',
    cat_coding,
    'freemium',
    'Free basic tier. Pro: $12/mo. Enterprise with self-hosting.',
    4.1,
    true, false, 'published', now(),
    'Tabnine', 2018,
    ARRAY['Privacy-first AI code completion', 'Trained on permissive code only', 'Self-hosted deployment option', '30+ language support', 'All major IDE integrations'],
    ARRAY['Best for IP-sensitive environments', 'Can be self-hosted', 'No code sent to cloud'],
    ARRAY['Less capable than Copilot for complex tasks', 'Smaller model than competitors', 'Enterprise pricing is high'],
    ARRAY['Enterprise code completion', 'IP-safe AI assistance', 'Air-gapped development environments', 'Privacy-conscious coding'],
    ARRAY['Enterprise developers', 'Security-conscious teams', 'Government contractors', 'Large corporations']
  );

  -- 58. Amazon Q Developer
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Amazon Q Developer',
    'amazon-q-developer',
    'AWS-native AI coding assistant — code completion, transformation, and AWS expertise built in.',
    'Amazon Q Developer (formerly CodeWhisperer) is AWS''s AI coding assistant. It provides code suggestions, security scanning, and deep AWS service expertise. Unique features include code transformation for Java upgrades and .NET porting, plus natural AWS infrastructure knowledge.',
    'https://aws.amazon.com/q/developer/',
    cat_coding,
    'freemium',
    'Free tier with code suggestions. Pro: $19/user/mo with advanced features.',
    4.2,
    true, false, 'published', now(),
    'Amazon Web Services', 2023,
    ARRAY['AI code completion and generation', 'Security vulnerability scanning', 'Code transformation (Java/NET upgrades)', 'Deep AWS service knowledge', 'IDE and CLI integration'],
    ARRAY['Best for AWS-heavy workflows', 'Free tier is generous', 'Strong security scanning'],
    ARRAY['AWS-centric — less useful outside AWS', 'Code quality behind Copilot', 'Limited language support vs competitors'],
    ARRAY['AWS application development', 'Java version upgrades', 'Security code scanning', 'Cloud infrastructure coding'],
    ARRAY['AWS developers', 'Java developers', 'Cloud engineers', 'DevOps teams']
  );

  -- 59. Sourcegraph Cody
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Sourcegraph Cody',
    'sourcegraph-cody',
    'AI coding assistant that understands your entire codebase — powered by code graph intelligence.',
    'Cody by Sourcegraph is an AI coding assistant that uses code graph intelligence to understand your entire codebase. Unlike tools that only see your current file, Cody searches across all your repositories to provide contextually accurate answers and code generation.',
    'https://sourcegraph.com/cody',
    cat_coding,
    'freemium',
    'Free tier available. Pro: $9/mo. Enterprise plans available.',
    4.2,
    true, false, 'published', now(),
    'Sourcegraph', 2023,
    ARRAY['Full codebase context awareness', 'Code graph intelligence', 'Multi-repository search', 'Multiple LLM model choices', 'IDE and web interface'],
    ARRAY['Best codebase-wide context', 'Searches across all repos', 'Choice of underlying LLM'],
    ARRAY['Requires Sourcegraph setup for full power', 'Newer than GitHub Copilot', 'Enterprise features locked behind paywall'],
    ARRAY['Large codebase navigation', 'Cross-repository code understanding', 'Onboarding to new codebases', 'Complex refactoring tasks'],
    ARRAY['Enterprise developers', 'Large engineering teams', 'Code reviewers', 'Technical leads']
  );

  -- 60. Aider
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Aider',
    'aider',
    'AI pair programming in your terminal — edit code across files with natural language.',
    'Aider is a command-line AI pair programming tool that can edit code across multiple files in your local git repository. It supports any LLM (GPT-4, Claude, local models) and integrates with git for safe, committable changes. The most popular terminal-based AI coding tool.',
    'https://aider.chat',
    cat_coding,
    'open_source',
    'Free and open-source. Bring your own API key.',
    4.4,
    true, true, 'published', now(),
    'Aider', 2023,
    ARRAY['Terminal-based AI pair programming', 'Multi-file editing with git integration', 'Works with any LLM provider', 'Automatic git commits', 'Voice coding support'],
    ARRAY['Best terminal AI coding experience', 'LLM-agnostic', 'Git-native workflow'],
    ARRAY['Terminal-only — no GUI', 'Requires API key costs', 'Learning curve for effective prompting'],
    ARRAY['Feature development with AI', 'Refactoring across files', 'Bug fixing with AI assistance', 'Code review and improvement'],
    ARRAY['Terminal-native developers', 'Open-source contributors', 'Full-stack developers', 'AI power users']
  );

  -- 61. Continue.dev
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Continue',
    'continue-dev',
    'Open-source AI code assistant for VS Code and JetBrains — use any model, keep your data.',
    'Continue is an open-source AI code assistant that integrates into VS Code and JetBrains IDEs. It supports any LLM provider (OpenAI, Anthropic, Ollama, etc.) and keeps you in control of your data. The open-source alternative to GitHub Copilot.',
    'https://continue.dev',
    cat_coding,
    'open_source',
    'Free and open-source. Bring your own API key or use local models.',
    4.2,
    true, false, 'published', now(),
    'Continue', 2023,
    ARRAY['Open-source Copilot alternative', 'VS Code and JetBrains integration', 'Any LLM provider support', 'Tab autocomplete', 'Custom slash commands and context providers'],
    ARRAY['Fully open-source and customizable', 'Use any model including local', 'Strong VS Code integration'],
    ARRAY['Requires configuration for best results', 'Less polished than Copilot', 'Community-supported rather than enterprise'],
    ARRAY['Private AI-assisted coding', 'Custom development workflows', 'Using local models for coding', 'Open-source alternative to Copilot'],
    ARRAY['Privacy-conscious developers', 'Open-source enthusiasts', 'Local AI users', 'Budget-conscious developers']
  );

  -- 62. Pieces for Developers
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Pieces for Developers',
    'pieces',
    'AI-powered developer productivity suite — save, search, and reuse code with context.',
    'Pieces is an AI-powered developer tool that captures, enriches, and helps you reuse code snippets with full context. It automatically adds tags, descriptions, and related links to saved code. Features a local-first architecture with optional cloud sync.',
    'https://pieces.app',
    cat_coding,
    'freemium',
    'Free tier with local processing. Pro plans for teams.',
    4.0,
    true, false, 'published', now(),
    'Pieces', 2022,
    ARRAY['AI-enriched code snippet management', 'Local-first architecture', 'Context-aware code suggestions', 'IDE, browser, and desktop integration', 'On-device AI processing'],
    ARRAY['Excellent snippet management', 'Local-first for privacy', 'Rich context preservation'],
    ARRAY['Niche use case', 'Learning curve for workflow integration', 'Premium features require subscription'],
    ARRAY['Code snippet organization', 'Developer knowledge management', 'Context-preserving code sharing', 'Cross-IDE code reuse'],
    ARRAY['Senior developers', 'Team leads', 'Full-stack developers', 'Documentation writers']
  );

  -- 63. Qodo (CodiumAI)
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Qodo',
    'qodo',
    'AI code quality agent — generates tests, reviews PRs, and ensures code integrity automatically.',
    'Qodo (formerly CodiumAI) focuses on code quality rather than just code generation. It automatically generates unit tests, reviews pull requests for issues, and suggests improvements. Think of it as an AI QA engineer for your codebase.',
    'https://www.qodo.ai',
    cat_coding,
    'freemium',
    'Free for individuals. Teams: $19/user/mo. Enterprise plans available.',
    4.1,
    true, false, 'published', now(),
    'Qodo', 2022,
    ARRAY['AI test generation', 'Pull request review automation', 'Code quality analysis', 'Coverage improvement suggestions', 'IDE and CI/CD integration'],
    ARRAY['Unique focus on code quality', 'Excellent test generation', 'Good PR review insights'],
    ARRAY['Narrower scope than full coding assistants', 'Generated tests need review', 'Premium features behind paywall'],
    ARRAY['Automated test generation', 'PR review automation', 'Code quality improvement', 'Test coverage expansion'],
    ARRAY['QA engineers', 'Backend developers', 'Team leads', 'Testing-focused teams']
  );

  -- 64. Sweep AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Sweep',
    'sweep',
    'AI junior developer — turns GitHub issues into pull requests automatically.',
    'Sweep turns GitHub issues into pull requests. Describe a bug fix or feature request in an issue, and Sweep reads your codebase, writes the code, and creates a PR with the changes. It handles simple tasks that would otherwise take a developer 15 minutes.',
    'https://sweep.dev',
    cat_coding,
    'open_source',
    'Free for open-source. Paid plans for private repos.',
    3.9,
    true, false, 'published', now(),
    'Sweep', 2023,
    ARRAY['GitHub issue to PR automation', 'Full codebase understanding', 'Automated code changes', 'Self-correcting with CI feedback', 'Natural language instructions'],
    ARRAY['Great for simple repetitive tasks', 'Tight GitHub integration', 'Free for open-source'],
    ARRAY['Limited to simpler tasks', 'PRs often need human review', 'Can misunderstand complex requirements'],
    ARRAY['Automating simple bug fixes', 'Documentation updates', 'Test additions', 'Minor feature implementations'],
    ARRAY['Open-source maintainers', 'Small development teams', 'Developers with large backlogs', 'Project managers']
  );

  -- ========================================
  -- EXPAND: RESEARCH & SEARCH (6 tools)
  -- ========================================

  -- 65. You.com
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'You.com',
    'you-com',
    'AI-powered search engine with multiple modes — research, create, code, and imagine.',
    'You.com is an AI search engine that offers multiple interaction modes: Smart (quick answers), Genius (deep research), Create (content generation), and Imagine (image creation). It combines web search with AI to provide comprehensive, sourced answers.',
    'https://you.com',
    cat_research,
    'freemium',
    'Free tier available. YouPro: $15/mo for unlimited AI features.',
    4.1,
    true, false, 'published', now(),
    'You.com', 2020,
    ARRAY['Multiple AI modes (Smart, Genius, Create)', 'Web search with AI synthesis', 'Image generation built-in', 'Code generation mode', 'Source citations'],
    ARRAY['Versatile multi-mode interface', 'Good free tier', 'Built-in image generation'],
    ARRAY['Less polished than Perplexity', 'Genius mode can be slow', 'Smaller user community'],
    ARRAY['Web research with AI', 'Quick content creation', 'Code generation queries', 'Image generation on the fly'],
    ARRAY['Researchers', 'Content creators', 'Developers', 'Students']
  );

  -- 66. Phind
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Phind',
    'phind',
    'The AI search engine for developers — get code answers with source citations instantly.',
    'Phind is an AI search engine built specifically for developers. It understands technical queries, generates code solutions, and provides answers with citations from documentation, Stack Overflow, and other developer resources. Faster than searching and reading docs.',
    'https://www.phind.com',
    cat_research,
    'freemium',
    'Free tier. Pro: $17/mo for faster models and priority.',
    4.2,
    true, false, 'published', now(),
    'Phind', 2022,
    ARRAY['Developer-focused AI search', 'Code generation with citations', 'Follow-up questions for refinement', 'VS Code extension', 'Custom Phind model'],
    ARRAY['Best search engine for coding questions', 'Fast and accurate code answers', 'Good source citations'],
    ARRAY['Limited to technical/coding queries', 'Pro needed for best model', 'Can struggle with very niche topics'],
    ARRAY['Debugging and troubleshooting', 'Learning new frameworks', 'API documentation queries', 'Code architecture questions'],
    ARRAY['Software developers', 'DevOps engineers', 'Students learning to code', 'Technical writers']
  );

  -- 67. Elicit
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Elicit',
    'elicit',
    'AI research assistant — automate literature reviews by finding and extracting data from papers.',
    'Elicit is an AI research assistant that helps researchers find relevant papers, extract key data, and synthesize findings. It automates the most tedious parts of literature reviews by searching 200M+ papers and extracting structured data from them.',
    'https://elicit.com',
    cat_research,
    'freemium',
    'Free tier with limited extractions. Plus: $10/mo. Enterprise available.',
    4.3,
    true, false, 'published', now(),
    'Elicit', 2021,
    ARRAY['Automated literature search', 'Data extraction from papers', 'Structured comparison tables', 'Abstract and finding summaries', '200M+ paper database'],
    ARRAY['Excellent for systematic reviews', 'Structured data extraction saves hours', 'Good paper relevance filtering'],
    ARRAY['Limited free tier', 'Works best for empirical research', 'Can miss important context in extraction'],
    ARRAY['Literature reviews', 'Meta-analysis data collection', 'Research trend analysis', 'Academic paper discovery'],
    ARRAY['Academic researchers', 'PhD students', 'Systematic review authors', 'Research analysts']
  );

  -- 68. Scite.ai
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'scite',
    'scite-ai',
    'Smart citations that show how papers are cited — supporting, contrasting, or mentioning.',
    'scite.ai analyzes how scientific papers cite each other, classifying citations as supporting, contrasting, or mentioning. This helps researchers understand the true impact and reliability of findings, not just citation counts.',
    'https://scite.ai',
    cat_research,
    'paid',
    'Individual: $20/mo. Team and institutional plans available.',
    4.1,
    true, false, 'published', now(),
    'scite', 2018,
    ARRAY['Smart citation analysis', 'Supporting vs. contrasting classification', 'Citation context extraction', 'AI research assistant', 'Browser extension for inline citations'],
    ARRAY['Unique citation classification', 'Reveals true scientific consensus', 'Good browser extension'],
    ARRAY['Paid-only with no free tier', 'Limited to indexed journals', 'Classification can be imprecise'],
    ARRAY['Evaluating research reliability', 'Understanding citation context', 'Literature review enhancement', 'Checking if findings are supported'],
    ARRAY['Researchers', 'Peer reviewers', 'Science journalists', 'Research librarians']
  );

  -- 69. Connected Papers
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Connected Papers',
    'connected-papers',
    'Visual graph of related research papers — discover connections between academic works.',
    'Connected Papers creates visual graphs showing how academic papers relate to each other. Enter a paper and see a network of related works, with similar papers clustered together. An intuitive way to explore a research field and find relevant literature.',
    'https://www.connectedpapers.com',
    cat_research,
    'freemium',
    'Free: 5 graphs/mo. Academic: $3/mo. Researcher: $6/mo.',
    4.0,
    true, false, 'published', now(),
    'Connected Papers', 2020,
    ARRAY['Visual paper relationship graphs', 'Similarity-based clustering', 'Prior and derivative work views', 'One-click graph from any paper', 'Export to reference managers'],
    ARRAY['Unique visual approach to literature', 'Great for exploring new fields', 'Easy to use'],
    ARRAY['Limited free tier (5 graphs)', 'Covers only indexed papers', 'Graph can miss important connections'],
    ARRAY['Exploring research fields', 'Finding related papers', 'Literature review starting point', 'Understanding paper influence'],
    ARRAY['Graduate students', 'Researchers', 'Science writers', 'Academics']
  );

  -- 70. Tavily
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Tavily',
    'tavily',
    'Search API built for AI agents — get clean, structured web data optimized for LLM consumption.',
    'Tavily provides a search API specifically designed for AI agents and LLM applications. Unlike traditional search APIs, it returns clean, structured content optimized for AI consumption, with automatic content extraction and relevance scoring.',
    'https://tavily.com',
    cat_research,
    'freemium',
    'Free: 1000 searches/mo. Paid plans for higher volume.',
    4.1,
    true, false, 'published', now(),
    'Tavily', 2023,
    ARRAY['Search API optimized for AI agents', 'Clean structured content extraction', 'Relevance scoring and filtering', 'Works with LangChain and CrewAI', 'Fast response times'],
    ARRAY['Purpose-built for AI applications', 'Clean data extraction', 'Great free tier'],
    ARRAY['API-only — no consumer product', 'Less comprehensive than Google', 'Niche use case'],
    ARRAY['Adding web search to AI agents', 'RAG with live web data', 'AI-powered research tools', 'LLM application development'],
    ARRAY['AI agent developers', 'LangChain/CrewAI users', 'RAG developers', 'AI product builders']
  );

  -- ========================================
  -- EXPAND: VIDEO & AUDIO (10 tools)
  -- ========================================

  -- 71. D-ID
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'D-ID',
    'd-id',
    'AI video avatars — create talking head videos from a single photo and script.',
    'D-ID creates realistic talking head videos from a single photo and text or audio input. Upload any face photo, provide a script, and get a video of that person speaking naturally. Used for training videos, marketing, and customer service.',
    'https://www.d-id.com',
    cat_video,
    'freemium',
    'Free trial. Lite: $5.90/mo. Pro: $49/mo. Enterprise available.',
    4.2,
    true, false, 'published', now(),
    'D-ID', 2017,
    ARRAY['Photo-to-video avatar creation', 'Text-to-speech with lip sync', 'Multiple language support', 'Real-time streaming API', 'Custom avatar training'],
    ARRAY['Very realistic talking avatars', 'Easy to use', 'Good API for integration'],
    ARRAY['Uncanny valley effect sometimes', 'Limited free tier', 'Premium features expensive'],
    ARRAY['Training and onboarding videos', 'Personalized marketing content', 'Customer service avatars', 'Social media content creation'],
    ARRAY['Marketing teams', 'HR departments', 'Content creators', 'E-learning companies']
  );

  -- 72. InVideo AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'InVideo AI',
    'invideo-ai',
    'Create videos with a text prompt — AI generates script, scenes, voiceover, and music.',
    'InVideo AI generates complete videos from a single text prompt. Describe what you want, and it creates a full video with script, stock footage, voiceover, background music, and subtitles. Edit any part with natural language commands.',
    'https://invideo.io',
    cat_video,
    'freemium',
    'Free with watermark. Plus: $25/mo. Max: $60/mo.',
    4.1,
    true, false, 'published', now(),
    'InVideo', 2020,
    ARRAY['Text prompt to full video', 'AI script and voiceover generation', 'Stock footage auto-selection', 'Natural language video editing', 'Subtitle generation'],
    ARRAY['Incredibly fast video creation', 'Good for social media content', 'Natural language editing is intuitive'],
    ARRAY['Stock footage can feel generic', 'Free tier has watermarks', 'Limited creative control'],
    ARRAY['Social media video content', 'YouTube video creation', 'Marketing videos', 'Educational content'],
    ARRAY['Social media marketers', 'YouTubers', 'Small businesses', 'Content creators']
  );

  -- 73. Hailuo AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Hailuo AI',
    'hailuo-ai',
    'MiniMax''s video generation platform — create cinematic AI videos with impressive motion.',
    'Hailuo AI (by MiniMax) generates high-quality videos from text and image prompts. Known for natural motion, cinematic quality, and the ability to handle complex scenes with multiple subjects. One of the top competitors to Runway and Sora.',
    'https://hailuoai.video',
    cat_video,
    'freemium',
    'Free tier with daily credits. Premium plans available.',
    4.2,
    true, false, 'published', now(),
    'MiniMax', 2024,
    ARRAY['High-quality text-to-video', 'Image-to-video animation', 'Natural motion and physics', 'Cinematic camera movements', 'Multiple subjects handling'],
    ARRAY['Impressive video quality', 'Good free tier', 'Natural motion'],
    ARRAY['Generation can be slow', 'Less control than Runway', 'Newer with smaller community'],
    ARRAY['AI video creation', 'Social media content', 'Concept visualization', 'Creative experimentation'],
    ARRAY['Content creators', 'Filmmakers', 'Social media marketers', 'AI art enthusiasts']
  );

  -- 74. Haiper
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Haiper',
    'haiper',
    'AI video generation with intuitive controls — create, animate, and transform videos effortlessly.',
    'Haiper makes AI video generation accessible with simple controls for text-to-video, image animation, and video transformation. Founded by Google DeepMind alumni, it focuses on quality and ease of use for creating short-form video content.',
    'https://haiper.ai',
    cat_video,
    'freemium',
    'Free tier with credits. Paid plans for more generations.',
    4.0,
    true, false, 'published', now(),
    'Haiper', 2023,
    ARRAY['Text-to-video generation', 'Image animation', 'Video-to-video transformation', 'Simple intuitive interface', 'Short-form video focus'],
    ARRAY['Very easy to use', 'Good quality for free tier', 'Founded by DeepMind veterans'],
    ARRAY['Limited video length', 'Fewer features than Runway', 'Smaller community'],
    ARRAY['Quick video content creation', 'Social media clips', 'Image animation', 'Creative experimentation'],
    ARRAY['Social media creators', 'Marketing teams', 'Hobbyists', 'Small businesses']
  );

  -- 75. Udio
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Udio',
    'udio',
    'AI music generation that rivals real recordings — create full songs with vocals in any genre.',
    'Udio generates remarkably realistic music from text prompts, complete with vocals, instrumentation, and production quality that approaches professional recordings. It supports any genre and can create songs up to 15 minutes long with lyrics you write or AI generates.',
    'https://www.udio.com',
    cat_video,
    'freemium',
    'Free tier with limited generations. Standard: $10/mo. Pro: $30/mo.',
    4.5,
    true, true, 'published', now(),
    'Udio', 2024,
    ARRAY['Full song generation with vocals', 'Any genre and style support', 'Custom lyrics or AI-generated', 'High-quality audio production', 'Song extension and remixing'],
    ARRAY['Best audio quality in AI music', 'Incredibly realistic vocals', 'Flexible genre support'],
    ARRAY['Copyright questions around AI music', 'Limited commercial rights on free tier', 'Can produce uncanny vocals occasionally'],
    ARRAY['Music creation and experimentation', 'Background music for content', 'Song prototyping', 'Creative exploration'],
    ARRAY['Musicians', 'Content creators', 'Podcast producers', 'Hobbyists']
  );

  -- 76. AIVA
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'AIVA',
    'aiva',
    'AI music composer for soundtracks — create emotional, cinematic music for any project.',
    'AIVA (Artificial Intelligence Virtual Artist) specializes in composing emotional soundtracks and background music. It generates music in classical, cinematic, electronic, and other styles, with fine control over mood, tempo, and instrumentation.',
    'https://www.aiva.ai',
    cat_video,
    'freemium',
    'Free tier (limited downloads). Standard: €11/mo. Pro: €33/mo.',
    4.1,
    true, false, 'published', now(),
    'AIVA Technologies', 2016,
    ARRAY['AI soundtrack composition', 'Multiple genre presets', 'Mood and style control', 'MIDI and audio export', 'Customizable instrumentation'],
    ARRAY['Excellent for background music', 'Good control over mood and style', 'Professional quality output'],
    ARRAY['No vocals capability', 'MIDI editing requires music knowledge', 'Limited to instrumental music'],
    ARRAY['Film and video soundtracks', 'Game background music', 'Podcast intros and outros', 'Corporate video scoring'],
    ARRAY['Filmmakers', 'Game developers', 'Content creators', 'Advertising agencies']
  );

  -- 77. Mubert
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Mubert',
    'mubert',
    'AI-generated royalty-free music — endless streams of original background tracks.',
    'Mubert generates royalty-free music in real-time using AI. Unlike song-based generators, it creates continuous streams of original music tailored to your mood, genre, and duration needs. Perfect for content creators who need unique, copyright-free background music.',
    'https://mubert.com',
    cat_video,
    'freemium',
    'Free tier. Creator: $14/mo. Business: $39/mo. Enterprise available.',
    3.9,
    true, false, 'published', now(),
    'Mubert', 2017,
    ARRAY['Real-time music generation', 'Royalty-free for commercial use', 'Continuous music streams', 'Mood and genre customization', 'API for app integration'],
    ARRAY['Truly royalty-free', 'Infinite unique music', 'Good API for integration'],
    ARRAY['Quality can be inconsistent', 'No vocals', 'Less control than AIVA'],
    ARRAY['Background music for videos', 'App and game soundtracks', 'Streaming background music', 'Content creation'],
    ARRAY['YouTubers', 'Streamers', 'App developers', 'Podcast producers']
  );

  -- 78. PlayHT
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'PlayHT',
    'playht',
    'Ultra-realistic AI voice generator — clone voices and create lifelike speech in 142 languages.',
    'PlayHT generates ultra-realistic speech using AI voice cloning technology. Create natural-sounding voiceovers, clone any voice with just 30 seconds of audio, and generate speech in 142 languages. One of the most natural-sounding TTS platforms available.',
    'https://play.ht',
    cat_video,
    'freemium',
    'Free tier. Creator: $31.20/mo. Pro: $49.50/mo. Enterprise available.',
    4.2,
    true, false, 'published', now(),
    'PlayHT', 2022,
    ARRAY['Ultra-realistic text-to-speech', 'Voice cloning from 30 seconds', '142 language support', 'Real-time streaming API', 'Emotion and style controls'],
    ARRAY['Very natural voice quality', 'Fast voice cloning', 'Wide language support'],
    ARRAY['Higher priced than some competitors', 'Voice cloning raises ethical concerns', 'Some voices better than others'],
    ARRAY['Voiceover production', 'Podcast creation', 'E-learning narration', 'Voice cloning for content'],
    ARRAY['Content creators', 'E-learning companies', 'Podcast producers', 'Marketing teams']
  );

  -- 79. Deepgram
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Deepgram',
    'deepgram',
    'Fastest AI speech-to-text API — real-time transcription with industry-leading accuracy.',
    'Deepgram provides the fastest and most accurate speech-to-text API, processing audio in real-time with sub-300ms latency. It also offers text-to-speech and audio intelligence features like summarization, topic detection, and sentiment analysis.',
    'https://deepgram.com',
    cat_video,
    'freemium',
    'Free: $200 credit. Pay-as-you-go: $0.0043/min for Nova-2.',
    4.3,
    true, false, 'published', now(),
    'Deepgram', 2015,
    ARRAY['Real-time speech-to-text', 'Sub-300ms transcription latency', 'Text-to-speech (Aura model)', 'Audio intelligence (summary, sentiment)', '36+ language support'],
    ARRAY['Fastest transcription API', 'Excellent accuracy', 'Generous free credits'],
    ARRAY['API-only — no consumer product', 'Fewer languages than Google', 'Pricing adds up at scale'],
    ARRAY['Real-time transcription', 'Call center analytics', 'Voice-enabled applications', 'Meeting transcription'],
    ARRAY['Developers building voice apps', 'Call center operators', 'Media companies', 'Accessibility teams']
  );

  -- 80. Murf AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Murf AI',
    'murf-ai',
    'AI voice studio — professional voiceovers with 200+ voices in 20+ languages.',
    'Murf AI is a comprehensive AI voice studio offering 200+ realistic voices for voiceovers. It includes a full video editor, voice cloning, and translation features. Popular for creating training videos, marketing content, and presentations with professional narration.',
    'https://murf.ai',
    cat_video,
    'freemium',
    'Free trial. Creator: $23/mo. Business: $79/mo. Enterprise available.',
    4.1,
    true, false, 'published', now(),
    'Murf AI', 2020,
    ARRAY['200+ AI voices in 20+ languages', 'Built-in video editor', 'Voice cloning capability', 'Voice translation', 'Emotion and tone controls'],
    ARRAY['Large voice library', 'All-in-one video and voice tool', 'Good enterprise features'],
    ARRAY['Some voices sound robotic', 'Expensive for individuals', 'Limited free trial'],
    ARRAY['Corporate training videos', 'Marketing voiceovers', 'E-learning content', 'Presentation narration'],
    ARRAY['L&D teams', 'Marketing departments', 'E-learning creators', 'Corporate communications']
  );

  -- ========================================
  -- EXPAND: IMAGE GENERATION (6 tools)
  -- ========================================

  -- 81. Flux (Black Forest Labs)
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Flux',
    'flux',
    'Next-gen open-source image model — the Stable Diffusion successor with stunning quality.',
    'Flux by Black Forest Labs (founded by Stable Diffusion creators) is a next-generation image generation model that produces remarkably high-quality images. With excellent text rendering, prompt adherence, and photorealistic output, it''s becoming the open-source image gen standard.',
    'https://blackforestlabs.ai',
    cat_image,
    'freemium',
    'Open-source models free. API: pay-per-image. Pro models available.',
    4.6,
    true, true, 'published', now(),
    'Black Forest Labs', 2024,
    ARRAY['Multiple model tiers (Schnell, Dev, Pro)', 'Excellent text rendering in images', 'Superior prompt adherence', 'Open-source base models', 'LoRA fine-tuning support'],
    ARRAY['Best open-source image quality', 'Excellent at text in images', 'Active community and fine-tunes'],
    ARRAY['Pro models require API payment', 'Large model size', 'Newer ecosystem than Stable Diffusion'],
    ARRAY['High-quality image generation', 'Images with readable text', 'Creative and commercial art', 'Fine-tuned model creation'],
    ARRAY['Digital artists', 'Designers', 'Content creators', 'AI art enthusiasts']
  );

  -- 82. Playground AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Playground',
    'playground-ai',
    'Free AI image generation with a powerful canvas — create, edit, and mix images effortlessly.',
    'Playground (formerly Playground AI) offers a generous free tier for AI image generation with a canvas-based editor. It combines multiple AI models with editing tools for inpainting, outpainting, and image mixing in an intuitive web interface.',
    'https://playground.com',
    cat_image,
    'freemium',
    'Free: 100 images/day. Pro: $15/mo for faster generation.',
    4.1,
    true, false, 'published', now(),
    'Playground', 2022,
    ARRAY['Generous free image generation', 'Canvas-based image editor', 'Multiple model support', 'Inpainting and outpainting', 'Community gallery and sharing'],
    ARRAY['Very generous free tier', 'Intuitive canvas editor', 'Good for beginners'],
    ARRAY['Quality behind Midjourney', 'Limited control for advanced users', 'Slower generation on free tier'],
    ARRAY['Daily image generation needs', 'Social media graphics', 'Image editing and manipulation', 'Learning AI image generation'],
    ARRAY['Social media creators', 'Hobbyists', 'Small businesses', 'Beginners in AI art']
  );

  -- 83. NightCafe
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'NightCafe',
    'nightcafe',
    'AI art community with multiple generation methods — Stable Diffusion, DALL-E, and more.',
    'NightCafe is an AI art platform offering multiple generation algorithms including Stable Diffusion, DALL-E, and their own models. With a strong community focus, daily challenges, and a credit-based system, it''s as much a community as it is a tool.',
    'https://nightcafe.studio',
    cat_image,
    'freemium',
    'Free daily credits. AI Beginner: $5.99/mo. AI Hobbyist: $9.99/mo. AI Enthusiast: $19.99/mo.',
    3.9,
    true, false, 'published', now(),
    'NightCafe', 2019,
    ARRAY['Multiple AI models available', 'Daily creation challenges', 'Community gallery and voting', 'Credit-based generation', 'Print-on-demand integration'],
    ARRAY['Great community and challenges', 'Multiple model options', 'Print integration for selling art'],
    ARRAY['Credit system can be limiting', 'Interface feels cluttered', 'Quality varies by model'],
    ARRAY['AI art creation', 'Community challenges', 'Selling AI art prints', 'Experimenting with different models'],
    ARRAY['AI art hobbyists', 'Digital artists', 'Community-oriented creators', 'Print-on-demand sellers']
  );

  -- 84. Clipdrop
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Clipdrop',
    'clipdrop',
    'AI image editing toolkit by Stability AI — background removal, upscaling, and generation.',
    'Clipdrop (by Stability AI) provides a suite of AI-powered image tools: background removal, image upscaling, object removal, relighting, and Stable Diffusion generation. A practical toolkit for everyday image editing tasks powered by AI.',
    'https://clipdrop.co',
    cat_image,
    'freemium',
    'Free basic tools. Pro: $9/mo for unlimited access.',
    4.0,
    true, false, 'published', now(),
    'Stability AI', 2020,
    ARRAY['AI background removal', 'Image upscaling (4x)', 'Object and text removal', 'AI relighting', 'Stable Diffusion image generation'],
    ARRAY['Great practical image tools', 'Fast and accurate background removal', 'Affordable Pro tier'],
    ARRAY['Image generation not best-in-class', 'Some tools better as standalone apps', 'Stability AI''s uncertain future'],
    ARRAY['Quick background removal', 'Product photo editing', 'Image enhancement', 'Social media asset creation'],
    ARRAY['E-commerce sellers', 'Social media managers', 'Photographers', 'Designers']
  );

  -- 85. Tensor.Art
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Tensor.Art',
    'tensor-art',
    'Free AI image platform with massive model library — community-driven with 100K+ custom models.',
    'Tensor.Art is a free AI image generation platform with a massive library of 100K+ community-uploaded custom models (LoRAs, checkpoints). It offers powerful generation with advanced controls like ControlNet, and a vibrant community sharing models and creations.',
    'https://tensor.art',
    cat_image,
    'freemium',
    'Generous free daily credits. VIP plans for more features.',
    4.0,
    true, false, 'published', now(),
    'Tensor.Art', 2023,
    ARRAY['100K+ community models and LoRAs', 'Advanced controls (ControlNet, etc.)', 'Free daily generation credits', 'Model training platform', 'Active community'],
    ARRAY['Massive model library', 'Generous free tier', 'Advanced generation controls'],
    ARRAY['Can be overwhelming for beginners', 'Model quality varies widely', 'Interface is complex'],
    ARRAY['Custom model generation', 'Character-consistent art', 'Style-specific image creation', 'LoRA model experimentation'],
    ARRAY['AI art enthusiasts', 'Anime/character artists', 'Model creators', 'Community artists']
  );

  -- 86. Freepik AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Freepik AI',
    'freepik-ai',
    'AI image generation integrated into the world''s largest stock asset library.',
    'Freepik AI brings AI image generation into the Freepik ecosystem with tools for text-to-image, image editing, and AI-powered design. Generate images in styles matching Freepik''s vast library of vectors, photos, and illustrations.',
    'https://www.freepik.com/ai',
    cat_image,
    'freemium',
    'Free limited generations. Premium: $8.99/mo with Freepik subscription.',
    3.9,
    true, false, 'published', now(),
    'Freepik', 2023,
    ARRAY['AI image generation', 'Integrated with Freepik library', 'Multiple style options', 'AI image editor', 'Commercial license included'],
    ARRAY['Seamless with Freepik ecosystem', 'Commercial license included', 'Good style variety'],
    ARRAY['Quality behind Midjourney/DALL-E', 'Requires Freepik subscription for best value', 'Limited advanced controls'],
    ARRAY['Stock-style image creation', 'Marketing asset generation', 'Design mockups', 'Social media content'],
    ARRAY['Graphic designers', 'Marketing teams', 'Freepik users', 'Small businesses']
  );

  -- ========================================
  -- EXPAND: WRITING & CONTENT (6 tools)
  -- ========================================

  -- 87. Writesonic
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Writesonic',
    'writesonic',
    'AI writing platform with SEO focus — create blog posts, ads, and marketing copy that ranks.',
    'Writesonic is an AI content platform that creates SEO-optimized blog posts, marketing copy, ads, and more. Features Chatsonic (a ChatGPT alternative with web access) and Botsonic (custom AI chatbot builder). Strong focus on marketing and SEO content.',
    'https://writesonic.com',
    cat_writing,
    'freemium',
    'Free tier available. Pro: $20/mo. Enterprise plans available.',
    4.0,
    true, false, 'published', now(),
    'Writesonic', 2021,
    ARRAY['SEO-optimized content generation', 'Chatsonic AI chat assistant', 'Botsonic custom chatbot builder', 'Ad copy and social media content', 'Brand voice customization'],
    ARRAY['Strong SEO content features', 'Multiple tools in one platform', 'Good brand voice adaptation'],
    ARRAY['Output can be generic without editing', 'Pricing can add up with heavy use', 'Many features feel like ChatGPT wrappers'],
    ARRAY['SEO blog post creation', 'Marketing copy generation', 'Ad copy writing', 'Social media content'],
    ARRAY['Content marketers', 'SEO specialists', 'Social media managers', 'Small business owners']
  );

  -- 88. Surfer SEO
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Surfer SEO',
    'surfer-seo',
    'AI-powered SEO content optimization — data-driven content that ranks on Google.',
    'Surfer SEO combines AI writing with data-driven SEO analysis. It analyzes top-ranking pages for your keywords and provides real-time optimization scores as you write. The AI content editor ensures your articles hit the right keywords, length, and structure to rank.',
    'https://surferseo.com',
    cat_writing,
    'paid',
    'Essential: $89/mo. Scale: $129/mo. Scale AI: $219/mo.',
    4.3,
    true, false, 'published', now(),
    'Surfer', 2018,
    ARRAY['Real-time content optimization scoring', 'AI-powered content editor', 'SERP analysis and keyword research', 'Content audit for existing pages', 'AI content generation with SEO data'],
    ARRAY['Data-driven SEO optimization', 'Real-time content scoring', 'Excellent SERP analysis'],
    ARRAY['Expensive for individuals', 'Learning curve for non-SEO users', 'AI writing quality is secondary to optimization'],
    ARRAY['SEO content strategy', 'Blog post optimization', 'Content audit and refresh', 'Competitive content analysis'],
    ARRAY['SEO professionals', 'Content marketers', 'Blog managers', 'Digital marketing agencies']
  );

  -- 89. Frase
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Frase',
    'frase',
    'AI content workflow — research, outline, write, and optimize all in one place.',
    'Frase streamlines the entire content workflow from research to optimization. It analyzes top search results for your target keyword, generates content briefs, creates AI-written drafts, and provides optimization scores. An all-in-one tool for content teams.',
    'https://www.frase.io',
    cat_writing,
    'paid',
    'Solo: $15/mo. Basic: $45/mo. Team: $115/mo.',
    4.1,
    true, false, 'published', now(),
    'Frase', 2019,
    ARRAY['AI content brief generation', 'SERP research and analysis', 'AI-powered content writing', 'Content optimization scoring', 'Team collaboration features'],
    ARRAY['Great end-to-end content workflow', 'Affordable entry price', 'Excellent content briefs'],
    ARRAY['AI writing quality is average', 'Document limit on lower tiers', 'Interface can feel clunky'],
    ARRAY['Content brief creation', 'SEO article writing', 'Content planning and research', 'Team content workflows'],
    ARRAY['Content teams', 'Freelance writers', 'SEO agencies', 'Blog managers']
  );

  -- 90. Wordtune
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Wordtune',
    'wordtune',
    'AI writing companion — rewrite, rephrase, and improve your writing in real-time.',
    'Wordtune by AI21 Labs helps you rewrite and improve existing text. Instead of generating content from scratch, it focuses on making your writing clearer, more concise, or more engaging. Available as a browser extension that works everywhere you write.',
    'https://www.wordtune.com',
    cat_writing,
    'freemium',
    'Free: 10 rewrites/day. Plus: $9.99/mo. Unlimited: $14.99/mo.',
    4.0,
    true, false, 'published', now(),
    'AI21 Labs', 2020,
    ARRAY['Real-time sentence rewriting', 'Tone adjustment (casual, formal)', 'Sentence expansion and shortening', 'Browser extension for any site', 'Wordtune Read for document summaries'],
    ARRAY['Excellent for improving existing text', 'Useful browser extension', 'Natural-sounding rewrites'],
    ARRAY['Limited free tier', 'Not a full content generator', 'Sometimes changes meaning'],
    ARRAY['Improving email clarity', 'Polishing professional writing', 'Adjusting tone of content', 'Making writing more concise'],
    ARRAY['Business professionals', 'Non-native English writers', 'Email-heavy workers', 'Students']
  );

  -- 91. Rytr
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Rytr',
    'rytr',
    'Budget-friendly AI writing assistant — create content in 30+ languages with 40+ templates.',
    'Rytr is an affordable AI writing assistant that covers blog posts, emails, social media, ads, and more with 40+ use case templates. Supporting 30+ languages and multiple tones, it''s a solid choice for budget-conscious content creators.',
    'https://rytr.me',
    cat_writing,
    'freemium',
    'Free: 10K chars/mo. Saver: $9/mo. Unlimited: $29/mo.',
    3.8,
    true, false, 'published', now(),
    'Rytr', 2021,
    ARRAY['40+ content use case templates', '30+ language support', 'Multiple tone options', 'Built-in plagiarism checker', 'SEO analyzer'],
    ARRAY['Very affordable', 'Good template variety', 'Multilingual support'],
    ARRAY['Output quality below ChatGPT', 'Limited free tier', 'Templates can feel formulaic'],
    ARRAY['Quick marketing copy', 'Social media posts', 'Email drafting', 'Product descriptions'],
    ARRAY['Small businesses', 'Freelancers', 'Social media managers', 'Budget-conscious creators']
  );

  -- 92. Writer
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Writer',
    'writer',
    'Enterprise AI writing platform — custom-trained on your brand voice, style guide, and data.',
    'Writer is an enterprise AI platform that learns your brand voice, follows your style guide, and generates on-brand content at scale. It includes custom AI model training, content governance tools, and enterprise security. Used by major companies for consistent brand communications.',
    'https://writer.com',
    cat_writing,
    'enterprise',
    'Team: $18/user/mo. Enterprise: custom pricing.',
    4.2,
    true, false, 'published', now(),
    'Writer', 2020,
    ARRAY['Custom brand voice AI models', 'Style guide enforcement', 'Enterprise content governance', 'Knowledge Graph for company context', 'API and integrations'],
    ARRAY['Best for enterprise brand consistency', 'Custom AI model training', 'Strong governance and compliance'],
    ARRAY['Expensive for small teams', 'Setup requires brand documentation', 'Overkill for individuals'],
    ARRAY['Enterprise content creation', 'Brand voice standardization', 'Marketing copy at scale', 'Internal communications'],
    ARRAY['Enterprise marketing teams', 'Brand managers', 'Large content teams', 'Corporate communications']
  );

  -- ========================================
  -- EXPAND: DESIGN & CREATIVE (4 tools)
  -- ========================================

  -- 93. Figma AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Figma AI',
    'figma-ai',
    'AI-powered design features built into Figma — generate, edit, and prototype with AI assistance.',
    'Figma AI brings AI capabilities directly into the world''s most popular design tool. Generate UI designs from text, rename layers automatically, remove backgrounds, and create prototypes with AI assistance. Native integration means no workflow disruption.',
    'https://www.figma.com',
    cat_design,
    'freemium',
    'Free Figma plan includes some AI. Professional: $15/editor/mo.',
    4.4,
    true, true, 'published', now(),
    'Figma', 2024,
    ARRAY['AI-powered UI generation', 'Auto layer renaming', 'Background removal', 'AI prototype creation', 'Native Figma integration'],
    ARRAY['Built into the tool designers already use', 'No workflow disruption', 'Constantly improving'],
    ARRAY['AI features still maturing', 'Requires Figma ecosystem', 'Limited compared to standalone AI tools'],
    ARRAY['Rapid UI prototyping', 'Design asset cleanup', 'Quick mockup generation', 'Design system management'],
    ARRAY['UI/UX designers', 'Product designers', 'Design teams', 'Frontend developers']
  );

  -- 94. Framer AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Framer',
    'framer',
    'AI website builder — describe your site and get a fully designed, responsive website in seconds.',
    'Framer combines a powerful no-code website builder with AI generation. Describe your website in a sentence and get a fully designed, responsive site with real content, images, and animations. Then customize every detail with Framer''s visual editor.',
    'https://www.framer.com',
    cat_design,
    'freemium',
    'Free with Framer branding. Mini: $5/mo. Basic: $15/mo. Pro: $30/mo.',
    4.3,
    true, false, 'published', now(),
    'Framer', 2023,
    ARRAY['AI website generation from text', 'Responsive design out of the box', 'Visual no-code editor', 'Animation and interaction system', 'CMS and localization'],
    ARRAY['Fastest way to create a website', 'Beautiful default designs', 'Great animation capabilities'],
    ARRAY['Limited for complex web apps', 'Vendor lock-in for hosting', 'CMS limitations vs WordPress'],
    ARRAY['Portfolio and personal websites', 'Landing pages', 'Marketing websites', 'Startup sites'],
    ARRAY['Freelancers', 'Startups', 'Designers', 'Small businesses']
  );

  -- 95. Rive
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Rive',
    'rive',
    'Interactive animation tool with AI — create animations that respond to user input in real-time.',
    'Rive is a design tool for creating interactive animations that run in real-time on any platform. With state machines, you can create animations that respond to user input, data, and events. Used for app interfaces, games, and interactive web experiences.',
    'https://rive.app',
    cat_design,
    'freemium',
    'Free tier available. Team: $25/editor/mo. Enterprise available.',
    4.1,
    true, false, 'published', now(),
    'Rive', 2020,
    ARRAY['Interactive real-time animations', 'State machine for animation logic', 'Cross-platform runtime (web, iOS, Android)', 'Collaborative editing', 'Lightweight file output'],
    ARRAY['Best for interactive animations', 'Tiny file sizes', 'Works on every platform'],
    ARRAY['Learning curve for state machines', 'Not a general design tool', 'Niche use case'],
    ARRAY['Interactive UI animations', 'Animated icons and illustrations', 'Game UI elements', 'Loading and transition animations'],
    ARRAY['Motion designers', 'UI developers', 'Game developers', 'Product designers']
  );

  -- 96. Looka
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Looka',
    'looka',
    'AI logo maker and brand kit generator — create a complete brand identity in minutes.',
    'Looka uses AI to generate professional logos and complete brand kits. Answer a few questions about your business, pick styles you like, and get hundreds of logo options with matching brand colors, fonts, and business card designs. A full brand identity in minutes.',
    'https://looka.com',
    cat_design,
    'paid',
    'Basic Logo: $20 one-time. Premium: $65 one-time. Brand Kit: $96/year.',
    4.0,
    true, false, 'published', now(),
    'Looka', 2016,
    ARRAY['AI logo generation', 'Complete brand kit creation', 'Business card and social media designs', 'Brand guidelines document', 'Vector file exports'],
    ARRAY['Fast and affordable branding', 'Complete brand kit, not just logos', 'Good for getting started quickly'],
    ARRAY['Logos can feel generic', 'One-time purchase for basic files', 'Not suitable for established brands'],
    ARRAY['Startup branding', 'Small business logo creation', 'Side project brand identity', 'Quick brand exploration'],
    ARRAY['Startup founders', 'Small business owners', 'Side project creators', 'Freelancers']
  );

  -- ========================================
  -- EXPAND: PRODUCTIVITY (4 tools)
  -- ========================================

  -- 97. Taskade
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Taskade',
    'taskade',
    'AI-powered workspace — tasks, notes, mind maps, and AI agents all in one collaborative space.',
    'Taskade is an AI-native workspace that combines task management, notes, mind maps, and AI agents in one platform. Create AI agents that automate workflows, generate content, and manage projects. Think Notion meets AI with real-time collaboration.',
    'https://www.taskade.com',
    cat_productivity,
    'freemium',
    'Free tier available. Pro: $8/mo. Business: $16/mo per seat.',
    4.1,
    true, false, 'published', now(),
    'Taskade', 2017,
    ARRAY['AI-powered task and project management', 'Built-in AI agents for automation', 'Mind maps and flowcharts', 'Real-time collaboration', 'Templates for every use case'],
    ARRAY['All-in-one workspace', 'Built-in AI agents', 'Great real-time collaboration'],
    ARRAY['Can feel cluttered with features', 'AI agents still maturing', 'Smaller user base than Notion'],
    ARRAY['Team project management', 'AI-automated workflows', 'Brainstorming with mind maps', 'Meeting notes and action items'],
    ARRAY['Remote teams', 'Project managers', 'Small businesses', 'Freelancers']
  );

  -- 98. Mem AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Mem',
    'mem-ai',
    'AI-powered note-taking that organizes itself — just write and let AI find connections.',
    'Mem is a self-organizing note-taking app powered by AI. Instead of manually organizing notes into folders, Mem automatically surfaces relevant notes, finds connections between ideas, and helps you search with natural language. The anti-folder approach to knowledge management.',
    'https://mem.ai',
    cat_productivity,
    'freemium',
    'Free tier. Mem Plus: $9/mo. Teams plans available.',
    4.0,
    true, false, 'published', now(),
    'Mem', 2020,
    ARRAY['Self-organizing AI notes', 'Natural language search', 'Automatic connection discovery', 'Meeting and email integration', 'AI writing assistant'],
    ARRAY['No manual organization needed', 'Great for capturing thoughts quickly', 'AI connections surface hidden links'],
    ARRAY['Can feel chaotic without folders', 'Limited formatting compared to Notion', 'Smaller integration ecosystem'],
    ARRAY['Quick thought capture', 'Meeting notes', 'Knowledge management', 'Personal CRM'],
    ARRAY['Knowledge workers', 'Executives', 'Consultants', 'Writers']
  );

  -- 99. Reclaim AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Reclaim AI',
    'reclaim-ai',
    'AI calendar assistant — automatically schedules tasks, habits, and meetings around your priorities.',
    'Reclaim AI uses AI to automatically schedule your tasks, habits, and meetings in your calendar based on your priorities. It defends your focus time, finds optimal meeting slots, and adapts your schedule in real-time as things change throughout the day.',
    'https://reclaim.ai',
    cat_productivity,
    'freemium',
    'Free for individuals. Starter: $8/user/mo. Business: $12/user/mo.',
    4.2,
    true, false, 'published', now(),
    'Reclaim AI', 2019,
    ARRAY['AI-powered calendar scheduling', 'Automatic task scheduling', 'Habit and routine protection', 'Smart meeting scheduling', 'Focus time defense'],
    ARRAY['Set-it-and-forget-it scheduling', 'Great focus time protection', 'Seamless Google Calendar integration'],
    ARRAY['Google Calendar only (no Outlook)', 'Can over-schedule your day', 'Learning curve for task priorities'],
    ARRAY['Protecting focus time', 'Scheduling recurring habits', 'Team meeting coordination', 'Work-life balance management'],
    ARRAY['Busy professionals', 'Managers with many meetings', 'Remote workers', 'Entrepreneurs']
  );

  -- 100. Raycast AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Raycast',
    'raycast',
    'AI-powered launcher for Mac — Spotlight replacement with built-in AI, snippets, and automations.',
    'Raycast is a blazing-fast launcher for macOS that replaces Spotlight with AI superpowers. It includes built-in AI chat (using GPT-4, Claude, and others), custom AI commands, clipboard history, snippet expansion, and a massive extension store. The power user''s best friend on Mac.',
    'https://www.raycast.com',
    cat_productivity,
    'freemium',
    'Free base app. Pro: $8/mo for AI features. Team plans available.',
    4.5,
    true, true, 'published', now(),
    'Raycast', 2020,
    ARRAY['AI chat with multiple models', 'Custom AI commands and prompts', 'Blazing-fast app launcher', 'Clipboard history and snippets', 'Extension store with 1000+ extensions'],
    ARRAY['Incredibly fast and responsive', 'AI integrated into everything', 'Massive extension ecosystem'],
    ARRAY['Mac only', 'AI features require Pro subscription', 'Can be overwhelming with many extensions'],
    ARRAY['Quick AI queries from anywhere', 'App and file launching', 'Code snippet management', 'Custom AI workflows'],
    ARRAY['Mac developers', 'Power users', 'Designers', 'Knowledge workers']
  );

END $$;
