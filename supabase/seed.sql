-- ============================================================
-- AiCensus Seed Data
-- Run this in Supabase SQL Editor after the initial migration
-- ============================================================

-- ============================================================
-- CATEGORIES
-- ============================================================

INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Chatbots & Assistants', 'chatbots-assistants', 'AI-powered conversational assistants and chatbots for productivity, creativity, and problem-solving.', 'message-square', 0),
  ('Research & Search', 'research-search', 'AI tools that help you find, analyze, and synthesize information from across the web and documents.', 'search', 1),
  ('Coding & Development', 'coding-development', 'AI-powered coding assistants, code editors, and development tools that accelerate software engineering.', 'code', 2),
  ('Image Generation', 'image-generation', 'AI tools that create images, illustrations, and visual art from text prompts.', 'image', 3),
  ('Video & Audio', 'video-audio', 'AI tools for generating, editing, and enhancing video and audio content.', 'video', 4),
  ('Writing & Content', 'writing-content', 'AI writing assistants for copywriting, content creation, and marketing.', 'file-text', 5),
  ('Design & Creative', 'design-creative', 'AI-enhanced design tools for graphic design, presentations, and creative projects.', 'paintbrush', 6),
  ('Productivity', 'productivity', 'AI tools that boost your workflow with smart note-taking, task management, and automation.', 'brain', 7),
  ('AI Agents', 'ai-agents', 'Autonomous AI agents that can take actions, browse the web, and complete complex multi-step tasks.', 'bot', 8),
  ('Data & Analytics', 'data-analytics', 'AI tools for data analysis, visualization, and business intelligence.', 'bar-chart-3', 9);

-- ============================================================
-- TOOLS
-- ============================================================

-- Get category IDs for foreign keys
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

  -- 1. ChatGPT
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'ChatGPT',
    'chatgpt',
    'The AI assistant that started it all — conversation, creation, and coding in one place.',
    'ChatGPT by OpenAI is the world''s most popular AI assistant. Powered by GPT-4o and the o1/o3 reasoning models, it handles everything from writing and analysis to coding and image generation. With web browsing, file uploads, and custom GPTs, it''s become an indispensable daily tool for millions.',
    'https://chat.openai.com',
    cat_chatbots,
    'freemium',
    'Free tier available. Plus: $20/mo. Pro: $200/mo with o1 pro mode.',
    4.7,
    true,
    true,
    'published',
    now(),
    'OpenAI',
    2022,
    ARRAY['GPT-4o and o1/o3 reasoning models', 'Web browsing and real-time information', 'DALL-E image generation built in', 'Code interpreter and file analysis', 'Custom GPTs and plugin ecosystem'],
    ARRAY['Most versatile AI assistant available', 'Huge ecosystem of custom GPTs and plugins', 'Free tier is genuinely useful'],
    ARRAY['Can hallucinate or provide outdated information', 'Pro tier is expensive at $200/mo', 'Response quality varies between models'],
    ARRAY['Writing emails and documents', 'Coding assistance and debugging', 'Research and analysis', 'Creative brainstorming', 'Learning new topics'],
    ARRAY['Knowledge workers', 'Students and researchers', 'Software developers', 'Content creators', 'Business professionals']
  );

  -- 2. Claude
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Claude',
    'claude',
    'Anthropic''s thoughtful AI assistant — built for safety, depth, and nuanced reasoning.',
    'Claude by Anthropic excels at long-form analysis, coding, and careful reasoning. With a massive 200K context window, it can process entire codebases and long documents. Claude is known for its nuanced, well-structured responses and strong coding abilities.',
    'https://claude.ai',
    cat_chatbots,
    'freemium',
    'Free tier available. Pro: $20/mo. Team: $30/user/mo.',
    4.8,
    true,
    true,
    'published',
    now(),
    'Anthropic',
    2023,
    ARRAY['200K token context window for long documents', 'Artifacts for code, documents, and visualizations', 'Projects for organizing conversations with custom instructions', 'Strong coding and analysis capabilities', 'Claude Code CLI for terminal-based development'],
    ARRAY['Best-in-class for long document analysis', 'Exceptionally good at coding tasks', 'Thoughtful and well-structured responses'],
    ARRAY['No web browsing in free tier', 'Image generation not available', 'Smaller plugin ecosystem than ChatGPT'],
    ARRAY['Analyzing long documents and contracts', 'Software development and code review', 'Academic research and writing', 'Strategic planning and analysis'],
    ARRAY['Software developers', 'Researchers and academics', 'Writers and editors', 'Legal professionals', 'Data analysts']
  );

  -- 3. Gemini
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Gemini',
    'gemini',
    'Google''s multimodal AI — deeply integrated with Search, YouTube, Gmail, and the entire Google ecosystem.',
    'Gemini is Google''s flagship AI assistant, powered by the Gemini 2.5 model family. It excels at multimodal tasks — understanding images, generating video with Veo, and connecting seamlessly with Google Workspace. Its deep integration with Google Search gives it real-time knowledge.',
    'https://gemini.google.com',
    cat_chatbots,
    'freemium',
    'Free tier available. Advanced: $20/mo (included with Google One AI Premium).',
    4.5,
    true,
    true,
    'published',
    now(),
    'Google',
    2023,
    ARRAY['Native Google Search integration for real-time info', 'Veo video generation and Imagen image creation', 'Deep Google Workspace integration (Gmail, Docs, Drive)', '1M token context window on Advanced plan', 'Multimodal understanding of images, audio, and video'],
    ARRAY['Best Google ecosystem integration', 'Excellent at image and video generation', 'Massive context window'],
    ARRAY['Responses can feel less polished than competitors', 'Some features only available in select regions', 'Privacy concerns with Google data integration'],
    ARRAY['Google Workspace productivity', 'Image and video generation', 'Research with real-time web access', 'Summarizing YouTube videos and emails'],
    ARRAY['Google Workspace users', 'Content creators', 'Students', 'Business professionals']
  );

  -- 4. Perplexity
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Perplexity',
    'perplexity',
    'The AI-powered answer engine — search the web and get cited, trustworthy answers instantly.',
    'Perplexity is an AI search engine that provides direct answers with inline citations from real sources. Unlike traditional search, it synthesizes information from multiple sources into clear, referenced responses. It''s rapidly becoming the go-to replacement for Google for research queries.',
    'https://www.perplexity.ai',
    cat_research,
    'freemium',
    'Free tier with basic searches. Pro: $20/mo with unlimited Pro searches and file uploads.',
    4.6,
    true,
    true,
    'published',
    now(),
    'Perplexity AI',
    2022,
    ARRAY['AI-powered search with inline citations', 'Pro Search with multi-step reasoning', 'File upload and document analysis', 'Focus modes for academic, writing, and math', 'Collections for organizing research'],
    ARRAY['Always cites sources — easy to verify', 'Much faster than traditional research', 'Great free tier for basic searches'],
    ARRAY['Pro searches limited on free tier', 'Sometimes sources are low-quality', 'Cannot replace deep domain expertise'],
    ARRAY['Quick factual research', 'Comparing products and services', 'Academic research with citations', 'Market research and competitive analysis'],
    ARRAY['Researchers', 'Journalists', 'Students', 'Business analysts', 'Anyone who Googles frequently']
  );

  -- 5. NotebookLM
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'NotebookLM',
    'notebooklm',
    'Google''s AI research assistant — upload your documents and get AI-powered summaries, Q&A, and podcasts.',
    'NotebookLM is a free AI research tool by Google that''s grounded in your own documents. Upload PDFs, Google Docs, websites, and YouTube videos, and it generates summaries, answers questions with citations, creates study guides, and even produces AI podcast-style audio overviews of your content.',
    'https://notebooklm.google.com',
    cat_research,
    'free',
    'Free to use. NotebookLM Plus available through Google Workspace.',
    4.4,
    true,
    false,
    'published',
    now(),
    'Google',
    2023,
    ARRAY['Upload PDFs, Docs, websites, and YouTube videos', 'AI-generated audio overviews (podcast-style)', 'Question answering with citations from your sources', 'Automatic summary and study guide generation', 'Shared notebooks for team collaboration'],
    ARRAY['Completely free to use', 'Grounded in YOUR sources — reduces hallucination', 'Audio overview feature is uniquely useful'],
    ARRAY['Limited to uploaded sources only', 'No real-time web search', 'Audio overviews can take time to generate'],
    ARRAY['Studying for exams', 'Analyzing research papers', 'Summarizing meeting notes', 'Creating content from source material'],
    ARRAY['Students', 'Researchers', 'Content creators', 'Professionals reviewing documents']
  );

  -- 6. Cursor
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Cursor',
    'cursor',
    'The AI-first code editor — indexes your entire codebase for context-aware development.',
    'Cursor is an AI-powered code editor built on VS Code that understands your entire codebase. It can index repositories, understand file relationships, and provide intelligent suggestions that span thousands of lines. Rated 4.9/5 by developers, it''s become the editor of choice for AI-assisted coding.',
    'https://www.cursor.com',
    cat_coding,
    'freemium',
    'Free tier available. Pro: $20/mo. Business: $40/user/mo.',
    4.9,
    true,
    true,
    'published',
    now(),
    'Anysphere',
    2023,
    ARRAY['Full codebase indexing and understanding', 'AI chat with codebase context', 'Multi-file editing with Composer', 'Built on VS Code — familiar interface', 'Supports multiple AI models (GPT-4, Claude)'],
    ARRAY['Best codebase awareness of any AI editor', 'Familiar VS Code interface and extensions', 'Multi-file editing is incredibly powerful'],
    ARRAY['$20/mo can add up for hobbyists', 'High resource usage with large codebases', 'Learning curve for AI-specific features'],
    ARRAY['Full-stack web development', 'Refactoring large codebases', 'Writing tests and documentation', 'Debugging complex issues'],
    ARRAY['Professional software developers', 'Full-stack engineers', 'Open source contributors', 'Development teams']
  );

  -- 7. GitHub Copilot
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'GitHub Copilot',
    'github-copilot',
    'AI pair programmer by GitHub — real-time code suggestions right in your IDE.',
    'GitHub Copilot is an AI coding assistant that provides real-time code completions, chat-based help, and automated pull request summaries. It works inside VS Code, JetBrains, Neovim, and more. With 2,000 free completions per month, it''s accessible to every developer.',
    'https://github.com/features/copilot',
    cat_coding,
    'freemium',
    'Free: 2,000 completions/mo. Individual: $10/mo. Business: $39/user/mo.',
    4.5,
    true,
    false,
    'published',
    now(),
    'GitHub (Microsoft)',
    2021,
    ARRAY['Real-time code completion in your IDE', 'Copilot Chat for code Q&A', 'Pull request summaries and reviews', 'Works with VS Code, JetBrains, Neovim', 'Free tier with 2,000 completions/month'],
    ARRAY['Generous free tier for individuals', 'Seamless IDE integration', 'Excellent for boilerplate and repetitive code'],
    ARRAY['Less codebase-aware than Cursor', 'Suggestions can be hit-or-miss', 'Business plan is expensive'],
    ARRAY['Writing boilerplate code faster', 'Exploring unfamiliar languages', 'Generating tests and documentation', 'Code review assistance'],
    ARRAY['All software developers', 'Students learning to code', 'Open source maintainers', 'Enterprise development teams']
  );

  -- 8. Windsurf
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Windsurf',
    'windsurf',
    'AI-enhanced IDE with autonomous Cascade agent for multi-step coding tasks.',
    'Windsurf (formerly Codeium) is an AI-powered IDE acquired by OpenAI, built around an autonomous coding agent called Cascade. Instead of waiting for prompts, Cascade automatically pulls in relevant context and executes multi-step tasks — from refactoring to feature implementation — with minimal guidance.',
    'https://windsurf.com',
    cat_coding,
    'freemium',
    'Free tier available. Pro plan with enhanced features.',
    4.3,
    true,
    false,
    'published',
    now(),
    'OpenAI (acquired from Codeium)',
    2023,
    ARRAY['Cascade autonomous coding agent', 'Automatic context detection', 'Multi-step task execution', 'Built on familiar IDE interface', 'Deep integration with OpenAI models'],
    ARRAY['Autonomous agent reduces manual prompting', 'Good at multi-step refactoring tasks', 'Strong context awareness'],
    ARRAY['Relatively new — still maturing', 'Smaller community than Cursor or Copilot', 'Some features still in development'],
    ARRAY['Autonomous code refactoring', 'Feature implementation from specs', 'Multi-file changes', 'Rapid prototyping'],
    ARRAY['Software developers', 'Full-stack engineers', 'Startup developers', 'Solo developers']
  );

  -- 9. Midjourney
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Midjourney',
    'midjourney',
    'The gold standard for AI image generation — stunning photorealistic and artistic visuals from text.',
    'Midjourney is the leading AI image generator, renowned for producing the highest-quality photorealistic and artistic images from text prompts. Its latest V6 model delivers exceptional detail, lighting, and composition. Used by professional designers, artists, and content creators worldwide.',
    'https://www.midjourney.com',
    cat_image,
    'paid',
    'Basic: $10/mo. Standard: $30/mo. Pro: $60/mo. Mega: $120/mo.',
    4.8,
    true,
    true,
    'published',
    now(),
    'Midjourney Inc.',
    2022,
    ARRAY['Industry-leading image quality and aesthetics', 'V6 model with exceptional photorealism', 'Style tuning and consistent character generation', 'Web interface and Discord bot', 'Video generation support on higher tiers'],
    ARRAY['Unmatched image quality and artistic style', 'Excellent prompt understanding', 'Active creative community'],
    ARRAY['No free tier — paid only', 'Requires learning prompt engineering', 'Discord-based workflow can be clunky'],
    ARRAY['Marketing and advertising visuals', 'Concept art and illustration', 'Social media content creation', 'Product mockups and prototypes'],
    ARRAY['Graphic designers', 'Marketing teams', 'Artists and illustrators', 'Content creators', 'Game developers']
  );

  -- 10. DALL-E 3
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'DALL-E 3',
    'dall-e-3',
    'OpenAI''s image generator — create images directly inside ChatGPT with excellent text rendering.',
    'DALL-E 3 is OpenAI''s image generation model, integrated directly into ChatGPT. It excels at understanding complex prompts and accurately rendering text within images — a weakness of most competitors. The seamless ChatGPT integration means you can iterate on images conversationally.',
    'https://openai.com/dall-e-3',
    cat_image,
    'freemium',
    'Available free in ChatGPT (limited). Unlimited with ChatGPT Plus ($20/mo). API access available.',
    4.3,
    true,
    false,
    'published',
    now(),
    'OpenAI',
    2023,
    ARRAY['Integrated directly into ChatGPT', 'Best-in-class text rendering in images', 'Conversational image editing and iteration', 'Strong prompt adherence and understanding', 'API access for developers'],
    ARRAY['Seamless ChatGPT integration', 'Best text-in-image rendering', 'Easy conversational iteration'],
    ARRAY['Image quality below Midjourney', 'Limited style control', 'Strict content policies can be restrictive'],
    ARRAY['Quick social media graphics', 'Diagrams and infographics with text', 'Rapid visual prototyping', 'Educational illustrations'],
    ARRAY['ChatGPT users', 'Social media managers', 'Educators', 'Quick visual needs']
  );

  -- 11. Runway
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Runway',
    'runway',
    'The creative AI toolkit for filmmakers — video generation, editing, and VFX in one platform.',
    'Runway is the industry-leading AI video platform, offering text-to-video generation with its Gen-4 model alongside a comprehensive suite of creative tools. It combines video generation with motion tracking, inpainting, style transfer, and green screen removal — making it a complete AI filmmaking toolkit.',
    'https://runwayml.com',
    cat_video,
    'freemium',
    'Free tier available. Standard: $12/mo. Pro: $28/mo. Unlimited: $76/mo.',
    4.5,
    true,
    true,
    'published',
    now(),
    'Runway AI',
    2018,
    ARRAY['Gen-4 text-to-video generation', 'Motion tracking and inpainting', 'Video-to-video style transfer', 'Green screen and background removal', 'Image-to-video animation'],
    ARRAY['Most complete AI video toolkit', 'Professional-grade creative controls', 'Regular model improvements'],
    ARRAY['Generated videos still limited in length', 'Credits run out quickly on lower tiers', 'Steep learning curve for advanced features'],
    ARRAY['Short-form video content creation', 'Film and commercial pre-visualization', 'Social media video ads', 'Music video and art projects'],
    ARRAY['Filmmakers and video editors', 'Content creators', 'Marketing teams', 'Artists and musicians']
  );

  -- 12. Suno
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Suno',
    'suno',
    'Create full songs with AI — vocals, instruments, and lyrics from a text prompt.',
    'Suno is an AI music generator that creates complete songs — vocals, instrumentals, and lyrics — from simple text descriptions. Whether you want a country ballad or an EDM track, Suno produces surprisingly polished results. It''s democratizing music creation for everyone.',
    'https://suno.com',
    cat_video,
    'freemium',
    'Free tier with limited generations. Pro: $10/mo. Premier: $30/mo.',
    4.4,
    true,
    false,
    'published',
    now(),
    'Suno Inc.',
    2023,
    ARRAY['Full song generation with vocals and instruments', 'Multiple genre support', 'Custom lyrics or AI-generated lyrics', 'Extend and remix existing generations', 'High-quality audio output'],
    ARRAY['Surprisingly good audio quality', 'Incredibly easy to use', 'Free tier lets you experiment'],
    ARRAY['Songs can sound formulaic', 'Limited control over arrangement', 'Copyright concerns for commercial use'],
    ARRAY['Creating background music for videos', 'Songwriting inspiration and demos', 'Social media audio content', 'Personal creative projects'],
    ARRAY['Content creators', 'Musicians seeking inspiration', 'Podcasters', 'Social media creators', 'Hobbyists']
  );

  -- 13. ElevenLabs
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'ElevenLabs',
    'elevenlabs',
    'The most realistic AI voices — text-to-speech, voice cloning, and dubbing that sounds human.',
    'ElevenLabs is the clear leader in AI voice generation, producing speech that''s nearly indistinguishable from real humans. It offers text-to-speech in 29+ languages, voice cloning from short samples, and professional dubbing. Used by creators, audiobook producers, and enterprises worldwide.',
    'https://elevenlabs.io',
    cat_video,
    'freemium',
    'Free tier: 10,000 chars/mo. Starter: $5/mo. Creator: $22/mo. Pro: $99/mo.',
    4.7,
    true,
    true,
    'published',
    now(),
    'ElevenLabs',
    2022,
    ARRAY['Most realistic AI text-to-speech available', 'Voice cloning from short audio samples', 'AI dubbing in 29+ languages', 'Projects for long-form audio (audiobooks)', 'API for developers'],
    ARRAY['Industry-best voice quality', 'Excellent multilingual support', 'Easy voice cloning setup'],
    ARRAY['Free tier is very limited', 'Higher tiers get expensive', 'Voice cloning raises ethical concerns'],
    ARRAY['Audiobook production', 'Video voiceovers and narration', 'Podcast production', 'Accessibility features', 'Content localization'],
    ARRAY['Content creators', 'Audiobook publishers', 'Filmmakers', 'Game developers', 'Accessibility teams']
  );

  -- 14. HeyGen
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'HeyGen',
    'heygen',
    'Create professional AI avatar videos — 700+ realistic avatars, 4K output, real-time interaction.',
    'HeyGen is an AI video platform that creates professional-quality videos using hyper-realistic AI avatars. With 700+ stock avatars, 4K resolution, and support for 40+ languages, it''s become the go-to for businesses creating training videos, marketing content, and personalized messages at scale.',
    'https://www.heygen.com',
    cat_video,
    'freemium',
    'Free trial available. Creator: $29/mo. Business: $89/mo. Enterprise: custom.',
    4.3,
    true,
    false,
    'published',
    now(),
    'HeyGen',
    2020,
    ARRAY['700+ realistic AI avatars', '4K video output', '40+ language support with lip sync', 'Custom avatar creation from your own video', 'Interactive avatars for real-time responses'],
    ARRAY['Very realistic avatar quality', 'Easy for non-technical users', 'Extensive language and avatar library'],
    ARRAY['Avatars can still look uncanny in some cases', 'Limited creative control vs traditional video', 'Higher tiers needed for serious use'],
    ARRAY['Corporate training videos', 'Product demos and explainers', 'Personalized sales outreach', 'Multilingual content creation'],
    ARRAY['Marketing teams', 'HR and training departments', 'Sales teams', 'E-learning creators']
  );

  -- 15. Kling AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Kling AI',
    'kling-ai',
    'AI video generation with 2-minute clips — the best quality-to-price ratio in the market.',
    'Kling AI is a powerful AI video generator developed by Kuaishou Technology, offering some of the longest AI-generated clips at up to 2 minutes. Its Kling 2.6 model competes directly with Sora and Runway on cinematic realism, while offering significantly better pricing.',
    'https://klingai.com',
    cat_video,
    'freemium',
    'Free tier: 66 daily credits. Pro plans from $6.99/mo to $180/mo.',
    4.2,
    true,
    false,
    'published',
    now(),
    'Kuaishou Technology',
    2024,
    ARRAY['Up to 2-minute AI video generation', 'Kling 2.6 model with cinematic realism', 'Free daily credits for experimentation', 'Image-to-video and text-to-video', 'Competitive pricing starting at $6.99/mo'],
    ARRAY['Longest AI video clips available', 'Generous free tier with daily credits', 'Excellent price-to-quality ratio'],
    ARRAY['Interface can be confusing', 'Less creative control than Runway', 'Newer platform with smaller community'],
    ARRAY['Social media video content', 'Short film experimentation', 'Marketing video prototypes', 'Creative exploration'],
    ARRAY['Content creators', 'Social media marketers', 'Indie filmmakers', 'Budget-conscious creators']
  );

  -- 16. Jasper
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Jasper',
    'jasper',
    'Enterprise AI writing platform — brand-consistent content at scale with team collaboration.',
    'Jasper is an enterprise-focused AI writing platform built for marketing teams. Its standout feature is brand voice training — feed it your content samples and it adapts tone and style to match your brand. With team workflows, campaign management, and 50+ templates, it''s designed for professional content operations.',
    'https://www.jasper.ai',
    cat_writing,
    'paid',
    'Creator: $49/mo. Pro: $69/mo. Business: custom pricing.',
    4.1,
    true,
    false,
    'published',
    now(),
    'Jasper AI',
    2021,
    ARRAY['Brand voice training and consistency', 'Team collaboration workflows', '50+ content templates', 'Campaign management tools', 'SEO optimization features'],
    ARRAY['Best brand voice consistency', 'Purpose-built for marketing teams', 'Strong template library'],
    ARRAY['Expensive compared to using ChatGPT directly', 'No free tier available', 'Can feel over-engineered for simple tasks'],
    ARRAY['Blog posts and long-form content', 'Social media content at scale', 'Email marketing campaigns', 'Ad copy and landing pages'],
    ARRAY['Marketing teams', 'Content agencies', 'Enterprise marketing departments', 'Professional copywriters']
  );

  -- 17. Copy.ai
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Copy.ai',
    'copy-ai',
    'Fast AI copywriting for social media, ads, and short-form content — with a generous free tier.',
    'Copy.ai is a streamlined AI writing tool focused on short-form copywriting. It excels at quickly generating social media posts, ad copy, email subject lines, and product descriptions. With the simplest interface in the category and a generous free plan, it''s the easiest way to start with AI writing.',
    'https://www.copy.ai',
    cat_writing,
    'freemium',
    'Free plan available. Pro: $49/mo. Enterprise: custom.',
    4.0,
    true,
    false,
    'published',
    now(),
    'Copy.ai',
    2020,
    ARRAY['90+ copywriting templates', 'Brand voice customization', 'Bulk content generation', 'Workflow automation for go-to-market teams', 'Generous free tier'],
    ARRAY['Simplest interface in the category', 'Great free tier to get started', 'Fast generation for short-form content'],
    ARRAY['Less suited for long-form content', 'Output quality varies', 'Advanced features locked behind Pro plan'],
    ARRAY['Social media post generation', 'Ad copy and headlines', 'Product descriptions', 'Email subject lines'],
    ARRAY['Social media managers', 'Small business owners', 'Freelance writers', 'E-commerce managers']
  );

  -- 18. Canva
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Canva',
    'canva',
    'Design platform with 25+ AI tools — Magic Studio makes everyone a designer.',
    'Canva has evolved from a simple design tool into an AI-powered creative platform. Magic Studio bundles 25+ AI features including Magic Write (AI text), Magic Media (text-to-image and text-to-video), Magic Edit (AI photo editing), and Magic Animate. With millions of templates, it makes professional design accessible to everyone.',
    'https://www.canva.com',
    cat_design,
    'freemium',
    'Free plan with AI features. Pro: $15/mo. Teams: $10/user/mo. Enterprise: custom.',
    4.5,
    true,
    true,
    'published',
    now(),
    'Canva',
    2013,
    ARRAY['Magic Studio with 25+ AI tools', 'Magic Write AI text generation', 'Magic Media text-to-image and text-to-video', 'Millions of professional templates', 'Real-time team collaboration'],
    ARRAY['Incredibly easy for non-designers', 'Free tier is surprisingly powerful', 'Massive template library'],
    ARRAY['AI features not as advanced as specialized tools', 'Can feel limiting for professional designers', 'Some AI features require Pro plan'],
    ARRAY['Social media graphics', 'Presentations and pitch decks', 'Marketing materials and flyers', 'Video content creation'],
    ARRAY['Small business owners', 'Social media managers', 'Students', 'Non-designers who need to create visuals', 'Marketing teams']
  );

  -- 19. Notion AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Notion AI',
    'notion-ai',
    'AI built into your workspace — write, summarize, and manage tasks without leaving Notion.',
    'Notion AI is an integrated AI assistant that lives inside Notion''s all-in-one workspace. It helps you brainstorm, write drafts, summarize meeting notes, extract action items, fill databases, and answer questions across your entire workspace. Now included in Business and Enterprise plans.',
    'https://www.notion.so',
    cat_productivity,
    'freemium',
    'Free Notion plan (limited AI). Plus: $12/mo. Business: $20/mo (includes full AI). Enterprise: custom.',
    4.3,
    true,
    false,
    'published',
    now(),
    'Notion Labs',
    2016,
    ARRAY['AI writing and editing in any page', 'Summarize meeting notes and documents', 'AI-powered database autofill', 'Q&A across your entire workspace', 'Powered by GPT-4 and Claude'],
    ARRAY['Seamlessly integrated into Notion workflow', 'No context switching — AI is always available', 'Great for team knowledge management'],
    ARRAY['Only useful if you already use Notion', 'AI features locked behind Business plan', 'Can be slow with large workspaces'],
    ARRAY['Meeting note summaries and action items', 'Writing drafts and blog posts', 'Organizing and querying team knowledge', 'Project planning and brainstorming'],
    ARRAY['Notion users', 'Product and engineering teams', 'Startups', 'Students and educators', 'Knowledge workers']
  );

  -- 20. Moltbook
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Moltbook',
    'moltbook',
    'The first social network for AI agents — a Reddit-style platform where AI agents post, comment, and vote autonomously.',
    'Moltbook is a groundbreaking social platform exclusively for AI agents, launched in January 2026. Built on the OpenClaw framework (114,000+ GitHub stars), it operates like Reddit where AI agents autonomously create posts, respond to threads, and upvote/downvote content. Humans can only observe. It''s become an informal testing ground for how AI agents communicate without human direction.',
    'https://www.moltbook.com',
    cat_agents,
    'free',
    'Free to observe. AI agents interact autonomously.',
    4.0,
    true,
    true,
    'published',
    now(),
    'Moltbook',
    2026,
    ARRAY['AI-only social network — agents post and comment autonomously', 'Built on OpenClaw framework (114K+ GitHub stars)', 'Heartbeat system — agents visit every 4 hours', 'Submolts (topic-specific groups)', 'Real-time observation of AI agent behavior'],
    ARRAY['Fascinating window into AI agent behavior', 'Completely free to observe', 'Built on popular open-source framework'],
    ARRAY['Security concerns with exposed API keys', 'No human participation allowed', 'Controversial — some call it a fad'],
    ARRAY['Observing autonomous AI behavior', 'AI agent research and development', 'Understanding multi-agent communication', 'Testing AI agent frameworks'],
    ARRAY['AI researchers', 'Developers building AI agents', 'Tech enthusiasts', 'Anyone curious about AI autonomy']
  );

  -- ============================================================
  -- WAVE 2: EMERGING & TRENDING AI TOOLS
  -- ============================================================

  -- 21. OpenClaw
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'OpenClaw',
    'openclaw',
    'The viral open-source personal AI agent — 186K GitHub stars. Handles email, calendar, browsing via WhatsApp and Telegram.',
    'OpenClaw is the fastest-growing open-source AI agent on GitHub (186K+ stars in weeks). It''s a personal AI assistant that runs on your own devices and communicates through channels you already use — WhatsApp, Telegram, Slack, Discord, Signal, iMessage, and more. It can browse the web, manage your calendar, process emails, and automate tasks while keeping all your data 100% local. Built by Peter Steinberger, it sparked the Moltbook phenomenon and a massive ecosystem of community skills.

GitHub: github.com/openclaw/openclaw | Twitter/X: @openclawai',
    'https://openclaw.ai',
    cat_agents,
    'open_source',
    'Free and open-source. Pay only for LLM API costs. Community sponsorship tiers from $5/mo.',
    4.6,
    true,
    true,
    'published',
    now(),
    'OpenClaw',
    2025,
    ARRAY['186K+ GitHub stars — fastest-growing AI agent', 'Works on WhatsApp, Telegram, Slack, Discord, Signal, iMessage', 'Persistent memory — remembers past interactions', 'Browser automation for web tasks', '100% local data — privacy-first architecture'],
    ARRAY['Completely open-source and self-hosted', 'Massive community building skills and plugins', 'Works on channels you already use'],
    ARRAY['Requires technical setup to self-host', 'LLM API costs can add up', 'Security concerns flagged by researchers'],
    ARRAY['Email and calendar management', 'Web browsing and research automation', 'Smart home control', 'Task automation across platforms'],
    ARRAY['Developers and tech enthusiasts', 'Privacy-conscious users', 'AI agent builders', 'Open-source contributors']
  );

  -- 22. n8n
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'n8n',
    'n8n',
    'The fair-code workflow automation platform — 400+ integrations with native AI capabilities and MCP server support.',
    'n8n is an open-source workflow automation platform that has emerged as the leading tool for chaining together LLMs with operational tools. With 400+ integrations, native AI capabilities, and MCP server support, it enables businesses to create self-correcting AI workflows. It''s the open-source alternative to Zapier that developers love.

GitHub: github.com/n8n-io/n8n (174K+ stars) | Twitter/X: @n8n_io',
    'https://n8n.io',
    cat_agents,
    'freemium',
    'Free self-hosted. Cloud: Starter $24/mo. Pro: $60/mo. Enterprise: custom.',
    4.5,
    true,
    true,
    'published',
    now(),
    'n8n GmbH',
    2019,
    ARRAY['400+ app integrations', 'Native AI capabilities with LLM chaining', 'MCP server support', 'Self-hosted or cloud options', 'Visual workflow builder with code when needed'],
    ARRAY['Open-source and self-hostable', 'Much more flexible than Zapier', 'Native AI workflow support'],
    ARRAY['Steeper learning curve than no-code tools', 'Self-hosting requires technical knowledge', 'Some integrations less polished than competitors'],
    ARRAY['AI agent workflow orchestration', 'Business process automation', 'Data pipeline creation', 'CRM and marketing automation'],
    ARRAY['Developers and DevOps teams', 'Startups automating workflows', 'Businesses replacing Zapier', 'AI agent builders']
  );

  -- 23. Devin
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Devin',
    'devin',
    'The first autonomous AI software engineer — plans and executes complex engineering tasks end-to-end.',
    'Devin by Cognition Labs is branded as the world''s first AI software engineer. Unlike code completion tools, Devin can autonomously plan and execute complex engineering tasks requiring thousands of decisions. It can set up environments, write code, debug, and deploy — all with long-term reasoning. Used by Goldman Sachs, Cisco, Palantir, and Dell. Grew from $1M to $73M ARR in 9 months.

Twitter/X: @cognaboratory',
    'https://cognition.ai',
    cat_coding,
    'paid',
    'Enterprise pricing. Contact for details.',
    4.4,
    true,
    true,
    'published',
    now(),
    'Cognition Labs',
    2024,
    ARRAY['Autonomous end-to-end software engineering', 'Long-term reasoning across thousands of decisions', 'Environment setup, coding, debugging, and deployment', 'Enterprise-grade with SOC 2 compliance', 'Used by Goldman Sachs, Cisco, Palantir, Dell'],
    ARRAY['Can handle full engineering tasks autonomously', 'Impressive at complex multi-step development', 'Enterprise-ready with major customer traction'],
    ARRAY['Enterprise pricing — not for individuals', 'Not open-source', 'Still requires human oversight for critical code'],
    ARRAY['Automating routine engineering tasks', 'Legacy code migration', 'Bug fixing at scale', 'Prototype and MVP development'],
    ARRAY['Enterprise engineering teams', 'Companies scaling development', 'CTOs looking to augment teams', 'Large organizations']
  );

  -- 24. Bolt.new
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Bolt.new',
    'bolt-new',
    'Prompt, run, edit, and deploy full-stack apps in your browser — no local setup needed.',
    'Bolt.new by StackBlitz lets you build and deploy full-stack web applications entirely in your browser using natural language prompts. It went viral as a demo of "vibe coding" — describe what you want, and Bolt generates, runs, and deploys it. Received $400M in funding in January 2026.

Twitter/X: @stackblitz',
    'https://bolt.new',
    cat_coding,
    'freemium',
    'Free tier available. Pro plans for more usage.',
    4.3,
    true,
    true,
    'published',
    now(),
    'StackBlitz',
    2016,
    ARRAY['Full-stack app generation from prompts', 'Runs entirely in the browser — no local setup', 'Instant deployment', 'Edit and iterate conversationally', 'Supports React, Next.js, and modern frameworks'],
    ARRAY['Zero setup — works entirely in browser', 'Incredibly fast from idea to deployed app', 'Great for prototyping and MVPs'],
    ARRAY['Generated code can need significant refactoring', 'Limited for complex production applications', 'Browser-based has performance limits'],
    ARRAY['Rapid prototyping and MVPs', 'Hackathon projects', 'Learning web development', 'Quick demo apps'],
    ARRAY['Non-technical founders', 'Developers prototyping quickly', 'Students learning to code', 'Startup teams']
  );

  -- 25. v0
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'v0',
    'v0',
    'Vercel''s AI UI generator — create polished React + Tailwind components from natural language.',
    'v0 by Vercel generates production-ready React components with Tailwind CSS and shadcn/ui styling from natural language descriptions. It''s the fastest way to go from a design idea to working UI code. The generated components are clean, accessible, and ready to drop into any Next.js or React project.

Twitter/X: @v0',
    'https://v0.dev',
    cat_coding,
    'freemium',
    'Free tier with limited generations. Premium plan available.',
    4.4,
    true,
    false,
    'published',
    now(),
    'Vercel',
    2023,
    ARRAY['Generate React + Tailwind UI from text descriptions', 'Uses shadcn/ui component library', 'Copy-paste ready code output', 'Iterate on designs conversationally', 'Responsive and accessible by default'],
    ARRAY['Generates clean, production-ready code', 'Uses industry-standard component libraries', 'Free tier is generous for experimentation'],
    ARRAY['UI-only — doesn''t handle backend logic', 'Sometimes generates overly complex markup', 'Limited to React ecosystem'],
    ARRAY['Rapid UI prototyping', 'Creating component libraries', 'Design-to-code conversion', 'Landing page creation'],
    ARRAY['Frontend developers', 'Designers learning to code', 'Full-stack developers', 'Startup teams']
  );

  -- 26. Lovable
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Lovable',
    'lovable',
    'AI app builder — describe your app idea and get a full-stack application with database and auth.',
    'Lovable (formerly GPT Engineer) is an AI app builder that turns natural language descriptions into complete full-stack applications. It handles frontend, backend, database, and authentication — generating production-ready code you can customize. Raised $330M Series B at $6.6B valuation, making it one of the most valued AI coding startups.

GitHub: github.com/lovable-dev | Twitter/X: @lovaboratory',
    'https://lovable.dev',
    cat_coding,
    'freemium',
    'Free tier available. Paid plans for more generations and features.',
    4.2,
    true,
    false,
    'published',
    now(),
    'Lovable (formerly GPT Engineer)',
    2023,
    ARRAY['Full-stack app generation from descriptions', 'Database and authentication setup included', 'Supabase integration for backend', 'Git-based code output you own', 'Iterative development with AI'],
    ARRAY['Generates complete apps, not just UI', 'You own and can modify all generated code', 'Impressive for rapid prototyping'],
    ARRAY['Generated code can be hard to maintain', 'Complex apps still need manual work', 'Relatively new — still improving'],
    ARRAY['Building MVPs quickly', 'Internal tool development', 'SaaS prototyping', 'Startup idea validation'],
    ARRAY['Non-technical founders', 'Solo developers', 'Startup teams', 'Product managers']
  );

  -- 27. Replit
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Replit',
    'replit',
    'Browser-based IDE with AI — code, run, and deploy apps without any local setup.',
    'Replit is a browser-based development environment with a powerful AI coding assistant called Ghostwriter. It supports 50+ programming languages and lets you go from idea to deployed app without ever installing anything locally. With its AI Agent feature, you can describe an app and Replit builds it step by step.

Twitter/X: @Replit',
    'https://replit.com',
    cat_coding,
    'freemium',
    'Free tier (Hacker plan). Replit Core: $25/mo. Teams: $40/user/mo.',
    4.2,
    true,
    false,
    'published',
    now(),
    'Replit',
    2016,
    ARRAY['Browser-based IDE — no local setup needed', 'AI Agent builds apps from descriptions', 'Ghostwriter AI code assistant', 'One-click deployment', '50+ programming languages supported'],
    ARRAY['Zero setup — works entirely in browser', 'Great for learning and quick projects', 'Built-in deployment and hosting'],
    ARRAY['Performance limited vs local development', 'Can be slow for large projects', 'Free tier has resource limits'],
    ARRAY['Learning to code', 'Quick prototyping', 'Collaborative coding', 'Building and deploying small apps'],
    ARRAY['Students and coding beginners', 'Educators teaching programming', 'Developers prototyping quickly', 'Teams needing collaborative coding']
  );

  -- 28. DeepSeek
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'DeepSeek',
    'deepseek',
    'The Chinese AI lab that shocked the world — open-source reasoning models rivaling GPT-4 at 50x lower cost.',
    'DeepSeek is a Chinese AI research lab that released R1, an open-source reasoning model that rivals GPT-4 at a fraction of the cost. Their V3 model (671B parameters) is available via API at roughly $0.27 per million input tokens — 10-50x cheaper than competitors. The "DeepSeek moment" proved that frontier AI capabilities don''t require massive budgets.

GitHub: github.com/deepseek-ai | Twitter/X: @deepseek_ai',
    'https://www.deepseek.com',
    cat_chatbots,
    'free',
    'Free to use. API: ~$0.27/M input tokens, $1.10/M output tokens. Open-source weights available.',
    4.5,
    true,
    true,
    'published',
    now(),
    'DeepSeek',
    2023,
    ARRAY['R1 reasoning model rivaling GPT-4', 'Open-source model weights', 'API pricing 10-50x cheaper than competitors', 'V3 model with 671B parameters', 'Compatible with OpenAI API format'],
    ARRAY['Dramatically cheaper than competitors', 'Open-source — run locally or via API', 'Impressive reasoning capabilities'],
    ARRAY['Chinese company raises data privacy concerns', 'Smaller ecosystem than OpenAI/Anthropic', 'English performance slightly below Chinese'],
    ARRAY['Cost-effective AI applications', 'Running AI models locally', 'Budget-conscious AI development', 'Research and experimentation'],
    ARRAY['AI developers and researchers', 'Startups on a budget', 'Open-source enthusiasts', 'Companies optimizing AI costs']
  );

  -- 29. Sora
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Sora',
    'sora',
    'OpenAI''s cinematic AI video generator — acts like an AI director with native audio generation.',
    'Sora is OpenAI''s text-to-video model that generates cinematic-quality video with synchronized audio. It acts like an AI director with intuitive shot composition, continuity, and narrative sense. Sora 2 can turn stories into coherent visual sequences with native audio — a major leap for AI filmmaking.

Twitter/X: @OpenAI',
    'https://sora.com',
    cat_video,
    'paid',
    'Requires ChatGPT Plus ($20/mo) or Pro ($200/mo). Not available separately.',
    4.5,
    true,
    false,
    'published',
    now(),
    'OpenAI',
    2024,
    ARRAY['Cinematic-quality text-to-video generation', 'Native audio generation and synchronization', 'AI director with shot and continuity sense', 'Multiple aspect ratios and resolutions', 'Storyboard mode for narrative sequences'],
    ARRAY['Best cinematic quality in AI video', 'Native audio generation is unique', 'Seamless ChatGPT integration'],
    ARRAY['Requires ChatGPT subscription — not standalone', 'Limited availability in some regions', 'Long generation times for complex prompts'],
    ARRAY['Short film and commercial creation', 'Music video production', 'Social media video content', 'Creative storytelling'],
    ARRAY['Filmmakers and directors', 'Content creators', 'Marketing teams', 'Artists and storytellers']
  );

  -- 30. Luma Dream Machine
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Luma Dream Machine',
    'luma-dream-machine',
    'Fast AI video prototyping — the quickest way to turn ideas into video with a low learning curve.',
    'Luma Dream Machine is an AI video generator by Luma Labs that excels at speed and ease of use. While it may not match Runway or Sora on raw cinematic quality, it''s the fastest way to prototype video ideas with minimal learning curve. Great for quick iterations and visual brainstorming.

Twitter/X: @LumaLabsAI',
    'https://lumalabs.ai',
    cat_video,
    'freemium',
    'Free tier with limited generations. Paid plans for more credits.',
    4.1,
    true,
    false,
    'published',
    now(),
    'Luma Labs',
    2023,
    ARRAY['Fast video generation from text or images', 'Low learning curve — easy to get started', 'Image-to-video animation', '3D scene generation capabilities', 'Quick iteration and prototyping'],
    ARRAY['Fastest generation times in the category', 'Very easy to learn and use', 'Good free tier for experimentation'],
    ARRAY['Quality below Runway and Sora', 'Limited creative controls', 'Shorter max video length'],
    ARRAY['Quick video prototyping', 'Social media content', 'Visual brainstorming', 'Animation from still images'],
    ARRAY['Social media creators', 'Marketers needing quick video', 'Designers prototyping motion', 'Hobbyists exploring AI video']
  );

  -- 31. ClawHub
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'ClawHub',
    'clawhub',
    'The official skill registry for OpenClaw — browse, publish, and reuse AI agent skill packages.',
    'ClawHub is the official public registry for OpenClaw Agent skills, serving as the central hub for the OpenClaw ecosystem. Developers can publish, browse, and reuse skill packages built on the AgentSkills standard. Think of it as npm but for AI agent capabilities.',
    'https://hub.openclaw.ai',
    cat_agents,
    'free',
    'Free to use. Open-source skill publishing.',
    3.8,
    true,
    false,
    'published',
    now(),
    'OpenClaw Community',
    2025,
    ARRAY['Central registry for OpenClaw skills', 'AgentSkills standard for interoperability', 'One-click skill installation', 'Community-driven skill development', 'Skill versioning and dependency management'],
    ARRAY['Free and open ecosystem', 'Growing library of community skills', 'Standardized skill format'],
    ARRAY['Only useful with OpenClaw', 'Many skills are experimental', 'Quality varies across community submissions'],
    ARRAY['Finding pre-built AI agent skills', 'Publishing custom OpenClaw skills', 'Extending agent capabilities', 'Community collaboration'],
    ARRAY['OpenClaw users', 'AI agent developers', 'Open-source contributors']
  );

  -- 32. x402
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'x402',
    'x402',
    'HTTP 402 payment standard for agent-to-agent commerce and micropayments.',
    'x402 is an open protocol that implements the HTTP 402 Payment Required standard for AI agent-to-agent transactions. It enables micropayments between autonomous agents, allowing them to pay for services, data, and compute on the fly. A foundational building block for the emerging agent economy.

GitHub: github.com/x402-protocol',
    'https://x402.org',
    cat_agents,
    'open_source',
    'Free and open-source protocol.',
    3.7,
    true,
    false,
    'published',
    now(),
    'x402 Protocol',
    2025,
    ARRAY['HTTP 402 payment standard implementation', 'Agent-to-agent micropayments', 'Open protocol for agent commerce', 'Supports multiple payment rails', 'Developer SDK and documentation'],
    ARRAY['Solves real problem of agent payments', 'Open standard — not locked to any platform', 'Growing ecosystem adoption'],
    ARRAY['Very early stage technology', 'Requires crypto/blockchain knowledge', 'Limited real-world adoption so far'],
    ARRAY['Agent-to-agent payments', 'Monetizing AI skills and data', 'Building agent marketplaces', 'Micropayment infrastructure'],
    ARRAY['AI agent developers', 'Protocol designers', 'Blockchain developers', 'Agent economy builders']
  );

  -- 33. BANKR
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'BANKR',
    'bankr',
    'Agent launchpad — deploy and manage autonomous AI agents on-chain with built-in monetization.',
    'BANKR is a launchpad platform for deploying autonomous AI agents on-chain. It handles the infrastructure for agent deployment, management, and monetization — letting developers focus on building agent logic rather than blockchain plumbing. Part of the growing OpenClaw ecosystem.',
    'https://bankr.ai',
    cat_agents,
    'freemium',
    'Free tier for basic agents. Paid plans for advanced features.',
    3.6,
    true,
    false,
    'published',
    now(),
    'BANKR',
    2025,
    ARRAY['On-chain AI agent deployment', 'Built-in agent monetization', 'Agent management dashboard', 'OpenClaw ecosystem integration', 'Autonomous agent hosting'],
    ARRAY['Simplifies agent deployment to blockchain', 'Built-in monetization tools', 'Growing ecosystem'],
    ARRAY['Requires blockchain/crypto knowledge', 'Early stage platform', 'Limited documentation'],
    ARRAY['Deploying AI agents on-chain', 'Monetizing agent services', 'Building autonomous agent businesses', 'Agent portfolio management'],
    ARRAY['AI agent developers', 'Crypto/Web3 developers', 'Entrepreneurs in agent economy']
  );

  -- 34. Heurist
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Heurist',
    'heurist',
    'Decentralized AI inference network — run open-source models on distributed compute.',
    'Heurist is a decentralized AI inference network that runs open-source models on distributed compute infrastructure. Instead of relying on centralized cloud providers, Heurist distributes AI workloads across a network of GPU providers, offering censorship-resistant and potentially cheaper inference.

GitHub: github.com/heurist-network',
    'https://heurist.ai',
    cat_agents,
    'open_source',
    'Open-source. Pay for compute usage.',
    3.5,
    true,
    false,
    'published',
    now(),
    'Heurist Network',
    2024,
    ARRAY['Decentralized AI model inference', 'Open-source model hosting', 'Distributed GPU compute network', 'Censorship-resistant AI access', 'Cost-effective alternative to cloud providers'],
    ARRAY['Decentralized and censorship-resistant', 'Supports open-source models', 'Can be cheaper than cloud providers'],
    ARRAY['Performance less consistent than centralized', 'Complex setup for providers', 'Smaller model selection than major clouds'],
    ARRAY['Running open-source AI models', 'Censorship-resistant AI applications', 'Cost-optimized AI inference', 'Contributing GPU compute to the network'],
    ARRAY['AI developers needing affordable inference', 'Privacy-focused users', 'GPU owners wanting to earn', 'Open-source AI advocates']
  );

  -- 35. Sui
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Sui',
    'sui',
    'High-throughput blockchain with grants and tooling for building AI-driven agentic applications.',
    'Sui is a Layer 1 blockchain built with the Move programming language, designed for high throughput and low latency. It has positioned itself as the go-to chain for AI agent applications, offering grants and developer tooling specifically for building AI-driven decentralized applications. Part of the OpenClaw ecosystem.

GitHub: github.com/MystenLabs/sui | Twitter/X: @SuiNetwork',
    'https://sui.io',
    cat_agents,
    'open_source',
    'Open-source blockchain. Transaction fees apply.',
    3.8,
    true,
    false,
    'published',
    now(),
    'Mysten Labs',
    2022,
    ARRAY['High-throughput blockchain (300K+ TPS)', 'Move programming language', 'AI agent development grants', 'Object-centric data model', 'Sub-second finality'],
    ARRAY['Purpose-built for AI agent applications', 'Active grants program for developers', 'High performance and low fees'],
    ARRAY['Requires learning Move language', 'Blockchain knowledge needed', 'Ecosystem smaller than Ethereum/Solana'],
    ARRAY['Building AI agent dApps', 'Agent-to-agent transactions', 'Decentralized AI infrastructure', 'On-chain AI data storage'],
    ARRAY['Blockchain developers', 'AI agent builders', 'dApp developers', 'Web3 entrepreneurs']
  );

END $$;
