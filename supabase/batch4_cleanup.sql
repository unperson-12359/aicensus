-- ============================================================
-- AiCensus Batch 4: Catalog Cleanup
-- Remove 6 weak/defunct tools, add 13 major missing tools
-- Run in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PART 1: Remove 6 weak/defunct tools
-- ============================================================

DELETE FROM tools WHERE slug IN (
  'babyagi',
  'agentgpt',
  'sweep-ai',
  'text-generation-webui',
  'koboldai',
  'csm'
);

-- ============================================================
-- PART 2: Add 13 major missing tools
-- ============================================================

DO $
DECLARE
  cat_video_audio     UUID;
  cat_local_oss       UUID;
  cat_productivity    UUID;
  cat_coding          UUID;
  cat_chatbots        UUID;
  cat_data            UUID;
BEGIN
  SELECT id INTO cat_video_audio   FROM categories WHERE slug = 'video-audio';
  SELECT id INTO cat_local_oss     FROM categories WHERE slug = 'local-open-source';
  SELECT id INTO cat_productivity  FROM categories WHERE slug = 'productivity';
  SELECT id INTO cat_coding        FROM categories WHERE slug = 'coding-development';
  SELECT id INTO cat_chatbots      FROM categories WHERE slug = 'chatbots-assistants';
  SELECT id INTO cat_data          FROM categories WHERE slug = 'data-analytics';

  -- 1. ElevenLabs
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'ElevenLabs',
    'elevenlabs',
    'The most realistic AI voice platform',
    'ElevenLabs creates the most natural-sounding AI voices for text-to-speech, voice cloning, dubbing, and audio content. Used by creators, developers, and enterprises to generate studio-quality voiceovers in 29+ languages with emotional range and precision that''s nearly indistinguishable from human speech.',
    'https://elevenlabs.io',
    cat_video_audio,
    'freemium',
    'Free: 10k chars/mo | Starter: $5/mo (30k chars) | Creator: $22/mo (100k chars) | Pro: $99/mo (500k chars) | Scale: $330/mo',
    4.8, true, true,
    'published', NOW(), 'ElevenLabs', 2022,
    ARRAY['Text-to-speech in 29+ languages', 'Voice cloning from audio samples', 'AI dubbing for video content', 'Voice library marketplace', 'Real-time voice streaming API', 'Emotional and tonal control'],
    ARRAY['Most natural-sounding AI voices available', 'Excellent voice cloning quality', 'Large language support', 'Powerful API for developers', 'Active voice library community'],
    ARRAY['Free tier is limited', 'Voice cloning requires clear audio samples', 'Higher tiers can get expensive for heavy usage'],
    ARRAY['Podcast and audiobook production', 'Video narration and dubbing', 'Game character voices', 'Accessibility tools', 'Content localization'],
    ARRAY['Content creators', 'Podcast producers', 'Game developers', 'Accessibility teams', 'Localization companies']
  );

  -- 2. RunwayML
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'RunwayML',
    'runwayml',
    'AI-powered creative suite for video generation',
    'Runway is the leading AI creative tool for video generation, editing, and visual effects. Their Gen-3 Alpha model generates high-quality video from text and images, while their suite of AI magic tools handles background removal, color grading, motion tracking, and more. Used by Hollywood studios and indie creators alike.',
    'https://runwayml.com',
    cat_video_audio,
    'freemium',
    'Free: 125 credits | Standard: $12/mo (625 credits) | Pro: $28/mo (2250 credits) | Unlimited: $76/mo',
    4.7, true, true,
    'published', NOW(), 'Runway AI', 2018,
    ARRAY['Gen-3 Alpha video generation', 'Text-to-video and image-to-video', 'AI magic tools suite (25+ tools)', 'Motion brush and camera controls', 'Background removal and inpainting', 'Professional video editing'],
    ARRAY['Industry-leading video generation quality', 'Comprehensive creative tool suite', 'Used by major film studios', 'Intuitive interface', 'Regular model improvements'],
    ARRAY['Credit system can be limiting', 'Generated videos max 10 seconds', 'High-quality outputs require Pro plan', 'Rendering can be slow during peak times'],
    ARRAY['Short-form video content', 'Film pre-visualization', 'Social media content creation', 'Visual effects and compositing', 'Creative prototyping'],
    ARRAY['Filmmakers', 'Video editors', 'Content creators', 'VFX artists', 'Advertising agencies']
  );

  -- 3. HeyGen
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'HeyGen',
    'heygen',
    'AI video creation with realistic avatars',
    'HeyGen creates professional videos using AI-generated avatars and voices. Choose from 100+ diverse avatars or create your own, add scripts in 40+ languages, and generate polished videos in minutes. Perfect for training, marketing, and sales videos without cameras or studios.',
    'https://heygen.com',
    cat_video_audio,
    'freemium',
    'Free: 1 credit | Creator: $24/mo (15 credits) | Business: $72/mo (30 credits) | Enterprise: custom',
    4.4, true, false,
    'published', NOW(), 'HeyGen', 2020,
    ARRAY['100+ stock AI avatars', 'Custom avatar creation', '40+ language support', 'Voice cloning integration', 'Template library', 'API access for automation'],
    ARRAY['Very realistic avatar movements', 'Quick video production', 'Great for multilingual content', 'No camera or studio needed', 'Easy-to-use editor'],
    ARRAY['Avatars can feel uncanny at times', 'Credit-based pricing adds up', 'Custom avatars require setup time', 'Limited free tier'],
    ARRAY['Corporate training videos', 'Marketing and sales demos', 'Multilingual product tours', 'Personalized outreach', 'E-learning content'],
    ARRAY['Marketing teams', 'HR and training departments', 'Sales teams', 'E-learning creators', 'Agencies']
  );

  -- 4. Suno
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Suno',
    'suno',
    'Create full songs with AI in seconds',
    'Suno generates complete songs — vocals, instruments, lyrics, and production — from a text prompt. Describe the style, mood, or topic and get a radio-ready track in under a minute. With v4, Suno produces remarkably human-sounding vocals across genres from pop to metal to classical.',
    'https://suno.com',
    cat_video_audio,
    'freemium',
    'Free: 10 songs/day | Pro: $10/mo (500 songs) | Premier: $30/mo (2000 songs)',
    4.5, true, true,
    'published', NOW(), 'Suno', 2023,
    ARRAY['Full song generation from text', 'AI vocals and instrumentals', 'Multiple genre support', 'Custom lyrics or AI-written', 'Song extension and remixing', 'High-quality audio output'],
    ARRAY['Incredibly easy to use', 'Surprisingly good vocal quality', 'Wide genre versatility', 'Fast generation times', 'Generous free tier'],
    ARRAY['Commercial licensing requires paid plan', 'Less control over specific musical elements', 'Can sound formulaic in some genres', 'No stem separation'],
    ARRAY['Background music for videos', 'Song prototyping and demos', 'Social media content', 'Personal music creation', 'Jingles and ads'],
    ARRAY['Content creators', 'Musicians for prototyping', 'Podcasters', 'Video producers', 'Hobbyist musicians']
  );

  -- 5. Hugging Face
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Hugging Face',
    'hugging-face',
    'The GitHub of machine learning',
    'Hugging Face is the central hub for the open-source AI community. Host and discover ML models, datasets, and demo apps. With 500k+ models, the Transformers library, Spaces for demos, and Inference API, it''s where most of the AI ecosystem builds, shares, and deploys.',
    'https://huggingface.co',
    cat_local_oss,
    'freemium',
    'Free: unlimited public repos + community GPU | Pro: $9/mo (private repos) | Enterprise Hub: from $20/user/mo',
    4.8, true, true,
    'published', NOW(), 'Hugging Face', 2016,
    ARRAY['500k+ open-source models', 'Model hosting and versioning', 'Spaces for app demos', 'Inference API', 'Transformers library', 'Dataset hosting and discovery'],
    ARRAY['Largest AI model repository', 'Free hosting for public models', 'Excellent community and documentation', 'Supports every major ML framework', 'Active open-source ecosystem'],
    ARRAY['Can be overwhelming for beginners', 'Free compute is limited', 'Model quality varies widely', 'Enterprise features are expensive'],
    ARRAY['ML model discovery and sharing', 'Building AI demos and apps', 'Fine-tuning and training models', 'Dataset curation', 'AI research collaboration'],
    ARRAY['ML engineers', 'AI researchers', 'Data scientists', 'Open-source contributors', 'Companies deploying AI']
  );

  -- 6. Notion AI
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Notion AI',
    'notion-ai',
    'AI assistant built into your workspace',
    'Notion AI brings artificial intelligence directly into the popular all-in-one workspace. Ask questions across your entire workspace, generate and edit content, summarize meeting notes, create action items, translate text, and automate workflows — all without leaving Notion.',
    'https://notion.so',
    cat_productivity,
    'freemium',
    'Free: limited AI responses | Plus: $10/mo + $10/mo AI add-on | Business: $18/mo (AI included)',
    4.3, true, false,
    'published', NOW(), 'Notion Labs', 2013,
    ARRAY['AI Q&A across workspace', 'Content generation and editing', 'Meeting note summaries', 'Action item extraction', 'Translation in 10+ languages', 'Autofill database properties'],
    ARRAY['Seamlessly integrated into Notion', 'Context-aware (knows your workspace)', 'No need for separate AI tool', 'Good for writing and summarization', 'Constantly improving'],
    ARRAY['Requires Notion ecosystem buy-in', 'AI add-on cost on top of subscription', 'Can be slow on large workspaces', 'Not as powerful as dedicated AI tools'],
    ARRAY['Meeting notes and action items', 'Content drafting', 'Knowledge base Q&A', 'Project documentation', 'Personal productivity'],
    ARRAY['Notion users', 'Knowledge workers', 'Project managers', 'Writers', 'Teams using Notion']
  );

  -- 7. Vercel v0
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'v0 by Vercel',
    'v0',
    'AI-powered UI generation',
    'v0 generates production-ready React UI components from text descriptions and images. Describe the interface you want, and v0 creates clean, responsive code using shadcn/ui and Tailwind CSS. Iterate with conversational prompts, then copy the code directly into your project.',
    'https://v0.dev',
    cat_coding,
    'freemium',
    'Free: 200 messages/mo | Premium: $20/mo (unlimited) | Team: $30/user/mo',
    4.5, true, true,
    'published', NOW(), 'Vercel', 2015,
    ARRAY['Text-to-UI generation', 'Image-to-code conversion', 'shadcn/ui + Tailwind output', 'Iterative refinement via chat', 'One-click code copy', 'Full-stack app generation'],
    ARRAY['Excellent code quality output', 'Uses modern React patterns', 'Great for rapid prototyping', 'Clean, accessible components', 'Integrates with Vercel ecosystem'],
    ARRAY['Limited to React/Next.js ecosystem', 'Complex layouts may need manual tweaking', 'Free tier has message limits', 'Generated code may need optimization'],
    ARRAY['UI prototyping', 'Landing page creation', 'Component scaffolding', 'Design-to-code conversion', 'Rapid MVP development'],
    ARRAY['Frontend developers', 'Full-stack developers', 'Designers who code', 'Startup founders', 'Freelancers']
  );

  -- 8. Bolt.new
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Bolt.new',
    'bolt-new',
    'Build full-stack apps with AI in the browser',
    'Bolt.new is an AI-powered full-stack development environment that runs entirely in the browser. Describe your app idea and Bolt generates the complete codebase, installs dependencies, and provides a live preview. Edit with natural language, deploy with one click, and iterate at the speed of thought.',
    'https://bolt.new',
    cat_coding,
    'freemium',
    'Free: limited tokens | Pro: $20/mo (10M tokens) | Team: $40/user/mo (26M tokens)',
    4.4, true, true,
    'published', NOW(), 'StackBlitz', 2017,
    ARRAY['Full-stack app generation', 'In-browser development environment', 'One-click deployment', 'Natural language editing', 'NPM package management', 'Live preview and hot reload'],
    ARRAY['No local setup required', 'Impressively fast app generation', 'Supports many frameworks', 'Great for prototyping', 'Deploy directly from browser'],
    ARRAY['Token limits on free tier', 'Complex apps may need manual fixes', 'Less control than traditional IDE', 'Can struggle with large codebases'],
    ARRAY['Rapid prototyping', 'MVP development', 'Learning new frameworks', 'Hackathon projects', 'Client demos'],
    ARRAY['Non-technical founders', 'Full-stack developers', 'Startup teams', 'Students', 'Freelancers']
  );

  -- 9. Lovable
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Lovable',
    'lovable',
    'The AI full-stack engineer',
    'Lovable (formerly GPT Engineer) is an AI app builder that generates full-stack web applications from natural language descriptions. It creates beautiful, functional apps with authentication, databases, and deployment built in. Think of it as an AI co-founder that handles the technical side.',
    'https://lovable.dev',
    cat_coding,
    'freemium',
    'Free: 5 messages/day | Starter: $20/mo | Launch: $50/mo (unlimited) | Scale: $200/mo',
    4.3, true, false,
    'published', NOW(), 'Lovable', 2023,
    ARRAY['Full-stack app generation', 'Supabase integration for backend', 'Authentication built-in', 'GitHub sync', 'One-click deployment', 'Visual editing alongside AI'],
    ARRAY['Beautiful default designs', 'Backend integration out of the box', 'Good for non-technical users', 'Active development and updates', 'Supabase database support'],
    ARRAY['Free tier is very limited', 'Can struggle with complex requirements', 'Less flexibility than coding manually', 'Newer product, still maturing'],
    ARRAY['SaaS MVP development', 'Internal tools', 'Landing pages with backend', 'Startup prototyping', 'No-code to low-code projects'],
    ARRAY['Non-technical founders', 'Product managers', 'Solo entrepreneurs', 'Startup teams', 'Designers']
  );

  -- 10. Replit Agent
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Replit Agent',
    'replit-agent',
    'AI agent that builds and deploys software',
    'Replit Agent is an AI coding agent built into the Replit cloud IDE. Describe what you want to build and the agent writes code, installs packages, sets up databases, and deploys — all autonomously. It can handle multi-file projects, debug errors, and iterate on feedback.',
    'https://replit.com',
    cat_coding,
    'freemium',
    'Free: limited uses | Replit Core: $25/mo (includes Agent) | Teams: $40/user/mo',
    4.2, true, false,
    'published', NOW(), 'Replit', 2016,
    ARRAY['Autonomous app building', 'Built-in cloud IDE', 'Database provisioning', 'One-click deployment', 'Multi-language support', 'Collaborative editing'],
    ARRAY['Everything runs in the cloud', 'No local setup needed', 'Full IDE experience', 'Handles deployment automatically', 'Good for learning to code'],
    ARRAY['Agent can be inconsistent', 'Cloud IDE has performance limits', 'Pricing can add up', 'Less mature than competitors'],
    ARRAY['Learning to code', 'Quick prototypes', 'Hackathon projects', 'Small web apps', 'Automated deployments'],
    ARRAY['Beginner developers', 'Students', 'Hobbyists', 'Non-technical builders', 'Rapid prototypers']
  );

  -- 11. Poe
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Poe',
    'poe',
    'All AI models in one place',
    'Poe by Quora gives you access to ChatGPT, Claude, Gemini, Llama, Mistral, DALL-E, and many more AI models through a single subscription. Chat with any model, create custom bots, and compare responses side by side. The one-stop shop for exploring the AI landscape.',
    'https://poe.com',
    cat_chatbots,
    'freemium',
    'Free: limited daily messages | Poe Subscriber: $20/mo (3,500 compute points/mo)',
    4.3, true, false,
    'published', NOW(), 'Quora', 2009,
    ARRAY['Access to 20+ AI models', 'Custom bot creation', 'Side-by-side model comparison', 'Image generation models', 'API access for developers', 'Cross-platform apps'],
    ARRAY['One subscription for multiple models', 'Easy model comparison', 'Custom bot marketplace', 'Good mobile apps', 'Frequently adds new models'],
    ARRAY['Compute points limit heavy usage', 'Not as deep as native model apps', 'Bot quality varies in marketplace', 'Some models have reduced context'],
    ARRAY['Comparing AI models', 'Accessing multiple LLMs', 'Building custom chatbots', 'AI exploration and learning', 'Quick AI tasks across models'],
    ARRAY['AI enthusiasts', 'Researchers comparing models', 'Developers exploring LLMs', 'Casual users wanting variety', 'Teams needing multi-model access']
  );

  -- 12. Character.AI
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Character.AI',
    'character-ai',
    'Chat with AI-powered characters',
    'Character.AI lets you create and chat with AI characters — from historical figures to fictional personas to helpful assistants. With millions of user-created characters and some of the most engaging conversational AI, it''s become one of the most popular AI platforms by user engagement.',
    'https://character.ai',
    cat_chatbots,
    'freemium',
    'Free: unlimited chats (with queue) | c.ai+: $9.99/mo (priority, faster responses)',
    4.2, true, false,
    'published', NOW(), 'Character Technologies', 2021,
    ARRAY['Millions of AI characters', 'Character creation tools', 'Group chat with multiple AIs', 'Persona customization', 'Voice chat support', 'Mobile apps'],
    ARRAY['Incredibly engaging conversations', 'Massive character library', 'Very affordable paid plan', 'Strong community', 'Good for creative writing practice'],
    ARRAY['Not designed for factual accuracy', 'Content filters can be restrictive', 'Characters can break persona', 'Limited utility for work tasks'],
    ARRAY['Entertainment and roleplay', 'Creative writing practice', 'Language learning via conversation', 'Companionship and social AI', 'Character-based education'],
    ARRAY['Creative writers', 'Gamers and roleplay enthusiasts', 'Language learners', 'Entertainment seekers', 'AI hobbyists']
  );

  -- 13. Tableau AI
  INSERT INTO tools (
    name, slug, tagline, description, website_url, category_id,
    pricing_model, pricing_details, editor_rating, is_verified, is_featured,
    status, published_at, company_name, founded_year,
    key_features, pros, cons, use_cases, who_its_for
  ) VALUES (
    'Tableau AI',
    'tableau-ai',
    'AI-powered data visualization and analytics',
    'Tableau, now with integrated AI capabilities, is the industry-leading data visualization platform. Tableau AI adds natural language queries, automated insights, predictive modeling, and smart recommendations to the already powerful visual analytics engine. Ask questions in plain English and get instant charts and dashboards.',
    'https://tableau.com',
    cat_data,
    'paid',
    'Tableau Creator: $75/user/mo | Explorer: $42/user/mo | Viewer: $15/user/mo',
    4.5, true, true,
    'published', NOW(), 'Salesforce (Tableau)', 2003,
    ARRAY['Natural language data queries', 'AI-powered automated insights', 'Predictive analytics models', 'Smart chart recommendations', 'Einstein AI integration', 'Drag-and-drop visualization'],
    ARRAY['Industry-leading visualization', 'Powerful AI-assisted analytics', 'Handles massive datasets', 'Extensive connector ecosystem', 'Strong enterprise support'],
    ARRAY['Expensive for small teams', 'Steep learning curve', 'Requires clean data for best results', 'AI features limited to newer versions'],
    ARRAY['Business intelligence dashboards', 'Data exploration and discovery', 'Executive reporting', 'Sales and marketing analytics', 'Financial analysis'],
    ARRAY['Data analysts', 'Business intelligence teams', 'Enterprise organizations', 'Data scientists', 'Executive teams']
  );

END $;
