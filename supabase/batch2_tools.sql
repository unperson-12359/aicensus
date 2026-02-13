-- ============================================================
-- AiCensus Batch 2: 20 New Tools
-- Run this in Supabase SQL Editor to add the new tools
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

  -- 36. Grok
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Grok',
    'grok',
    'xAI''s unfiltered AI assistant with real-time access to X/Twitter data.',
    'Grok by xAI is Elon Musk''s answer to ChatGPT, powered by the Grok 3 reasoning model. What sets it apart is real-time access to posts on X (Twitter), giving it a unique edge for current events and social sentiment analysis. Known for its witty, uncensored personality and willingness to engage with topics other AI assistants avoid.',
    'https://grok.com',
    cat_chatbots,
    'freemium',
    'Free tier with limited prompts. Premium: $8/mo (included with X Premium+). SuperGrok: $30/mo.',
    4.3,
    true,
    true,
    'published',
    now(),
    'xAI',
    2023,
    ARRAY['Real-time X/Twitter data access', 'Grok 3 reasoning model', 'Uncensored and witty personality', 'Image generation with Aurora', 'DeepSearch for thorough research'],
    ARRAY['Unique real-time social media insights', 'Strong reasoning and coding abilities', 'More willing to discuss edgy topics'],
    ARRAY['Smaller ecosystem than ChatGPT or Claude', 'Free tier is very limited', 'Quality can be inconsistent'],
    ARRAY['Real-time social media analysis', 'Current events research', 'Coding assistance', 'Creative writing with personality'],
    ARRAY['X/Twitter power users', 'Researchers tracking trends', 'Developers', 'Content creators']
  );

  -- 37. Microsoft Copilot
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Microsoft Copilot',
    'microsoft-copilot',
    'AI assistant deeply integrated into the Microsoft 365 ecosystem you already use.',
    'Microsoft Copilot brings AI directly into Word, Excel, PowerPoint, Outlook, and Teams. It drafts documents, analyzes spreadsheets without complex formulas, builds presentations from a single idea, summarizes meetings, and highlights action items from email threads. For organizations already on Microsoft 365, it''s the most natural AI upgrade.',
    'https://copilot.microsoft.com',
    cat_productivity,
    'freemium',
    'Free web version. Copilot Pro: $20/mo. Microsoft 365 Copilot: $30/user/mo (enterprise).',
    4.4,
    true,
    true,
    'published',
    now(),
    'Microsoft',
    2023,
    ARRAY['Deep integration with Word, Excel, PowerPoint', 'Meeting summaries in Teams', 'Email drafting and triage in Outlook', 'Data analysis in Excel with natural language', 'Image generation with DALL-E'],
    ARRAY['Seamless Microsoft 365 integration', 'No context switching needed', 'Enterprise-grade security and compliance'],
    ARRAY['Requires Microsoft 365 subscription for full value', 'Enterprise tier is expensive', 'Can be slow with large documents'],
    ARRAY['Document drafting and editing', 'Spreadsheet analysis', 'Presentation creation', 'Email management', 'Meeting summaries'],
    ARRAY['Enterprise workers', 'Microsoft 365 users', 'Office managers', 'Business analysts', 'Sales teams']
  );

  -- 38. Grammarly
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Grammarly',
    'grammarly',
    'The AI writing assistant that catches what you miss — grammar, tone, clarity, and style.',
    'Grammarly has evolved from a grammar checker into a comprehensive AI writing partner. Beyond fixing spelling and grammar, it now offers generative AI to rewrite, brainstorm, and compose text. With browser extensions, desktop apps, and integrations with virtually every writing surface, it works wherever you write.',
    'https://www.grammarly.com',
    cat_writing,
    'freemium',
    'Free tier with basic corrections. Premium: $12/mo. Business: $15/user/mo.',
    4.5,
    true,
    true,
    'published',
    now(),
    'Grammarly Inc.',
    2009,
    ARRAY['Advanced grammar and spelling checks', 'Tone detection and adjustment', 'Generative AI for rewriting and composing', 'Works in browsers, desktop apps, and mobile', 'Plagiarism detection on Premium'],
    ARRAY['Works everywhere you write', 'Free tier is genuinely useful', 'Excellent tone and clarity suggestions'],
    ARRAY['Generative AI features require Premium', 'Can be overly prescriptive with suggestions', 'Privacy concerns with cloud processing'],
    ARRAY['Email and business writing', 'Academic papers', 'Social media posts', 'Blog and content writing', 'Professional communication'],
    ARRAY['Writers and editors', 'Students', 'Business professionals', 'Non-native English speakers', 'Content marketers']
  );

  -- 39. Otter.ai
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Otter.ai',
    'otter-ai',
    'AI meeting assistant that transcribes, summarizes, and captures action items in real time.',
    'Otter.ai provides real-time meeting transcription with speaker identification and automated summaries. It joins your Zoom, Google Meet, and Teams calls automatically, captures every word, and generates shareable notes with key takeaways and action items. One of the best productivity tools for meeting-heavy professionals.',
    'https://otter.ai',
    cat_productivity,
    'freemium',
    'Free: 300 min/mo. Pro: $8.33/mo. Business: $20/user/mo.',
    4.3,
    true,
    false,
    'published',
    now(),
    'Otter.ai Inc.',
    2016,
    ARRAY['Real-time meeting transcription', 'Automatic speaker identification', 'AI-generated meeting summaries', 'Action item extraction', 'Integrates with Zoom, Meet, and Teams'],
    ARRAY['Excellent transcription accuracy', 'Automatic meeting joining saves time', 'Generous free tier'],
    ARRAY['Struggles with heavy accents or cross-talk', 'Summary quality varies', 'Limited offline capabilities'],
    ARRAY['Meeting notes and minutes', 'Interview transcription', 'Lecture recording', 'Sales call documentation'],
    ARRAY['Remote workers', 'Managers', 'Journalists', 'Students', 'Sales professionals']
  );

  -- 40. Descript
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Descript',
    'descript',
    'Edit video and podcasts by editing text — the all-in-one content creation studio.',
    'Descript revolutionizes video and podcast editing by letting you edit media through its transcript. Delete a word from the text, and it disappears from the video. It includes AI-powered features like filler word removal, eye contact correction, studio-quality audio enhancement, and AI voice cloning for overdubs.',
    'https://www.descript.com',
    cat_video,
    'freemium',
    'Free tier with 1 hour of transcription. Hobbyist: $24/mo. Pro: $33/mo.',
    4.4,
    true,
    false,
    'published',
    now(),
    'Descript Inc.',
    2017,
    ARRAY['Text-based video and audio editing', 'Automatic filler word removal', 'AI eye contact correction', 'Studio Sound audio enhancement', 'AI voice cloning for overdubs'],
    ARRAY['Revolutionary text-based editing paradigm', 'All-in-one creation and editing', 'Excellent AI audio enhancement'],
    ARRAY['Learning curve for traditional editors', 'Rendering can be slow for long videos', 'Free tier is limited'],
    ARRAY['Podcast production', 'YouTube video editing', 'Social media content', 'Training video creation', 'Repurposing long-form content'],
    ARRAY['Podcasters', 'YouTubers', 'Content marketers', 'Educators', 'Social media managers']
  );

  -- 41. Synthesia
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Synthesia',
    'synthesia',
    'Create professional AI avatar videos in 130+ languages — no camera, studio, or actors needed.',
    'Synthesia lets you create professional-quality videos using realistic AI avatars. Type your script, choose from 160+ diverse avatars (or create a custom one), and generate polished videos in minutes. With 130+ language support and 4K output, it''s become the go-to for corporate training, marketing, and internal communications at scale.',
    'https://www.synthesia.io',
    cat_video,
    'paid',
    'Starter: $22/mo. Creator: $67/mo. Enterprise: custom pricing.',
    4.3,
    true,
    false,
    'published',
    now(),
    'Synthesia Ltd.',
    2017,
    ARRAY['160+ realistic AI avatars', '130+ language support', '4K video output', 'Custom avatar creation', 'ChatGPT-powered script assistant'],
    ARRAY['No filming equipment or talent needed', 'Massive time and cost savings', 'Excellent multilingual support'],
    ARRAY['No free tier available', 'Avatars can feel uncanny to some viewers', 'Limited creative flexibility vs. real video'],
    ARRAY['Corporate training videos', 'Product demos and tutorials', 'Internal communications', 'Marketing videos', 'Multilingual content'],
    ARRAY['L&D teams', 'Marketing departments', 'HR teams', 'Enterprise communicators', 'Course creators']
  );

  -- 42. Pika
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Pika',
    'pika',
    'Generate cinematic AI videos from text or images with playful creative controls.',
    'Pika is a generative AI video platform that creates short, stylish videos from text prompts, images, or existing video clips. With Pika 2.0, it excels at cinematic and stylized content — think neon aesthetics, cyberpunk visuals, and bold creative directions. Camera controls, custom characters, and fun effects make it a creative playground.',
    'https://pika.art',
    cat_video,
    'freemium',
    'Free tier with limited credits. Standard: $8/mo. Unlimited: $58/mo.',
    4.2,
    true,
    false,
    'published',
    now(),
    'Pika Labs',
    2023,
    ARRAY['Text-to-video and image-to-video generation', 'Cinematic and stylized output', 'Camera movement controls', 'Custom character insertion', 'Creative effects and filters'],
    ARRAY['Excellent for stylized and creative content', 'Intuitive interface', 'Good quality for the price'],
    ARRAY['Short clip length limitations', 'Less realistic than some competitors', 'Credit-based system can run out fast'],
    ARRAY['Social media video content', 'Ad and marketing clips', 'Concept art animation', 'Creative experimentation'],
    ARRAY['Social media creators', 'Digital artists', 'Marketing teams', 'Content creators']
  );

  -- 43. Adobe Firefly
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Adobe Firefly',
    'adobe-firefly',
    'AI image generation trained exclusively on licensed content — commercially safe by design.',
    'Adobe Firefly is the only major AI image generator trained exclusively on licensed Adobe Stock imagery and public domain content. This gives it a critical advantage for commercial use: IP indemnity. Integrated directly into Photoshop, Illustrator, and other Creative Cloud apps, it provides generative fill, text effects, and image generation within your existing workflow.',
    'https://firefly.adobe.com',
    cat_image,
    'freemium',
    'Free: 25 credits/mo. Premium: $4.99/mo for 100 credits. Included in Creative Cloud plans.',
    4.4,
    true,
    false,
    'published',
    now(),
    'Adobe',
    2023,
    ARRAY['Trained on licensed content (IP-safe)', 'Integrated into Photoshop and Illustrator', 'Generative fill and expand', 'Text effects generation', 'Style reference matching'],
    ARRAY['Commercially safe with IP indemnity', 'Seamless Creative Cloud integration', 'Excellent for professional design workflows'],
    ARRAY['Output quality behind Midjourney for artistic work', 'Credit system can feel limiting', 'Requires Adobe ecosystem for best experience'],
    ARRAY['Commercial design projects', 'Photo editing and retouching', 'Marketing asset creation', 'Brand-safe content generation'],
    ARRAY['Professional designers', 'Creative Cloud users', 'Marketing teams', 'Photographers', 'Enterprise creative teams']
  );

  -- 44. Ideogram
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Ideogram',
    'ideogram',
    'The AI image generator that actually gets text right — best-in-class typography in images.',
    'Ideogram stands out from other AI image generators with its exceptional ability to render readable, accurate text within images. While Midjourney and DALL-E still struggle with text, Ideogram nails logos, posters, and designs that require clean typography. Great for anyone who needs text-heavy visual content.',
    'https://ideogram.ai',
    cat_image,
    'freemium',
    'Free: 10 images/day. Basic: $7/mo. Plus: $16/mo. Pro: $48/mo.',
    4.3,
    true,
    false,
    'published',
    now(),
    'Ideogram Inc.',
    2023,
    ARRAY['Best-in-class text rendering in images', 'Multiple style modes (realistic, design, 3D)', 'Magic Prompt for enhanced descriptions', 'Consistent quality across styles', 'Fast generation speeds'],
    ARRAY['Unmatched text accuracy in images', 'Great for logos and poster design', 'Generous free tier'],
    ARRAY['Overall artistic quality behind Midjourney', 'Smaller community and fewer resources', 'Limited editing and upscaling options'],
    ARRAY['Logo and brand design mockups', 'Poster and flyer creation', 'Social media graphics with text', 'T-shirt and merch design', 'Meme creation'],
    ARRAY['Graphic designers', 'Social media managers', 'Small business owners', 'Print-on-demand sellers', 'Content creators']
  );

  -- 45. Leonardo AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Leonardo AI',
    'leonardo-ai',
    'AI art platform built for game developers, concept artists, and character designers.',
    'Leonardo AI is an AI image generation platform specifically optimized for game assets, concept art, and consistent character design. With fine-tuned models for different art styles, a real-time canvas for iterative creation, and tools for maintaining character consistency across generations, it''s become a favorite among game developers and digital artists.',
    'https://leonardo.ai',
    cat_image,
    'freemium',
    'Free: 150 tokens/day. Apprentice: $10/mo. Artisan: $24/mo. Maestro: $48/mo.',
    4.2,
    true,
    false,
    'published',
    now(),
    'Leonardo Interactive',
    2022,
    ARRAY['Fine-tuned models for different art styles', 'Character consistency tools', 'Real-time generation canvas', 'Motion generation for animations', 'Custom model training'],
    ARRAY['Excellent for game and concept art', 'Strong character consistency', 'Good free tier with daily tokens'],
    ARRAY['Less versatile than Midjourney for general use', 'UI can be overwhelming for beginners', 'Token system requires planning'],
    ARRAY['Game asset creation', 'Character design', 'Concept art iteration', 'Marketing visuals', 'Storyboard creation'],
    ARRAY['Game developers', 'Concept artists', 'Digital illustrators', 'Indie game studios', 'Animation teams']
  );

  -- 46. Stable Diffusion
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Stable Diffusion',
    'stable-diffusion',
    'The open-source image generation model — run locally, customize fully, own everything.',
    'Stable Diffusion is the leading open-source AI image generation model. Unlike cloud-based alternatives, you can run it locally on your own hardware with complete privacy and zero per-image costs. The massive community has created thousands of fine-tuned models (LoRAs), custom workflows via ComfyUI, and specialized checkpoints for every art style imaginable.',
    'https://stability.ai',
    cat_image,
    'open_source',
    'Free and open source. API: from $0.002/image. Cloud hosting varies.',
    4.5,
    true,
    true,
    'published',
    now(),
    'Stability AI',
    2022,
    ARRAY['Fully open-source and locally runnable', 'Massive community of fine-tuned models', 'LoRA fine-tuning for custom styles', 'ComfyUI node-based workflow system', 'SDXL and SD3 model variants'],
    ARRAY['Complete privacy and control', 'No per-image costs when run locally', 'Infinitely customizable with community models'],
    ARRAY['Requires technical setup and GPU hardware', 'Steep learning curve for beginners', 'Base model quality behind Midjourney'],
    ARRAY['Custom art style generation', 'Batch image production', 'Product mockups and prototyping', 'Research and experimentation', 'Building AI image products'],
    ARRAY['AI researchers', 'Technical artists', 'Indie developers', 'Privacy-conscious creators', 'AI product builders']
  );

  -- 47. Gamma
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Gamma',
    'gamma',
    'AI-powered presentations and documents — from idea to polished deck in seconds.',
    'Gamma is an AI-first presentation and document builder that generates complete, beautifully designed decks from a simple prompt or outline. Unlike traditional slide tools, Gamma creates web-native content that looks great on any device. It handles design, layout, and imagery automatically so you can focus on your message.',
    'https://gamma.app',
    cat_design,
    'freemium',
    'Free: 400 AI credits. Plus: $8/mo. Pro: $15/mo.',
    4.3,
    true,
    false,
    'published',
    now(),
    'Gamma Tech',
    2020,
    ARRAY['AI-generated presentations from prompts', 'Web-native responsive format', 'Automatic design and layout', 'Built-in AI image generation', 'One-click style themes'],
    ARRAY['Fastest way from idea to polished deck', 'No design skills needed', 'Responsive on all devices'],
    ARRAY['Less control than PowerPoint for precise layouts', 'Web-native format not always accepted', 'Limited export options'],
    ARRAY['Pitch decks and proposals', 'Team presentations', 'Project documentation', 'Sales decks', 'Educational content'],
    ARRAY['Startup founders', 'Sales professionals', 'Educators', 'Consultants', 'Marketing teams']
  );

  -- 48. Beautiful.ai
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Beautiful.ai',
    'beautiful-ai',
    'AI presentation software with smart design rules — every slide looks professional automatically.',
    'Beautiful.ai applies intelligent design rules to every slide you create. Instead of fighting with alignment, spacing, and formatting, the AI handles layout automatically as you add content. Smart templates adapt to your content, ensuring consistent, professional-looking presentations without design expertise.',
    'https://www.beautiful.ai',
    cat_design,
    'paid',
    'Pro: $12/mo. Team: $40/user/mo. Enterprise: custom.',
    4.1,
    true,
    false,
    'published',
    now(),
    'Beautiful.ai Inc.',
    2018,
    ARRAY['Smart slide templates with auto-layout', 'AI design rules for consistent formatting', 'Team collaboration features', 'Brand kit management', 'Presentation analytics'],
    ARRAY['Impossible to make ugly slides', 'Great for maintaining brand consistency', 'Fast to create professional decks'],
    ARRAY['No free tier available', 'Less creative freedom than manual design', 'Limited animation options'],
    ARRAY['Company presentations', 'Sales proposals', 'Board decks', 'Training materials', 'Marketing reports'],
    ARRAY['Business professionals', 'Sales teams', 'Executives', 'HR and training departments', 'Consultants']
  );

  -- 49. Tome
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Tome',
    'tome',
    'AI storytelling tool that turns ideas into compelling narratives and presentations.',
    'Tome is an AI-powered tool focused on storytelling. Rather than just generating slides, it creates narrative-driven presentations that blend text, images, and layouts into cohesive stories. Its AI understands context and flow, generating content that tells a story rather than just listing bullet points.',
    'https://tome.app',
    cat_design,
    'freemium',
    'Free tier available. Professional: $16/mo. Enterprise: custom.',
    4.0,
    true,
    false,
    'published',
    now(),
    'Magical Tome Inc.',
    2020,
    ARRAY['AI narrative generation', 'Storytelling-focused presentation format', 'AI image generation built in', 'One-click full presentation creation', 'Collaborative editing'],
    ARRAY['Excellent at narrative structure', 'Beautiful default designs', 'Fast from concept to presentation'],
    ARRAY['Can feel too automated for detailed work', 'Limited formatting control', 'Free tier has watermarks'],
    ARRAY['Pitch narratives', 'Creative briefs', 'Project overviews', 'Thought leadership content', 'Strategic presentations'],
    ARRAY['Startup founders', 'Creative professionals', 'Strategists', 'Content marketers', 'Educators']
  );

  -- 50. Zapier
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Zapier',
    'zapier',
    'Connect 8,000+ apps and build AI-powered automations without writing a single line of code.',
    'Zapier is the leading no-code automation platform, connecting over 8,000 apps through automated workflows called Zaps. With AI capabilities, you can now build automations using natural language, create AI agents that work across your app stack, and chain together LLMs with operational tools for complex multi-step workflows.',
    'https://zapier.com',
    cat_productivity,
    'freemium',
    'Free: 100 tasks/mo. Starter: $19.99/mo. Professional: $49/mo. Team: $69/mo.',
    4.4,
    true,
    true,
    'published',
    now(),
    'Zapier Inc.',
    2011,
    ARRAY['8,000+ app integrations', 'AI-powered Zap builder with natural language', 'Multi-step workflow automation', 'AI agents across your app stack', 'Conditional logic and branching'],
    ARRAY['Largest app ecosystem by far', 'Natural language automation building', 'Reliable and well-maintained integrations'],
    ARRAY['Can get expensive at scale', 'Complex workflows have a learning curve', 'Task limits on lower tiers'],
    ARRAY['Email and CRM automation', 'Social media scheduling', 'Data syncing between apps', 'Lead routing and notifications', 'AI-powered customer workflows'],
    ARRAY['Small business owners', 'Marketing teams', 'Operations managers', 'Sales teams', 'Solopreneurs']
  );

  -- 51. Make.com
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Make.com',
    'make-com',
    'Visual workflow automation with drag-and-drop scenario building for complex integrations.',
    'Make.com (formerly Integromat) is a visual automation platform that lets you build complex workflows through an intuitive drag-and-drop interface. Each step in your automation is visualized as a node, making it easy to understand and debug complex multi-step processes. It offers deeper customization than Zapier at lower price points.',
    'https://www.make.com',
    cat_productivity,
    'freemium',
    'Free: 1,000 operations/mo. Core: $9/mo. Pro: $16/mo. Teams: $29/mo.',
    4.3,
    true,
    false,
    'published',
    now(),
    'Celonis',
    2012,
    ARRAY['Visual drag-and-drop scenario builder', 'Deep data transformation capabilities', 'Error handling and routing', 'Webhook and API support', 'Scheduling and conditional logic'],
    ARRAY['More affordable than Zapier for complex workflows', 'Visual builder is intuitive', 'Deeper customization and data transformation'],
    ARRAY['Smaller app library than Zapier', 'Steeper learning curve for advanced features', 'Documentation could be better'],
    ARRAY['Complex multi-step automations', 'Data transformation and migration', 'E-commerce workflow automation', 'CRM and marketing automation', 'API integrations'],
    ARRAY['Technical operations teams', 'Marketing automation specialists', 'E-commerce managers', 'Developers building integrations', 'Agencies']
  );

  -- 52. Julius AI
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Julius AI',
    'julius-ai',
    'Your AI data analyst — upload a CSV, ask questions in plain English, get instant insights.',
    'Julius AI is a conversational data analysis tool that lets anyone become a data analyst. Upload a spreadsheet or CSV, ask questions in natural language, and get instant charts, statistical analysis, and actionable insights. No coding, no formulas, no SQL — just describe what you want to know and Julius figures out the analysis.',
    'https://julius.ai',
    cat_data,
    'freemium',
    'Free tier available. Essential: $20/mo. Pro: $45/mo.',
    4.2,
    true,
    false,
    'published',
    now(),
    'Julius AI Inc.',
    2023,
    ARRAY['Natural language data querying', 'Automatic chart and visualization generation', 'Statistical analysis without code', 'Multiple file format support', 'Exportable reports and charts'],
    ARRAY['Makes data analysis accessible to non-technical users', 'Fast insights from raw data', 'Good visualization generation'],
    ARRAY['Limited to structured data analysis', 'Large datasets can be slow', 'Advanced statistical methods not always available'],
    ARRAY['Sales data analysis', 'Financial reporting', 'Survey result analysis', 'Market research', 'Academic data exploration'],
    ARRAY['Business analysts', 'Marketers', 'Students and researchers', 'Small business owners', 'Non-technical decision makers']
  );

  -- 53. Opus Clip
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Opus Clip',
    'opus-clip',
    'Turn long videos into viral short clips — AI finds the best moments automatically.',
    'Opus Clip uses AI to analyze long-form videos and automatically extract the most engaging moments as short-form clips. It handles reframing for vertical format, adds captions, identifies key highlights using its virality score, and generates multiple clips from a single video. Essential for repurposing podcasts, webinars, and YouTube content for TikTok, Reels, and Shorts.',
    'https://www.opus.pro',
    cat_video,
    'freemium',
    'Free: 10 clips/mo. Starter: $15/mo. Growth: $29/mo.',
    4.3,
    true,
    false,
    'published',
    now(),
    'Opus',
    2022,
    ARRAY['AI-powered highlight detection', 'Automatic vertical reframing', 'Virality score for clip ranking', 'Auto-generated captions', 'Batch clip generation'],
    ARRAY['Massive time saver for content repurposing', 'Good at finding engaging moments', 'Simple paste-link-and-go workflow'],
    ARRAY['Clip selection isn''t always perfect', 'Limited editing after generation', 'Free tier is quite limited'],
    ARRAY['Repurposing podcast episodes', 'YouTube to TikTok/Reels conversion', 'Webinar highlight extraction', 'Social media content creation'],
    ARRAY['Content creators', 'Podcasters', 'YouTubers', 'Social media managers', 'Marketing teams']
  );

  -- 54. Gumloop
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Gumloop',
    'gumloop',
    'Build complex, multi-step AI workflows without code — chain LLMs with operational tools.',
    'Gumloop is a no-code platform for building sophisticated AI-powered workflows. Connect LLMs with web scraping, data processing, and external APIs in a visual interface. It''s designed for complex multi-step automations that go beyond simple triggers — think AI agents that research, analyze, and act across multiple data sources.',
    'https://www.gumloop.com',
    cat_productivity,
    'freemium',
    'Free tier available. Pro: $25/mo. Business: $100/mo.',
    4.1,
    true,
    false,
    'published',
    now(),
    'Gumloop Inc.',
    2023,
    ARRAY['Visual AI workflow builder', 'LLM chaining with operational tools', 'Web scraping and data extraction', 'API integrations', 'Scheduled and triggered workflows'],
    ARRAY['Great for complex AI-powered automations', 'More AI-native than Zapier/Make', 'Good for chaining multiple LLM calls'],
    ARRAY['Newer platform with smaller community', 'Can be complex for simple automations', 'Pricing can escalate with usage'],
    ARRAY['AI-powered research pipelines', 'Content generation workflows', 'Data extraction and processing', 'Lead enrichment automation', 'Competitive analysis'],
    ARRAY['Growth marketers', 'AI automation enthusiasts', 'Agency operators', 'Data teams', 'Technical marketers']
  );

  -- 55. Perplexity Pages
  INSERT INTO tools (name, slug, tagline, description, website_url, category_id, pricing_model, pricing_details, editor_rating, is_verified, is_featured, status, published_at, company_name, founded_year, key_features, pros, cons, use_cases, who_its_for)
  VALUES (
    'Perplexity Pages',
    'perplexity-pages',
    'Transform AI research into polished, shareable articles with automatic citations.',
    'Perplexity Pages lets you turn your Perplexity research sessions into polished, publishable articles. It automatically organizes your findings into well-structured content with proper citations and sources. Think of it as an AI-powered research-to-publication pipeline — great for creating authoritative content backed by real sources.',
    'https://www.perplexity.ai',
    cat_writing,
    'freemium',
    'Available with Perplexity Pro: $20/mo. Limited access on free tier.',
    4.2,
    true,
    false,
    'published',
    now(),
    'Perplexity AI',
    2022,
    ARRAY['Research-to-article pipeline', 'Automatic citation and source attribution', 'Professional formatting and layout', 'Shareable public pages', 'Built on Perplexity''s research engine'],
    ARRAY['Articles backed by real sources', 'Seamless research-to-content workflow', 'Professional output quality'],
    ARRAY['Requires Perplexity Pro for full features', 'Limited customization of output format', 'Can feel formulaic in structure'],
    ARRAY['Research reports and summaries', 'SEO content with citations', 'Thought leadership articles', 'Educational resources', 'Market analysis reports'],
    ARRAY['Content marketers', 'Researchers', 'SEO professionals', 'Journalists', 'Educators']
  );

END $$;
