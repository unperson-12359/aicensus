import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TOOLS = [
  // CODING & DEVELOPMENT
  {
    name: "Devin",
    slug: "devin",
    tagline: "The first AI software engineer that works autonomously",
    description: "Devin is an autonomous AI coding agent by Cognition that can plan, write, debug, and deploy entire software projects. It operates in its own sandboxed environment with a shell, browser, and editor, handling complex multi-step engineering tasks end-to-end.",
    website_url: "https://devin.ai",
    pricing_model: "paid" as const,
    editor_rating: 4.0,
    key_features: ["Autonomous multi-file project development", "Built-in browser, terminal, and code editor", "Can learn from documentation and fix its own bugs", "Handles deployment and DevOps tasks", "GitHub and Slack integration"],
    pros: ["Handles complex multi-step tasks independently", "Reduces time on boilerplate engineering work"],
    cons: ["Expensive for individual developers", "Output quality varies on complex architectural decisions"],
    use_cases: ["Automated bug fixing", "Prototyping", "Codebase migration"],
    who_its_for: ["Engineering teams", "Startups", "Enterprise"],
    company_name: "Cognition",
    category_slug: "coding-development",
  },
  {
    name: "Augment Code",
    slug: "augment-code",
    tagline: "AI coding assistant with deep codebase understanding",
    description: "Augment Code is an AI-powered coding assistant that deeply understands your entire codebase, not just the file you're working on. It provides context-aware completions, chat, and code generation that accounts for your project architecture and conventions.",
    website_url: "https://www.augmentcode.com",
    pricing_model: "freemium" as const,
    editor_rating: 4.0,
    key_features: ["Full codebase context awareness", "IDE plugins for VS Code and JetBrains", "Context-aware chat and inline completions", "Understands project conventions", "Team knowledge sharing"],
    pros: ["Excellent at understanding large codebases", "Strong context window for multi-file reasoning"],
    cons: ["Smaller ecosystem than GitHub Copilot", "Enterprise pricing can be steep"],
    use_cases: ["Large codebase navigation", "Context-aware code completion", "Team onboarding"],
    who_its_for: ["Software engineers", "Development teams", "Enterprise"],
    company_name: "Augment",
    category_slug: "coding-development",
  },
  // IMAGE GENERATION
  {
    name: "Ideogram",
    slug: "ideogram",
    tagline: "AI image generation with best-in-class text rendering",
    description: "Ideogram is an AI image generation tool known for its exceptional ability to render readable text within generated images. It supports photorealistic, artistic, and design-oriented styles and has become a go-to for creators needing text-heavy visual content.",
    website_url: "https://ideogram.ai",
    pricing_model: "freemium" as const,
    editor_rating: 4.3,
    key_features: ["Industry-leading text rendering in images", "Multiple style presets", "High-resolution output", "Magic Prompt enhancement", "API access"],
    pros: ["Best text-in-image generation available", "Versatile style options", "Generous free tier"],
    cons: ["Slower generation than some competitors", "Less community ecosystem than Midjourney"],
    use_cases: ["Logo design", "Social media graphics", "Marketing materials"],
    who_its_for: ["Designers", "Marketers", "Content creators"],
    company_name: "Ideogram",
    category_slug: "image-generation",
  },
  {
    name: "Flux",
    slug: "flux",
    tagline: "Open-weight image generation pushing the state of the art",
    description: "Flux is a family of image generation models from Black Forest Labs (founded by original Stable Diffusion creators). Available in Pro, Dev, and Schnell variants, it delivers exceptional image quality and has become the foundation for many open-source image generation workflows.",
    website_url: "https://blackforestlabs.ai",
    pricing_model: "open_source" as const,
    editor_rating: 4.5,
    key_features: ["Multiple model tiers (Pro, Dev, Schnell)", "Open weights for Dev and Schnell", "Excellent prompt adherence and photorealism", "Fast inference with Schnell variant", "Wide ecosystem of community fine-tunes"],
    pros: ["Open weights enable local and custom deployments", "Exceptional image quality rivaling closed models"],
    cons: ["Pro model is API-only and paid", "Requires significant GPU for local use"],
    use_cases: ["Creative art generation", "Custom model training", "Open-source image pipelines"],
    who_its_for: ["AI researchers", "Developers", "Digital artists"],
    company_name: "Black Forest Labs",
    category_slug: "image-generation",
  },
  {
    name: "Leonardo AI",
    slug: "leonardo-ai",
    tagline: "Creative AI platform for production-quality visual assets",
    description: "Leonardo AI is a generative AI platform focused on creating production-ready visual assets for games, marketing, and design. It offers image generation, real-time canvas editing, texture generation, and fine-tuning capabilities in a polished web interface.",
    website_url: "https://leonardo.ai",
    pricing_model: "freemium" as const,
    editor_rating: 4.2,
    key_features: ["Real-time generation canvas", "Custom model fine-tuning", "3D texture generation", "Motion generation for images", "Extensive style library"],
    pros: ["Excellent for game and production assets", "Intuitive interface with powerful controls"],
    cons: ["Token-based system can feel limiting", "Advanced features locked behind paid tiers"],
    use_cases: ["Game asset creation", "Marketing visuals", "Concept art"],
    who_its_for: ["Game developers", "Designers", "Marketing teams"],
    company_name: "Leonardo AI",
    category_slug: "image-generation",
  },
  // VIDEO & AUDIO
  {
    name: "Sora",
    slug: "sora",
    tagline: "Create realistic videos from text prompts with AI",
    description: "Sora is OpenAI's text-to-video and image-to-video generation model. It produces high-fidelity, temporally consistent video clips from text descriptions, supporting various aspect ratios, durations, and creative styles for filmmakers and content creators.",
    website_url: "https://sora.com",
    pricing_model: "paid" as const,
    editor_rating: 4.2,
    key_features: ["Text-to-video generation up to 20 seconds", "Image-to-video animation", "Multiple aspect ratios and resolutions", "Storyboard mode", "Video remixing tools"],
    pros: ["Exceptional visual quality", "Tight integration with ChatGPT Plus"],
    cons: ["Generation can be slow", "Usage limits even on paid plans"],
    use_cases: ["Short-form video content", "Creative filmmaking", "Social media production"],
    who_its_for: ["Content creators", "Filmmakers", "Marketers"],
    company_name: "OpenAI",
    category_slug: "video-audio",
  },
  {
    name: "ElevenLabs",
    slug: "elevenlabs",
    tagline: "The most realistic AI voice generation and cloning platform",
    description: "ElevenLabs provides industry-leading AI voice synthesis, cloning, and dubbing. It generates natural-sounding speech in dozens of languages, clones voices from short audio samples, and automatically dubs video content while preserving speaker identity and emotion.",
    website_url: "https://elevenlabs.io",
    pricing_model: "freemium" as const,
    editor_rating: 4.6,
    key_features: ["Ultra-realistic text-to-speech in 30+ languages", "Voice cloning from short samples", "Automatic video dubbing with lip sync", "Voice library marketplace", "Real-time streaming API"],
    pros: ["Best-in-class voice quality", "Extensive language support", "Robust API"],
    cons: ["Voice cloning raises ethical concerns", "Premium tiers expensive for heavy usage"],
    use_cases: ["Audiobook production", "Video dubbing", "Voiceover creation"],
    who_its_for: ["Content creators", "Podcasters", "Developers"],
    company_name: "ElevenLabs",
    category_slug: "video-audio",
  },
  {
    name: "Runway",
    slug: "runway",
    tagline: "Advanced AI creative tools for video and media production",
    description: "Runway is a creative AI platform offering a suite of video generation and editing tools. Its Gen-3 Alpha model powers text-to-video, image-to-video, and video-to-video transformations, along with tools for inpainting, motion tracking, and green screen removal.",
    website_url: "https://runwayml.com",
    pricing_model: "freemium" as const,
    editor_rating: 4.3,
    key_features: ["Gen-3 Alpha text-to-video model", "Video-to-video style transfer", "AI-powered video editing", "Motion brush for animation control", "Multi-modal generation"],
    pros: ["Comprehensive creative suite", "Professional-grade output quality"],
    cons: ["Credit system can be costly", "Steep learning curve for advanced features"],
    use_cases: ["Film post-production", "Music videos", "Advertising content"],
    who_its_for: ["Filmmakers", "Creative agencies", "Video editors"],
    company_name: "Runway",
    category_slug: "video-audio",
  },
  {
    name: "Kling AI",
    slug: "kling-ai",
    tagline: "Professional AI video generation with cinematic quality",
    description: "Kling AI is a video generation platform from Kuaishou that produces high-quality, long-duration video clips. It supports text-to-video and image-to-video generation with strong motion quality and has gained popularity as a powerful alternative to Western video AI tools.",
    website_url: "https://klingai.com",
    pricing_model: "freemium" as const,
    editor_rating: 4.0,
    key_features: ["Video generation up to 2 minutes", "1080p output resolution", "Image-to-video with motion control", "Lip sync and face animation", "Camera movement controls"],
    pros: ["Longer video output than most competitors", "Good free tier"],
    cons: ["Interface less polished than Western competitors", "Content moderation can be restrictive"],
    use_cases: ["Video content creation", "Product demos", "Creative shorts"],
    who_its_for: ["Video creators", "Marketers", "Social media managers"],
    company_name: "Kuaishou",
    category_slug: "video-audio",
  },
  // AI WRITING
  {
    name: "Jasper",
    slug: "jasper",
    tagline: "AI marketing copilot for enterprise content teams",
    description: "Jasper is an AI writing and content platform built specifically for marketing teams. It offers brand voice consistency, campaign workflow management, and multi-format content generation including blog posts, ads, emails, and social media across enterprise organizations.",
    website_url: "https://www.jasper.ai",
    pricing_model: "paid" as const,
    editor_rating: 4.0,
    key_features: ["Brand voice and style guide enforcement", "Marketing campaign workflows", "Multi-channel content generation", "Team collaboration with approval flows", "Analytics and performance insights"],
    pros: ["Purpose-built for marketing teams", "Excellent template library"],
    cons: ["Expensive for small teams", "Can feel formulaic without careful prompting"],
    use_cases: ["Marketing campaigns", "Brand content creation", "Ad copywriting"],
    who_its_for: ["Marketing teams", "Content managers", "Enterprise"],
    company_name: "Jasper",
    category_slug: "ai-writing",
  },
  {
    name: "Copy.ai",
    slug: "copy-ai",
    tagline: "AI-powered GTM platform for sales and marketing workflows",
    description: "Copy.ai has evolved from a copywriting tool into a comprehensive go-to-market AI platform. It automates sales prospecting, content creation, and marketing workflows with AI agents that can research, write, and execute multi-step business processes.",
    website_url: "https://www.copy.ai",
    pricing_model: "freemium" as const,
    editor_rating: 4.0,
    key_features: ["AI sales prospecting and outreach", "Automated content workflows", "Multi-step AI agent workflows", "CRM integrations", "Brand voice training"],
    pros: ["Strong automation beyond just writing", "Good free tier for individuals"],
    cons: ["Advanced workflow features require paid plans", "Writing quality depends on prompt engineering"],
    use_cases: ["Sales outreach", "Content marketing", "Lead enrichment"],
    who_its_for: ["Sales teams", "Marketers", "Growth teams"],
    company_name: "Copy.ai",
    category_slug: "ai-writing",
  },
  // PRODUCTIVITY
  {
    name: "Perplexity",
    slug: "perplexity",
    tagline: "AI-powered answer engine with real-time web search",
    description: "Perplexity is an AI answer engine that combines large language models with real-time web search to provide sourced, up-to-date answers. It cites sources inline, supports follow-up questions, and offers deep research capabilities for complex queries.",
    website_url: "https://www.perplexity.ai",
    pricing_model: "freemium" as const,
    editor_rating: 4.5,
    key_features: ["Real-time web search with source citations", "Deep research mode", "Follow-up conversational queries", "Collection and sharing features", "API access"],
    pros: ["Excellent for research with transparent sourcing", "Strong free tier"],
    cons: ["Pro subscription needed for best models", "Not ideal for creative tasks"],
    use_cases: ["Research", "Fact-checking", "Quick answers with sources"],
    who_its_for: ["Researchers", "Students", "Knowledge workers"],
    company_name: "Perplexity AI",
    category_slug: "productivity",
  },
  {
    name: "Notion AI",
    slug: "notion-ai",
    tagline: "AI assistant integrated directly into your workspace",
    description: "Notion AI brings AI capabilities directly into the Notion workspace, enabling users to write, summarize, brainstorm, translate, and extract insights from their existing notes and databases. It understands the context of your workspace for relevant assistance.",
    website_url: "https://www.notion.so/product/ai",
    pricing_model: "paid" as const,
    editor_rating: 4.1,
    key_features: ["AI writing and editing within Notion", "Workspace-aware Q&A", "Automatic summarization", "Database autofill", "Multi-language translation"],
    pros: ["Seamlessly integrated into Notion", "Understands workspace context"],
    cons: ["Requires Notion plus AI add-on", "Limited to Notion ecosystem"],
    use_cases: ["Knowledge management", "Meeting notes", "Content drafting"],
    who_its_for: ["Notion users", "Teams", "Project managers"],
    company_name: "Notion",
    category_slug: "productivity",
  },
  {
    name: "Granola",
    slug: "granola",
    tagline: "AI notepad that turns meetings into structured notes",
    description: "Granola is an AI-powered meeting notepad that listens to meetings and automatically generates clean, structured notes. It combines what you type during the meeting with the AI transcript to produce summaries, action items, and follow-ups.",
    website_url: "https://www.granola.so",
    pricing_model: "freemium" as const,
    editor_rating: 4.3,
    key_features: ["Automatic meeting transcription", "Combines manual notes with AI transcript", "Customizable note templates", "Action item extraction", "Works with Zoom, Meet, Teams"],
    pros: ["Elegant minimal design", "Enhances rather than replaces note-taking"],
    cons: ["Desktop app only", "Limited integrations compared to established tools"],
    use_cases: ["Meeting notes", "Action item tracking", "Meeting summaries"],
    who_its_for: ["Professionals", "Managers", "Sales teams"],
    company_name: "Granola",
    category_slug: "productivity",
  },
  // RESEARCH & ANALYSIS
  {
    name: "NotebookLM",
    slug: "notebooklm",
    tagline: "AI research assistant that works with your documents",
    description: "NotebookLM is Google's AI-powered research tool that lets you upload documents, papers, and websites, then ask questions and get sourced answers grounded in your materials. Its Audio Overview feature generates podcast-style discussions of your content.",
    website_url: "https://notebooklm.google.com",
    pricing_model: "free" as const,
    editor_rating: 4.4,
    key_features: ["Upload PDFs, docs, websites, YouTube as sources", "Grounded Q&A with inline citations", "Audio Overview podcast-style summaries", "Notebook guide with briefing docs", "Shared notebooks"],
    pros: ["Excellent for grounded research", "Audio Overview is uniquely engaging", "Free to use"],
    cons: ["Limited to uploaded sources", "Source upload limits"],
    use_cases: ["Academic research", "Document analysis", "Study aid"],
    who_its_for: ["Researchers", "Students", "Analysts"],
    company_name: "Google",
    category_slug: "research-analysis",
  },
  {
    name: "Elicit",
    slug: "elicit",
    tagline: "AI research assistant for academic literature review",
    description: "Elicit is an AI-powered research assistant that helps academics and researchers find, analyze, and synthesize scientific papers. It searches across millions of papers, extracts key data points, and helps organize findings into structured literature reviews.",
    website_url: "https://elicit.com",
    pricing_model: "freemium" as const,
    editor_rating: 4.2,
    key_features: ["Semantic search across 200M+ papers", "Automatic data extraction", "Literature review table generation", "Paper summarization and comparison", "Citation analysis"],
    pros: ["Purpose-built for academic workflows", "Saves hours on literature reviews"],
    cons: ["Focused on academic papers only", "Free tier has usage limits"],
    use_cases: ["Literature reviews", "Academic research", "Systematic reviews"],
    who_its_for: ["Researchers", "Academics", "Graduate students"],
    company_name: "Elicit",
    category_slug: "research-analysis",
  },
  // DESIGN
  {
    name: "Canva AI",
    slug: "canva-ai",
    tagline: "AI-powered design suite for everyone",
    description: "Canva Magic Studio is a suite of AI tools within Canva including Magic Design (auto-layouts), Magic Write (content generation), Magic Eraser, Magic Expand, and text-to-image generation. It makes professional design accessible to non-designers.",
    website_url: "https://www.canva.com/magic",
    pricing_model: "freemium" as const,
    editor_rating: 4.3,
    key_features: ["Magic Design auto-generates layouts", "Text-to-image generation", "Magic Eraser and background removal", "Magic Write for content", "Brand Kit AI"],
    pros: ["Extremely accessible for non-designers", "Comprehensive AI tool suite"],
    cons: ["Less control than professional tools", "Best features require Pro subscription"],
    use_cases: ["Social media graphics", "Presentations", "Marketing materials"],
    who_its_for: ["Small businesses", "Marketers", "Non-designers"],
    company_name: "Canva",
    category_slug: "design",
  },
  // BUSINESS & ENTERPRISE
  {
    name: "Glean",
    slug: "glean",
    tagline: "AI-powered enterprise search and knowledge management",
    description: "Glean is an AI enterprise search platform that connects to all of a company's apps and data sources to provide unified, permission-aware search and AI assistant capabilities across Slack, Drive, Jira, Confluence, and 100+ integrations.",
    website_url: "https://www.glean.com",
    pricing_model: "enterprise" as const,
    editor_rating: 4.3,
    key_features: ["Unified search across 100+ enterprise apps", "Permission-aware results", "AI assistant for company Q&A", "Knowledge graph", "Custom AI apps"],
    pros: ["Solves enterprise knowledge discovery", "Respects existing permissions"],
    cons: ["Enterprise-only pricing", "Requires IT setup"],
    use_cases: ["Enterprise knowledge management", "Employee onboarding", "Internal search"],
    who_its_for: ["Enterprise teams", "IT departments", "Large organizations"],
    company_name: "Glean",
    category_slug: "business-enterprise",
  },
  // DATA & ANALYTICS
  {
    name: "Julius AI",
    slug: "julius-ai",
    tagline: "AI data analyst that turns data into insights instantly",
    description: "Julius AI is a conversational data analysis tool that lets users upload datasets and ask questions in natural language. It generates visualizations, performs statistical analysis, builds predictive models, and exports results without coding.",
    website_url: "https://julius.ai",
    pricing_model: "freemium" as const,
    editor_rating: 4.1,
    key_features: ["Natural language data querying", "Automatic chart generation", "Statistical analysis and modeling", "Supports CSV, Excel, Google Sheets", "Export to reports"],
    pros: ["Makes data analysis accessible", "Fast visualization generation"],
    cons: ["Complex analyses may need verification", "Data upload limits on free tier"],
    use_cases: ["Business reporting", "Data exploration", "Quick analytics"],
    who_its_for: ["Business analysts", "Marketers", "Non-technical teams"],
    company_name: "Julius AI",
    category_slug: "data-analytics",
  },
  // CHATBOTS & ASSISTANTS
  {
    name: "Poe",
    slug: "poe",
    tagline: "All-in-one platform to chat with multiple AI models",
    description: "Poe is an AI chat aggregator by Quora that gives users access to multiple AI models including GPT-4, Claude, Gemini, Llama, and more through a single interface. Users can compare responses, create custom bots, and share them with the community.",
    website_url: "https://poe.com",
    pricing_model: "freemium" as const,
    editor_rating: 4.0,
    key_features: ["Access to 10+ AI models in one interface", "Custom bot creation", "Bot marketplace and community", "Side-by-side model comparison", "API access"],
    pros: ["Single subscription for multiple models", "Easy model comparison"],
    cons: ["Per-message limits on premium models", "Not as feature-rich as native platforms"],
    use_cases: ["AI model comparison", "Custom chatbot creation", "Multi-model access"],
    who_its_for: ["AI enthusiasts", "Developers", "Power users"],
    company_name: "Quora",
    category_slug: "chatbots-assistants",
  },
  {
    name: "Character.ai",
    slug: "character-ai",
    tagline: "Chat with AI characters for entertainment and roleplay",
    description: "Character.ai lets users create and interact with AI characters with distinct personalities. It supports roleplay, creative writing collaboration, language practice, and entertainment through customizable AI personas.",
    website_url: "https://character.ai",
    pricing_model: "freemium" as const,
    editor_rating: 4.0,
    key_features: ["Millions of community-created characters", "Custom character creation", "Group chat with multiple characters", "Voice calling with AI", "Character rooms"],
    pros: ["Massive library of creative characters", "Highly engaging and entertaining"],
    cons: ["Not designed for factual accuracy", "Content filters can be restrictive"],
    use_cases: ["Entertainment", "Creative writing", "Language practice"],
    who_its_for: ["Casual users", "Writers", "Students"],
    company_name: "Character.AI",
    category_slug: "chatbots-assistants",
  },
  // MARKETING
  {
    name: "Synthesia",
    slug: "synthesia",
    tagline: "Create professional AI videos with digital avatars",
    description: "Synthesia is an AI video generation platform that creates professional videos using realistic digital avatars. Users type a script and choose from 200+ avatars and 130+ languages to produce training videos, marketing content, and corporate communications.",
    website_url: "https://www.synthesia.io",
    pricing_model: "paid" as const,
    editor_rating: 4.2,
    key_features: ["200+ realistic AI avatars", "130+ languages with natural lip sync", "Custom avatar creation", "Screen recording integration", "Template library and brand kit"],
    pros: ["Dramatically reduces video production costs", "Excellent for multilingual content"],
    cons: ["Avatars can feel uncanny", "Custom avatars are expensive"],
    use_cases: ["Training videos", "Corporate communications", "Marketing videos"],
    who_its_for: ["L&D teams", "Marketing teams", "Enterprise"],
    company_name: "Synthesia",
    category_slug: "marketing",
  },
];

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-seed-secret");
  if (secret !== "seed-aicensus-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let supabase = createAdminClient();
  if (!supabase) {
    // Fallback to regular client if no service role key
    const { createClient } = await import("@supabase/supabase-js");
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Get all categories to map slugs to IDs
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug");

  const categoryMap = new Map<string, string>();
  for (const cat of categories || []) {
    categoryMap.set(cat.slug, cat.id);
  }

  const results: { name: string; status: string; error?: string }[] = [];

  for (const tool of TOOLS) {
    const { category_slug, ...toolData } = tool;
    const category_id = categoryMap.get(category_slug) || null;

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("tools")
      .select("id")
      .eq("slug", toolData.slug)
      .single();

    if (existing) {
      results.push({ name: toolData.name, status: "skipped (exists)" });
      continue;
    }

    const { error } = await supabase.from("tools").insert({
      ...toolData,
      category_id,
      status: "published",
      is_verified: true,
      published_at: new Date().toISOString(),
    });

    if (error) {
      results.push({ name: toolData.name, status: "error", error: error.message });
    } else {
      results.push({ name: toolData.name, status: "inserted" });
    }
  }

  return NextResponse.json({
    total: TOOLS.length,
    results,
    categoryMap: Object.fromEntries(categoryMap),
  });
}
