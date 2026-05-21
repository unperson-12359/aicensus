// ------------------------------------------------------------
// Programmatic "Best AI tools for X" landing pages.
// Each entry generates a /best/<slug> route. The pages are SEO-shaped:
// hero + editorial intro + ranked tool cards (with editorial pitches) +
// FAQ + related-stack link if applicable.
// ------------------------------------------------------------

export interface BestForPick {
  /** Tool slug (must exist in the directory or the card renders as a stub) */
  slug: string;
  /** One-sentence editorial pitch tying the tool to the persona/use case. */
  pitch: string;
}

export interface BestForPage {
  slug: string;
  /** H1 — the form readers expect from search ("Best AI tools for ___") */
  title: string;
  /** 5-12 word descriptor for the hero */
  tagline: string;
  /** ~50-70 word intro paragraph; varies per page so search engines treat each as unique. */
  intro: string;
  /** Optional pre-built stack slug to cross-link to */
  relatedStack?: string;
  /** Ranked picks — order matters; first is the headline pick. */
  picks: BestForPick[];
  /** ~3-5 FAQ pairs */
  faq: { question: string; answer: string }[];
}

export const BEST_FOR_PAGES: BestForPage[] = [
  {
    slug: "ai-tools-for-product-managers",
    title: "Best AI Tools for Product Managers in 2026",
    tagline: "PM-grade AI for specs, research, and shipping faster.",
    intro:
      "PMs sit on top of a stack of writing, research, and meeting overhead — exactly the work AI shortens most. The picks below are the tools we'd put on a working PM's machine on day one: a thinking partner, a research engine, a notes layer, and a meeting copilot.",
    relatedStack: "build-a-saas",
    picks: [
      { slug: "claude", pitch: "Sparring partner for PRDs, JTBD frames, and spec review — long context handles whole docs without summarization." },
      { slug: "chatgpt", pitch: "Universal swiss-army assistant; especially good for scripted user research, persona generation, and competitive teardowns." },
      { slug: "perplexity", pitch: "Citation-first research replaces 80% of pre-meeting Googling — pull market data, competitor specs, and pricing in minutes." },
      { slug: "notion-ai", pitch: "Where the spec lives. Generates summaries, action items, and Q&A directly inside your existing PM workspace." },
      { slug: "reclaim-ai", pitch: "Protects focus time and schedules around real work automatically. Useful for PMs juggling interviews, standups, and planning blocks." },
      { slug: "fathom", pitch: "Clean meeting recaps and CRM-friendly follow-ups for customer calls, stakeholder reviews, and product interviews." },
      { slug: "read-ai", pitch: "Good for PMs drowning in cross-functional communication: summaries across meetings, email, and action items." },
      { slug: "otter-ai", pitch: "Best when you need transcripts your stakeholders can search later — interviews, customer calls, exec recordings." },
    ],
    faq: [
      { question: "What's the single most useful AI tool for a PM?", answer: "If you can only have one, pick Claude or ChatGPT. They cover spec review, brainstorming, research, and customer letters in one surface. Add a meeting tool second." },
      { question: "Can AI replace a PM?", answer: "No. AI compresses the writing-and-research scaffolding around PM work, but the judgment calls — what to build, why, for whom, when — are exactly the parts these tools don't make." },
      { question: "Is there a free PM stack?", answer: "Yes — Claude (free tier), Perplexity (free tier), and Otter (free tier) cover the basics. You'll outgrow the limits within a quarter, but it's enough to validate the workflow before you pay." },
    ],
  },
  {
    slug: "ai-tools-for-solo-founders",
    title: "Best AI Tools for Solo Founders (2026)",
    tagline: "The 6 tools that replace a small team — for $100/mo.",
    intro:
      "When you're the engineer, designer, marketer, and ops person, AI is leverage you can't afford to skip. These are the picks that survive the first 12 months — the ones that compound with use, not the demos that look great in a tweet.",
    relatedStack: "indie-hacker-starter",
    picks: [
      { slug: "cursor", pitch: "Non-negotiable. The single tool with the highest ROI per dollar for any technical founder." },
      { slug: "claude", pitch: "Senior engineer, PM, and copywriter on call. Use it before you write code, not after — saves the rewrite." },
      { slug: "v0", pitch: "Skip the part of building a product that doesn't differentiate you. Generate the chrome, ship the substance." },
      { slug: "perplexity", pitch: "Replaces three hours of Googling with a five-minute conversation that cites its sources." },
      { slug: "ollama", pitch: "Run open-weight models locally for free — privacy-sensitive workloads, rate-limit-sensitive ones, or just frugal ones." },
      { slug: "raycast", pitch: "Not strictly AI, but the launcher that ties the rest together. Indie hacking is all context switches; this collapses them." },
    ],
    faq: [
      { question: "What's the cheapest version of this stack?", answer: "Free tiers of Claude + Perplexity + Ollama, plus Cursor's $20/mo Pro plan. ~$20/mo all in. You'll feel limits within weeks, but it's the right starting point." },
      { question: "What's the most expensive?", answer: "Cursor Business ($40/mo), Claude Pro ($20/mo), Perplexity Pro ($20/mo), and pay-per-use credits on a few others — call it $100-150/mo. Cheaper than one part-time hire's lunch budget." },
      { question: "Is Cursor really worth it over free alternatives?", answer: "Yes, if you ship code daily. The agentic refactors and tab-complete that understands your codebase save 5-10 hours/week — every founder we've talked to says it's the last tool they'd cut." },
    ],
  },
  {
    slug: "free-ai-writing-tools",
    title: "Best Free AI Writing Tools in 2026",
    tagline: "Genuinely free. No credit card. No 7-day trial trap.",
    intro:
      "Most \"free\" AI writing tools are 14-day trials in disguise. The picks below are actually free — sustainable free tiers, open-source options, or freemium where the free tier is good enough for real work. Skip the rest.",
    picks: [
      { slug: "claude", pitch: "Free tier handles everyday writing — drafts, edits, brainstorms. Limits reset daily; usually enough unless you're writing all day." },
      { slug: "chatgpt", pitch: "Free tier still includes the latest model with usage caps. The best general-purpose writing AI without paying." },
      { slug: "grok", pitch: "Free for X users with generous daily limits. Punchier voice than the other three; useful when tone matters." },
      { slug: "grammarly", pitch: "Free version covers grammar and clarity. Pro adds tone — but the free version alone handles 90% of editing needs." },
      { slug: "wordtune", pitch: "Sentence-level rewriter. The free tier gets you 10 rewrites a day — enough for the lines that aren't landing." },
      { slug: "perplexity", pitch: "Free research engine, citations included. Pair with any of the above when your writing needs facts." },
    ],
    faq: [
      { question: "Are these tools actually free forever?", answer: "Yes — every tool listed has a permanent free tier (not a trial). Limits exist (daily message caps, slower models, fewer features), but you can use each one indefinitely without paying." },
      { question: "Which is best for long-form writing?", answer: "Claude's free tier handles long-form best — bigger context window means it can hold an entire chapter without losing track. ChatGPT is close second." },
      { question: "Is there a free AI ghostwriter?", answer: "No tool actually \"writes for you.\" These all assist — drafting, editing, brainstorming. Anything claiming full autonomy at the free tier is selling something." },
    ],
  },
  {
    slug: "ai-tools-for-developers",
    title: "Best AI Coding Assistants in 2026",
    tagline: "The IDE companions that actually ship code.",
    intro:
      "AI coding has split into two camps: tab-complete that understands your file, and agents that understand your repo. The picks below are tested on real codebases (not toy projects) and ranked by what experienced engineers actually keep paying for.",
    relatedStack: "indie-hacker-starter",
    picks: [
      { slug: "cursor", pitch: "The category leader. Multi-file edits, agent mode, and tab-complete that understands your project — all in one IDE." },
      { slug: "claude", pitch: "The reasoning model behind much of Cursor's magic. Use directly for code review, architecture, and debugging tough bugs." },
      { slug: "github-copilot", pitch: "Tightest GitHub integration; Copilot Chat now ships agent workflows too. The default if you live in VS Code or JetBrains." },
      { slug: "windsurf", pitch: "Cursor's main competitor. Cleaner UI, comparable agent capabilities — worth comparing if Cursor doesn't click." },
      { slug: "cline", pitch: "Open-source VS Code agent for developers who want terminal/file control and bring-your-own-model flexibility." },
      { slug: "coderabbit", pitch: "AI code review that lives in pull requests. Useful when teams want a second reviewer, not another editor." },
      { slug: "qodo", pitch: "Code quality and review automation for teams that want AI help without skipping test and governance discipline." },
      { slug: "devin", pitch: "Autonomous agent that takes a ticket and ships a PR. Best for boilerplate and migration work; not yet a peer reviewer." },
    ],
    faq: [
      { question: "Cursor or GitHub Copilot?", answer: "Cursor for solo and small-team work where agent mode and multi-file edits matter most. Copilot when you need GitHub-native workflows or your org is already on it." },
      { question: "Is there a free option?", answer: "Codeium has a long-running free tier; Cursor and Copilot offer 14-day trials but no permanent free tier. For free LLM-backed coding, ChatGPT and Claude free tiers handle small tasks." },
      { question: "Will AI replace developers?", answer: "It's already changing the job. Senior engineers are getting more leverage; junior engineers need to skill up faster. The job description is shifting from \"writes code\" to \"directs and reviews code.\"" },
    ],
  },
  {
    slug: "best-ai-coding-agents",
    title: "Best AI Coding Agents in 2026",
    tagline: "Repo-aware agents for tickets, refactors, and pull requests.",
    intro:
      "AI coding agents are moving beyond autocomplete into delegated engineering work: planning changes, editing multiple files, running commands, and opening PRs. The picks below favor tools that operate on real repositories, expose enough control for senior engineers, and fit into the review loop instead of pretending review is optional.",
    relatedStack: "indie-hacker-starter",
    picks: [
      { slug: "claude-code", pitch: "Best terminal-native agent for serious repo work: reads code, edits files, runs commands, and fits the human review loop." },
      { slug: "openai-codex", pitch: "OpenAI's coding agent for implementation tasks, reviewable diffs, and end-to-end software maintenance workflows." },
      { slug: "cursor", pitch: "Best daily-driver agent inside an IDE: fast multi-file edits, repo context, and enough manual control to keep senior engineers comfortable." },
      { slug: "cline", pitch: "Best open-source option for agentic VS Code workflows, especially if you want provider choice and transparent behavior." },
      { slug: "augment-code", pitch: "The large-codebase specialist. Deep context makes it useful when simple chat assistants lose the plot." },
      { slug: "coderabbit", pitch: "PR-native review agent that helps catch review gaps after humans and coding agents generate the diff." },
      { slug: "github-copilot", pitch: "The safest default for GitHub-heavy teams that want agentic coding without leaving existing enterprise workflows." },
      { slug: "gemini-cli", pitch: "Open-source command-line agent for developers who want Gemini in the terminal and a hackable workflow." },
    ],
    faq: [
      { question: "What makes a coding assistant an agent?", answer: "An agent can plan and execute multi-step work across files, tools, commands, and sometimes pull requests. Autocomplete helps write a line; agents try to complete a task." },
      { question: "Should agents commit directly to main?", answer: "No. Treat agent output like a junior engineer's PR: review the diff, run tests, and keep ownership with the human maintainer." },
      { question: "Which coding agent should a small team try first?", answer: "Cursor or GitHub Copilot. Cursor is stronger as a daily AI-native IDE; Copilot is easier to adopt in GitHub-centered teams." },
    ],
  },
  {
    slug: "ai-browsers",
    title: "Best AI Browsers in 2026",
    tagline: "Browsing with summarization, research, and agentic web tasks.",
    intro:
      "AI browsers sit between search engines and full agents: they summarize pages, answer questions over open tabs, research across the web, and increasingly take actions for you. This category is still early, so the best stack mixes dedicated AI browsing surfaces with search and web-agent infrastructure.",
    picks: [
      { slug: "chatgpt-atlas", pitch: "OpenAI's browser for people who want ChatGPT built directly into reading, research, and page-aware workflows." },
      { slug: "perplexity-comet", pitch: "Best search-first AI browser: Perplexity's answer engine wrapped around tabs, sources, and web research." },
      { slug: "dia", pitch: "The Browser Company's AI-first bet for everyday browsing, writing, and tab-context workflows." },
      { slug: "arc-max", pitch: "Lightweight AI inside Arc Browser: summaries, tab help, and opt-in browsing assistance without switching browsers." },
      { slug: "perplexity", pitch: "The most reliable AI-native browsing habit today: search, citations, follow-ups, and source trails in one surface." },
      { slug: "genspark", pitch: "AI search alternative that turns web research into synthesized pages and organized answers." },
      { slug: "tavily", pitch: "Developer-facing search and extraction API for teams building browser agents or web-aware assistants." },
    ],
    faq: [
      { question: "Are AI browsers different from AI search engines?", answer: "The line is blurry. AI search answers questions over the web; AI browsers also work with tabs, pages, sessions, forms, and eventually actions." },
      { question: "Can an AI browser replace Chrome?", answer: "Not for most people yet. The practical workflow is to keep your normal browser and add an AI browsing or research layer where it saves time." },
      { question: "What matters most for AI browsing?", answer: "Source quality, controllability, and privacy. If a tool can read tabs or take actions, you need clear boundaries and a review step." },
    ],
  },
  {
    slug: "ai-model-leaderboards",
    title: "Best AI Model Leaderboards and Benchmarks in 2026",
    tagline: "Track model quality before you pick an API.",
    intro:
      "Model choice changes fast, and vendor pages rarely tell the whole story. Leaderboards and benchmark hubs help teams compare reasoning, coding, speed, cost, context, and open-weight options before committing to an API or deployment path.",
    relatedStack: "production-ai-infrastructure",
    picks: [
      { slug: "lmarena", pitch: "The default community signal for side-by-side model preference testing across frontier and open models." },
      { slug: "artificial-analysis", pitch: "Best for practical API buyers: quality, speed, latency, and price comparisons in one place." },
      { slug: "swe-bench", pitch: "The coding-agent benchmark everyone watches when claims shift from demo videos to real GitHub issues." },
      { slug: "stanford-helm", pitch: "Research-grade evaluation framework for teams that need transparent, reproducible model testing." },
      { slug: "hugging-face", pitch: "The open-model hub where leaderboards, model cards, datasets, and community evaluation all meet." },
      { slug: "openrouter", pitch: "Useful for comparing real model availability, pricing, and routing before standardizing on one provider." },
    ],
    faq: [
      { question: "Can leaderboards pick a model for me?", answer: "No. They narrow the shortlist. Always test your own prompts, data, latency needs, and failure cases before standardizing." },
      { question: "Which benchmark matters most?", answer: "For product work, task-specific evals beat generic scores. Use leaderboards for discovery, then build a small eval set from your real workload." },
      { question: "Why do benchmark rankings change so often?", answer: "Models, prompts, providers, and eval methods all change. Treat rankings as a current signal, not a permanent truth." },
    ],
  },
  {
    slug: "ai-infrastructure-tools",
    title: "Best AI Infrastructure Tools in 2026",
    tagline: "APIs, routing, inference, and model deployment.",
    intro:
      "Once an AI feature has users, infrastructure matters more than demos: latency, routing, observability, cost controls, model fallback, and deployment ownership. These picks cover the practical path from calling frontier APIs to serving open models at production scale.",
    relatedStack: "production-ai-infrastructure",
    picks: [
      { slug: "hugging-face", pitch: "The open-model hub: models, datasets, Spaces, inference endpoints, and the community graph that powers discovery." },
      { slug: "replicate", pitch: "Fastest path from model demo to hosted API for image, video, audio, and open-source model experiments." },
      { slug: "fal-ai", pitch: "Generative media infrastructure when speed and API ergonomics matter for image and video products." },
      { slug: "modal", pitch: "Python-native serverless GPUs for batch jobs, inference endpoints, and AI backend work without cloud ceremony." },
      { slug: "baseten", pitch: "Production inference platform for teams serving custom and open models at scale." },
      { slug: "pinecone", pitch: "Managed vector database for RAG, semantic search, recommendations, and production retrieval memory." },
      { slug: "openrouter", pitch: "Model router for comparing and switching providers without rewriting your app around every API." },
    ],
    faq: [
      { question: "Should I start with hosted APIs or self-hosting?", answer: "Start hosted unless cost, privacy, latency, or control forces the issue. Self-hosting pays off later, but it adds operational work immediately." },
      { question: "Why use a router?", answer: "Routers make it easier to compare models, fail over when a provider has issues, and optimize cost by sending easy tasks to cheaper models." },
      { question: "What is the first infra metric to watch?", answer: "Cost per successful task. Token cost alone misses retries, latency, failures, and the human time spent fixing bad outputs." },
    ],
  },
  {
    slug: "ai-tools-for-marketers",
    title: "Best AI Tools for Marketers in 2026",
    tagline: "Content velocity without the slop.",
    intro:
      "Marketing AI is full of one-trick demos. The stack below is what marketing teams actually run — a brief writer, a copy generator, a research engine, and the asset-creation tools that close the loop from idea to launched campaign.",
    relatedStack: "launch-a-newsletter",
    picks: [
      { slug: "claude", pitch: "Best at preserving brand voice when given samples. Use for briefs, long-form copy, and editing — not just generation." },
      { slug: "jasper", pitch: "Marketing-specific UI with built-in brand voice and templates. Higher learning curve than ChatGPT but tighter to the workflow." },
      { slug: "perplexity", pitch: "The fastest way to do competitive research, find pricing benchmarks, and source quotes — citations included." },
      { slug: "clay", pitch: "GTM enrichment and AI prospect research for marketers who need sharper account lists and outbound context." },
      { slug: "opus-clip", pitch: "Long-form video → 10 short clips ranked by virality. The single biggest leverage tool for marketers in 2026." },
      { slug: "capcut", pitch: "Fast social-first editor for captions, templates, and creator ads when the team needs assets today." },
      { slug: "canva", pitch: "Magic Design generates on-brand visuals across formats. Where the team operationalizes the brand without bothering design." },
      { slug: "ideogram", pitch: "Best in class at text-in-image. The tool to use when ad creative needs legible copy baked into the visual." },
    ],
    faq: [
      { question: "Will AI write my entire newsletter?", answer: "It can, but you shouldn't let it. The newsletters that grow have voice — AI is a draft accelerant, not a replacement for the take. Use it to get to a 70% draft fast, then own the last 30%." },
      { question: "Best AI for SEO content?", answer: "Claude or Jasper for the writing, Perplexity for research, and a human editor for the QA pass. Pure-AI SEO content is now a Google demotion signal — you need a human in the loop." },
      { question: "Are there free AI marketing tools?", answer: "Yes — Claude, ChatGPT, and Perplexity all have free tiers that cover most marketing tasks. Canva Free covers basic visuals. The paid layers add scale, brand controls, and team collaboration." },
    ],
  },
  {
    slug: "ai-tools-for-students",
    title: "Best AI Tools for Students in 2026",
    tagline: "Studying, writing, and researching — done right.",
    intro:
      "Students get the most out of AI when it's used for understanding, not shortcutting. These tools accelerate the parts of study that are mechanical — finding sources, summarizing, editing — without doing your thinking for you. (Use ethically.)",
    picks: [
      { slug: "claude", pitch: "Best long-form thinking partner — paste an entire reading, ask follow-up questions, edit your draft. Free tier covers most students." },
      { slug: "notebooklm", pitch: "Upload your readings, ask synthesis questions across all of them. The audio overviews are unreasonably good for commute studying." },
      { slug: "elicit", pitch: "Semantic search across 200M papers. Skip keyword-Googling — ask the actual research question." },
      { slug: "consensus", pitch: "When you find a strong claim in a paper, see how many other studies agree. Built for spot-checking before you cite." },
      { slug: "perplexity", pitch: "Citations on every answer. The research tool to use when Wikipedia isn't enough but a full lit review is too much." },
      { slug: "grammarly", pitch: "Last pass before submission. Catches the typos and tone slips a tired final-edit misses." },
    ],
    faq: [
      { question: "Will my school catch me using AI?", answer: "Detectors are unreliable, but most schools now treat undisclosed AI use as plagiarism. Use AI to assist your work — drafts, edits, research — but disclose if your school requires it. The tools above support legitimate use." },
      { question: "Is ChatGPT enough on its own?", answer: "For general help, yes. For research, no — ChatGPT hallucinates citations. Pair it with NotebookLM (your own sources) and Elicit/Consensus (peer-reviewed papers) for serious academic work." },
      { question: "Are these free for students?", answer: "Most have free tiers; ChatGPT, Claude, NotebookLM, Elicit, Consensus, and Perplexity all have generous free access. Grammarly is freemium. The free stack covers undergraduate work entirely." },
    ],
  },
  {
    slug: "ai-tools-for-content-creators",
    title: "Best AI Tools for Content Creators in 2026",
    tagline: "From shoot to ten distribution assets, automated.",
    intro:
      "Content creators don't need the most AI tools — they need the right ones at each step of the funnel: hook, retention, distribution. The stack below is what creators who shoot once and publish everywhere actually use.",
    relatedStack: "video-content-pipeline",
    picks: [
      { slug: "descript", pitch: "Edit video by editing the transcript. The single highest-leverage tool for any creator who'd rather make than edit." },
      { slug: "capcut", pitch: "The default social video workbench for quick captions, templates, effects, and phone-to-feed edits." },
      { slug: "veed", pitch: "Browser-based editor for captions, subtitles, screen recordings, and lightweight team video production." },
      { slug: "opus-clip", pitch: "Long-form → 10 short-form clips, ranked by virality. The behind-the-scenes engine of feeds that look like magic." },
      { slug: "elevenlabs", pitch: "Multilingual dubs that preserve your voice. One video in English becomes five videos in five languages." },
      { slug: "runway", pitch: "B-roll on demand. Generate the shots you couldn't or didn't film, faster than searching stock libraries." },
      { slug: "ideogram", pitch: "Thumbnails and graphics with legible text. The image generator for creators who need their text to actually read." },
      { slug: "claude", pitch: "Script writing, hook tightening, title testing. Better script doctor than any YouTube guru." },
    ],
    faq: [
      { question: "Do I need all of these?", answer: "No. Start with one tool per funnel stage — Descript for editing, Opus for clipping, Claude for writing. Add the rest only when the volume justifies it." },
      { question: "Is AI-generated content punished by YouTube?", answer: "AI assistance is fine; AI-mass-production isn't. YouTube cracks down on channels that publish high volumes of AI-generated content with no human voice or value-add. Use AI to amplify your work, not replace it." },
      { question: "What's the smallest possible stack?", answer: "Descript + Opus Clip + Claude. Three tools, ~$80/mo total, covers ideation through distribution for most creators." },
    ],
  },
  {
    slug: "ai-tools-for-designers",
    title: "Best AI Tools for Designers in 2026",
    tagline: "AI as a design accelerant, not a replacement.",
    intro:
      "AI didn't replace designers; it changed which parts of the work compress. The tools below are the ones designers integrate into existing workflows — image generation, layout assistance, brand systems, and asset production.",
    relatedStack: "brand-identity-design",
    picks: [
      { slug: "midjourney", pitch: "Still the gold standard for aesthetic image generation. Where designers go for moodboards, concepts, and hero illustrations." },
      { slug: "ideogram", pitch: "When the image needs legible type. Better than Midjourney for posters, ad creative, and anything text-heavy." },
      { slug: "recraft", pitch: "Best fit for vector-like brand assets, icons, and controlled design graphics instead of pure prompt art." },
      { slug: "napkin-ai", pitch: "Turns rough strategy or product text into editable diagrams and presentation-ready visuals." },
      { slug: "figma-ai", pitch: "AI inside Figma — layout assistance, generation, and template scaling. The path of least resistance if you live in Figma." },
      { slug: "framer", pitch: "AI-generated layouts that publish to a live URL. Useful for landing pages and sites that don't justify a code path." },
      { slug: "looka", pitch: "Logo system generator that exports a full kit. Not for branding-first companies, but more than enough for 90% of startups." },
      { slug: "canva", pitch: "Magic Design for asset production at scale — social, decks, docs. Where the brand operationalizes." },
    ],
    faq: [
      { question: "Will AI replace designers?", answer: "It's replacing the production work, not the design work. The taste, judgment, and systems thinking are exactly the things AI doesn't do well — yet. Senior designers are getting more leverage; junior production roles are most at risk." },
      { question: "Best AI for logo design?", answer: "Looka for fast, generic logo kits. For something distinctive, use Midjourney/Ideogram for direction-finding, then refine in Illustrator or Figma. Don't trust AI to ship the final logo." },
      { question: "Is Midjourney still the best?", answer: "For aesthetic quality, yes. For text-in-image, Ideogram wins. For commercial use, Adobe Firefly is the safest from a licensing perspective. Most designers run two or three of these depending on the brief." },
    ],
  },
  {
    slug: "open-source-ai-tools",
    title: "Best Open-Source AI Tools in 2026",
    tagline: "Self-hostable, forkable, no vendor lock-in.",
    intro:
      "Open-source AI is no longer the consolation prize — it's competitive on capability and decisive on cost, privacy, and control. The tools below are the open-source options that have crossed the production-ready bar.",
    picks: [
      { slug: "ollama", pitch: "Run open-weight models locally with one command. The friendliest entry point to local AI." },
      { slug: "llama-cpp", pitch: "The local inference workhorse behind countless desktop and server deployments. Boring in the best possible way." },
      { slug: "vllm", pitch: "High-throughput open-source serving for serious inference workloads. The pick once local demos become production traffic." },
      { slug: "llamaindex", pitch: "Open-source RAG framework. The fastest path from documents to a production retrieval pipeline." },
      { slug: "langchain", pitch: "Open-source agent and chain orchestration. Polarizing in the community, but ubiquitous in real codebases." },
      { slug: "flux", pitch: "Open-weight image generation that rivals closed-source quality. The bedrock of community fine-tunes in 2026." },
    ],
    faq: [
      { question: "Are open-source models as good as GPT-4 or Claude?", answer: "Closed-source still leads at the absolute frontier (reasoning, agentic work, longest context). For the 80% of tasks below the frontier, open-source models are competitive — and you control the deployment." },
      { question: "What hardware do I need to run these?", answer: "For 7B-13B models, a modern Mac with 16-32GB RAM works. For 70B+ models, you'll want a GPU server (A100, H100) or a cloud inference provider. Ollama handles quantization automatically for resource-constrained setups." },
      { question: "Why pick OSS over closed-source?", answer: "Three reasons: privacy (data doesn't leave your infrastructure), cost (no per-token pricing), and control (no model deprecation, no surprise rate limits). Pay the OSS tax in setup time; collect the dividend forever after." },
    ],
  },
  {
    slug: "ai-tools-for-podcasters",
    title: "Best AI Tools for Podcasters in 2026",
    tagline: "Record-to-RSS in two hours, not two days.",
    intro:
      "Podcasts die from production friction. The stack below cuts the edit-publish loop from a day to an evening — which is how a weekly show survives month three. Pick the ones that fit your format.",
    relatedStack: "podcast-production",
    picks: [
      { slug: "descript", pitch: "Edit podcasts by editing the transcript. The category-defining tool — not faster than a pro editor, but you can do it yourself." },
      { slug: "otter-ai", pitch: "Live transcription with speaker labels for interviews. Cuts post-recording show-notes prep in half." },
      { slug: "elevenlabs", pitch: "Voice cloning for intros, pickups, and multilingual dubs. Solo podcasters get a production-grade voice budget for $5/mo." },
      { slug: "claude", pitch: "Show notes, timestamped chapters, and quotable lines from a transcript. Two hours of show-notes work, gone." },
      { slug: "deepgram", pitch: "Transcription API at scale. When the volume makes paid tools expensive, Deepgram's pay-per-minute model wins." },
      { slug: "opus-clip", pitch: "Audiograms for social. The 60-second clip pipeline that grows podcasts you didn't know you had a clip pipeline for." },
    ],
    faq: [
      { question: "What's the absolute minimum tool I need?", answer: "Descript. It records, transcribes, edits, exports, and publishes — one tool, one subscription. Add others only as your show grows." },
      { question: "Can I clone my voice ethically?", answer: "Yes — clone your own voice for pickups and intros. Don't clone other people's voices without consent. ElevenLabs has clear consent flows; use them." },
      { question: "Are AI-generated podcasts a thing?", answer: "Technically yes; commercially, they don't grow. Audiences want hosts they trust. Use AI for production, not the conversation." },
    ],
  },
  {
    slug: "ai-image-generators",
    title: "Best AI Image Generators in 2026",
    tagline: "Aesthetic, photorealistic, text-legible — pick your axis.",
    intro:
      "Image generation has split: aesthetics (Midjourney), text fidelity (Ideogram), open-source flexibility (Flux), and commercial safety (Adobe Firefly). Each pick below wins on a different axis — choose by what you're shipping.",
    picks: [
      { slug: "midjourney", pitch: "Best aesthetic quality, period. The default for moodboards, hero art, concept work — anywhere taste matters more than control." },
      { slug: "dall-e-3", pitch: "Tightly integrated with ChatGPT; best at following prompts literally. Less artistic, more reliable." },
      { slug: "ideogram", pitch: "The text-in-image king. Posters, ads, anything where typography is part of the art." },
      { slug: "recraft", pitch: "Stronger for controlled graphics, icons, and brand assets than generic image generators." },
      { slug: "flux", pitch: "Open-weight quality that rivals Midjourney. The pick for self-hosting, fine-tuning, or running outside US infrastructure." },
      { slug: "topaz-labs", pitch: "The finishing layer: upscale, denoise, sharpen, and rescue image or video assets before delivery." },
      { slug: "leonardo-ai", pitch: "Production-ready visual assets for games, marketing, design. Strong fine-tuning workflow." },
      { slug: "adobe-firefly", pitch: "Commercially safe — trained on licensed data. The pick when the legal team is in the loop." },
    ],
    faq: [
      { question: "Which is best for marketing?", answer: "Adobe Firefly for safety, Ideogram for text-heavy creative, Midjourney for hero shots. Most marketing teams run two or three depending on the brief." },
      { question: "Are AI images copyright-free?", answer: "It depends on the tool and jurisdiction. Adobe Firefly explicitly indemnifies commercial use; Midjourney's commercial license requires a paid plan. Always check the ToS for your specific use case." },
      { question: "Can I run these locally?", answer: "Flux yes (open weights). Stable Diffusion variants yes. Midjourney, DALL-E, Firefly — no, all closed-source SaaS." },
    ],
  },
  {
    slug: "ai-video-generators",
    title: "Best AI Video Generators in 2026",
    tagline: "Text-to-video that's actually usable.",
    intro:
      "AI video crossed the usable threshold in 2025-2026 — outputs are now good enough for B-roll, hero shots, and short-form social content. The picks below are ranked by quality per dollar, with notes on where each one fits in a real production pipeline.",
    picks: [
      { slug: "runway", pitch: "The professional pick. Strong control surfaces, image-to-video, motion brush. Where pros do iterative work." },
      { slug: "google-flow", pitch: "Google's AI filmmaking surface for storyboarding and directing cinematic scenes with its generative media models." },
      { slug: "pika", pitch: "Fast, fun, social-first. Great for short-form clips and quick experiments when iteration speed matters." },
      { slug: "luma-dream-machine", pitch: "Strong physics and camera-move quality. The pick for cinematic shots and product renders." },
      { slug: "kling-ai", pitch: "High-quality text-to-video and image-to-video with a strong creative community and competitive pricing profile." },
      { slug: "hailuo-ai", pitch: "MiniMax's creative video platform, useful for fast social-first video experiments and prompt-to-video workflows." },
      { slug: "heygen", pitch: "Avatar-driven video at production quality. Different category — for talking-head content from a script, not creative video." },
    ],
    faq: [
      { question: "Is AI video ready for client work?", answer: "For B-roll and shorts, yes. For hero ads and brand spots, sometimes — depends on tolerance for the AI \"look.\" Pure-AI video at the high end still struggles with continuity and physics; AI-assisted (mixed with real footage) is the safer play." },
      { question: "Cheapest option?", answer: "Most have free trial credits. For sustained use, Pika, Kling, and Runway have the most affordable mid-tier plans." },
      { question: "Can I generate longer clips?", answer: "Most cap at 5-20 seconds per generation. For longer videos, generate clips and stitch in an editor (Descript, Runway, Premiere). Native long-form generation isn't here yet at quality." },
    ],
  },
  {
    slug: "no-code-ai-app-builders",
    title: "Best No-Code AI App Builders in 2026",
    tagline: "From idea to live app without a codebase.",
    intro:
      "AI app builders compressed the time-to-prototype from weeks to hours. The picks below are ordered by how production-ready the output is. Use the early ones to validate; graduate to Replit or a real codebase when traction appears.",
    relatedStack: "build-a-saas",
    picks: [
      { slug: "bolt-new", pitch: "Fastest path from prompt to running Next.js + Supabase app. Throwaway prototyping at its sharpest." },
      { slug: "lovable", pitch: "Conversational app building with a focus on iteration speed. Strong for product-led founders without engineering background." },
      { slug: "v0", pitch: "Vercel's UI generator. Outputs production-quality React + Tailwind that drops into a real codebase — bridge from no-code to code." },
      { slug: "replit", pitch: "Replit Agent now builds full backends with auth and DB. The most production-grade output in this group." },
      { slug: "framer", pitch: "For sites and landing pages, not apps. AI-generated layouts that publish to a live URL with zero code." },
      { slug: "cursor", pitch: "When you outgrow no-code, this is the IDE that meets you halfway. Conversational refactoring of real code." },
    ],
    faq: [
      { question: "Can I really ship a real product without code?", answer: "Yes — for simple apps, MVPs, and landing pages. For anything complex (custom auth, multi-tenant, deep integrations), you'll outgrow no-code in months. Start no-code, port to code when traction demands it." },
      { question: "Bolt or Lovable?", answer: "Bolt is faster for technical-leaning founders comfortable with the underlying stack. Lovable is friendlier for non-technical builders. Try both — they each have free tiers." },
      { question: "What about backend and database?", answer: "Bolt and Lovable both ship Supabase by default; Replit has its own database. The question becomes vendor lock-in once you scale — plan to port to a managed Postgres at some point." },
    ],
  },
  {
    slug: "ai-tools-for-research",
    title: "Best AI Tools for Research in 2026",
    tagline: "Lit reviews, synthesis, and writing — at graduate scale.",
    intro:
      "Research is a throughput problem: read 40 papers to cite 10. The tools below remove the mechanical overhead — semantic search, multi-paper synthesis, citation tracking — so you can spend more time on the part that actually matters.",
    relatedStack: "academic-research-helper",
    picks: [
      { slug: "elicit", pitch: "Semantic search across 200M papers. Asks the research question directly instead of keyword-matching." },
      { slug: "consensus", pitch: "Sees how many studies agree with a claim, with effect sizes. The spot-check before you cite." },
      { slug: "notebooklm", pitch: "Upload 20 PDFs, ask synthesis questions. Audio overviews are unreasonably good for unfamiliar fields." },
      { slug: "hebbia", pitch: "Enterprise-grade document research for analysts reviewing dense financial, legal, or consulting source material." },
      { slug: "genspark", pitch: "AI search engine for fast synthesized research pages when you need breadth before depth." },
      { slug: "openevidence", pitch: "Clinical evidence search for medical questions where source-grounded answers matter more than chatbot fluency." },
      { slug: "perplexity", pitch: "Citation-first search. The substitute for general Googling when you need verifiable sources fast." },
      { slug: "semantic-scholar", pitch: "The canonical open academic graph. Free, and the bedrock under several other tools above." },
      { slug: "connected-papers", pitch: "Visualize a paper's intellectual lineage. Find load-bearing citations the paper itself didn't cite." },
    ],
    faq: [
      { question: "Will AI hallucinate fake papers?", answer: "ChatGPT and Claude will. The tools above (Elicit, Consensus, Semantic Scholar, NotebookLM-with-your-PDFs) are grounded in real corpora and don't fabricate citations. Always verify links — even with these — before you cite." },
      { question: "Is Perplexity enough on its own?", answer: "For background research, yes. For peer-reviewed academic work, no — you need Elicit/Consensus/Semantic Scholar for the actual papers, then Perplexity for context." },
      { question: "Are these free?", answer: "Most have free tiers — Elicit, Consensus, NotebookLM, Semantic Scholar, Connected Papers all offer meaningful free use. Perplexity Pro adds depth but the free tier is enough for casual research." },
    ],
  },
  {
    slug: "ai-tools-under-20-dollars",
    title: "Best AI Tools Under $20/Month in 2026",
    tagline: "Maximum leverage at minimum subscription cost.",
    intro:
      "Most AI tools cluster at the same $20/mo price point — but the value per dollar varies wildly. The picks below are the ones that consistently come up as keepers when people prune their subscriptions, ranked by what you'll actually use daily.",
    picks: [
      { slug: "claude", pitch: "Claude Pro at $20/mo unlocks the long context, fewer rate limits, and the latest model. Best $20 most knowledge workers spend." },
      { slug: "chatgpt", pitch: "ChatGPT Plus at $20/mo: the latest models, GPTs, image gen, and voice. Worth it if you live in OpenAI's ecosystem." },
      { slug: "perplexity", pitch: "Pro at $20/mo: deeper research, file uploads, and Spaces. The best research tool dollar for dollar." },
      { slug: "notion-ai", pitch: "Add-on under $10/mo. Writes, summarizes, and Q&As inside your existing Notion — no context-switching tax." },
      { slug: "grammarly", pitch: "Pro at $12/mo. Tone, clarity, and brand-voice fixes. The catch-the-typo insurance for everything you write." },
      { slug: "raycast", pitch: "Pro at $8/mo with AI access. Launcher, AI quick-prompt, snippet manager — pays itself back in seconds saved per day." },
    ],
    faq: [
      { question: "If I can only pay for one, which?", answer: "Claude Pro or ChatGPT Plus — they cover 80% of what most people pay AI for. Pick whichever you find yourself using more in the free tier." },
      { question: "Are there genuinely free tools?", answer: "Yes — most of the above have free tiers. The $20 unlocks higher limits and the latest models. If you use AI casually (a few times a week), free is enough." },
      { question: "Why are they all $20?", answer: "OpenAI's ChatGPT Plus set the price; everyone followed. The economics of frontier-model inference roughly support this price for prosumer use. Some (Notion AI, Raycast Pro) sit lower at $8-10." },
    ],
  },
];

export function getBestForPagesForTool(slug: string, limit = 3): BestForPage[] {
  return BEST_FOR_PAGES.filter((page) =>
    page.picks.some((pick) => pick.slug === slug)
  ).slice(0, limit);
}

export function getBestForBySlug(slug: string): BestForPage | undefined {
  return BEST_FOR_PAGES.find((p) => p.slug === slug);
}

export function getAllBestForSlugs(): string[] {
  return BEST_FOR_PAGES.map((p) => p.slug);
}
