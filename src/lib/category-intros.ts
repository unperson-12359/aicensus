// ------------------------------------------------------------
// Editorial intros for /categories/<slug> pages.
// Handwritten, category-specific copy that de-thins the category
// pages without any DB schema change. Facts below (pricing models,
// tool membership) were verified against the live catalog on
// 2026-07-20. Intros are 150-300 words each; FAQs exist only for
// the largest categories.
// ------------------------------------------------------------

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryIntro {
  /** Intro copy. Paragraphs separated by a blank line (\n\n). */
  intro: string;
  /** Optional FAQ pairs — rendered as a section plus FAQPage JSON-LD. */
  faqs?: CategoryFaq[];
  /** Optional /best/<slug> cross-link. */
  bestSlug?: string;
  /** Optional /blog/<slug> cross-links (max 2). */
  blogSlugs?: string[];
}

export const CATEGORY_INTROS: Record<string, CategoryIntro> = {
  "agents-automation": {
    intro: `Agents and automation tools are the plumbing of applied AI: the layer that lets models do multi-step work against real systems instead of just answering in a chat window. This is one of our smallest categories right now, and it's deliberately specialized — the two tools here solve different halves of the problem.

Pipedream is the workflow side: an automation platform where you wire triggers, APIs, and AI steps into pipelines that run without you babysitting them. Browserbase is the infrastructure side: cloud browser infrastructure that lets AI agents navigate websites, fill forms, and scrape pages the way a human would. If your agent needs to touch the web, something in this category is probably underneath it.

Both are freemium, so the practical tradeoff isn't whether you can try them — it's how pricing scales once you're in production. Automation platforms typically meter by runs or tasks, and browser infrastructure meters by session time, which means a workflow that's cheap in testing can get expensive at volume. The other real differentiator is reliability: retries, error handling, and observability matter more here than raw model quality, because a flaky automation is worse than no automation. If you're comparing tools in this space, run your actual workflow end-to-end on the free tier before committing — the demo path is never the path that breaks.`,
    blogSlugs: ["how-to-build-ai-toolkit"],
  },

  "ai-3d-game-dev": {
    intro: `AI 3D and game dev tools turn the slowest part of game and 3D production — asset creation — into something closer to a prompt. The category splits into a few clear jobs. Meshy, Tripo AI, Sloyd, and CSM generate 3D models from text prompts or images, which is the fastest way to prototype props, environments, and characters. Scenario is aimed squarely at game studios: it generates style-consistent assets trained on your own art direction, which matters when everything in a scene has to look like it belongs to the same world. Inworld AI tackles a different problem entirely — AI-driven characters and NPC behavior rather than geometry. Spline AI brings generation into a browser-based 3D design tool.

Every tool in this category is currently freemium, so you can test output quality before paying. What actually differentiates them: mesh quality and topology (a pretty model with broken geometry is useless in-engine), whether output is animation- and rig-ready or just a static concept mesh, commercial licensing on the free tier, and how well the tool fits a real pipeline — Unity, Unreal, or Blender — rather than a standalone viewer. Concept artists can get value from almost anything here. Shipping a game with these assets is a higher bar, and that's where the paid tiers and studio-focused tools earn their keep.`,
  },

  "ai-agents": {
    intro: `AI agents are software that doesn't just answer — it acts: browsing, calling APIs, updating records, and chaining steps toward a goal. This category is really three markets wearing one label, and knowing which one you're shopping in saves you weeks.

The first group is open-source frameworks for developers — LangChain, LangGraph, CrewAI, Agno, AutoGPT, and LlamaIndex. These are free to use; you pay in engineering time and model API costs. They give you maximum control and maximum responsibility. The second group is no-code and low-code builders — n8n, Dify, Lindy, Relevance AI, and Activepieces — where you assemble agents visually and trade some control for speed. The third is vertical, enterprise-sold agents that do one job at scale: Intercom Fin, Decagon, Sierra, Zendesk AI, and Salesforce Agentforce handle customer support conversations end-to-end, and they're priced like it — expect per-resolution or enterprise contracts, not a $20 subscription.

The tradeoffs that matter: build versus buy, obviously, but also reliability and evals. An agent that works 90% of the time is a liability in production, so ask what monitoring, guardrails, and human-handoff each platform offers before you ask about features. Pricing models vary wildly — open source plus API costs, freemium builders, per-outcome enterprise deals — so model your expected volume, not the sticker price.`,
    faqs: [
      {
        question: "Do I need to know how to code to build an AI agent?",
        answer:
          "No. Builders like n8n, Dify, and Lindy let you assemble agents visually with drag-and-drop workflows. Frameworks like LangGraph, CrewAI, and AutoGPT are for developers who need fine-grained control over agent behavior.",
      },
      {
        question: "What's the biggest risk with AI agents?",
        answer:
          "Reliability. Agents fail on edge cases — malformed inputs, changed websites, ambiguous instructions — and a 90% success rate is a liability in production. Test on narrow, well-defined tasks first, and check what evals, monitoring, and human-handoff options a platform offers.",
      },
      {
        question: "How are enterprise AI agents priced?",
        answer:
          "Often per resolution or per outcome rather than a flat subscription — Intercom Fin, Sierra, and Decagon all work this way. Costs scale with usage, so model your expected ticket or conversation volume before signing.",
      },
    ],
    blogSlugs: ["ai-agents-explained"],
  },

  "ai-education": {
    intro: `AI education tools split cleanly into two audiences, and picking the wrong side is the most common mistake here. Student-facing tools help you learn: Khanmigo acts as a tutor that guides rather than answers, Photomath walks through math problems step by step, and Socratic by Google — one of the few fully free tools in this category — explains homework questions across subjects. Quizlet and Brainly add AI to study workflows millions of students already use, and Brilliant teaches math and science interactively. Teacher-facing tools do the opposite job: MagicSchool AI generates lesson plans, rubrics, and differentiated materials, saving educators hours of prep per week.

Duolingo Max sits slightly apart — it's the paid tier of the language app, adding AI-powered roleplay and answer explanations. Wolfram Alpha is the veteran: less an AI tutor than a computational engine, but still the most reliable tool here for checking actual math.

The differentiators that matter: whether the tool teaches or just answers (tutors that guide beat answer machines for retention), subject coverage, and age appropriateness — a tool built for university students reads very differently to a ten-year-old. Nearly everything here is freemium, so the realistic cost question is which features sit behind the paywall: explanations and unlimited practice usually do.`,
    bestSlug: "ai-tools-for-students",
  },

  "ai-science-healthcare": {
    intro: `AI in science and healthcare isn't one market — it's a spectrum from free research tools anyone can use to enterprise systems sold into hospitals and pharma. On the open end: AlphaFold predicts protein structures and is free, which is why it reshaped structural biology; OpenEvidence gives clinicians free, citation-backed answers from medical literature. On the clinical workflow end: Abridge listens to doctor-patient conversations and drafts clinical notes, attacking the documentation burden that burns out physicians, and Hippocratic AI builds patient-facing agents for tasks like follow-up calls. On the drug discovery end: Insilico Medicine and Isomorphic Labs use AI to find and design drug candidates — long-horizon, capital-intensive work. Benchling is the R&D platform biotech teams use to manage experiments and data.

Notice the pricing pattern: four of the seven tools here sell enterprise contracts, and for good reason. Clinical and pharmaceutical buyers need validation, compliance, and audit trails, which is why this category has more sales calls than signup buttons. If you're a researcher or clinician evaluating these, the real questions aren't feature checklists — they're regulatory posture (is it cleared for your use case?), data handling (where does patient data go?), and evidence (published validation, not demo videos). The free tools are genuinely excellent; the enterprise ones require diligence.`,
  },

  "chatbots-assistants": {
    intro: `This is the front door of AI: conversational assistants you ask questions, draft text, brainstorm, and reason with. The flagship generalists — ChatGPT, Claude, Gemini, Grok, DeepSeek, Kimi, and Qwen — are closer in capability than their marketing suggests, and all of them have usable free tiers. Meta AI and Pi are fully free. Poe aggregates multiple models under one subscription, which is handy if you can't decide. Character.AI and Replika are companions rather than productivity tools — a different job, done well. Venice AI leans into privacy, and Dust targets workplace assistants wired into company data.

Twelve of the fourteen tools here are freemium, which tells you the business model: the free tier gets you hooked, the paid plan buys higher usage limits, access to the newest models, and heavier features like file analysis and deep research.

What actually differentiates them isn't the benchmark charts — it's how each one handles your tasks. Writing style, coding ability, context length, and tone vary enough to matter, and the only reliable test is running your real work through two or three of them for a week. Also weigh the ecosystem: Gemini hooks into Google Workspace, Meta AI lives inside WhatsApp and Instagram, and ChatGPT has the largest plugin and app ecosystem. Privacy posture differs too — if your conversations are sensitive, read the data-use policies before the feature lists.`,
    faqs: [
      {
        question: "Which AI chatbot is the best?",
        answer:
          "There's no universal winner — ChatGPT, Claude, and Gemini are all strong starting points and trade the lead depending on the task. The reliable method: run your actual work through two or three free tiers for a week and keep the one that handles your tasks best.",
      },
      {
        question: "Are paid chatbot plans worth it?",
        answer:
          "For casual use, no — free tiers cover most needs. Paid plans mainly buy higher usage limits, priority access to the newest models, and heavy features like deep research and large file analysis. If you hit free-tier limits weekly, upgrade; otherwise save the money.",
      },
      {
        question: "What's the difference between a chatbot and an AI agent?",
        answer:
          "A chatbot responds in conversation; an agent takes actions across tools and systems to complete multi-step tasks. The line is blurring as chatbots gain tool use, but dedicated agent platforms (see our AI Agents category) are built for autonomous execution.",
      },
    ],
    blogSlugs: ["chatgpt-vs-claude-vs-gemini", "how-to-write-better-ai-prompts"],
  },

  "coding-development": {
    intro: `This is our largest category, and it maps the fastest-moving part of the AI market. The tools cluster into six jobs. AI-first code editors — Cursor and Devin Desktop (formerly Windsurf) — rebuild the IDE around the model. Terminal agents — Claude Code, Gemini CLI, and Aider — work from the command line and handle multi-file tasks autonomously. Autocomplete assistants — GitHub Copilot, Codeium, Tabnine — predict your next lines inside the editor you already use. App generators — Bolt.new, Lovable, v0, and Replit — turn prompts into working prototypes, aimed as much at non-engineers as developers. Review and quality tools — CodeRabbit, Graphite, Greptile, Qodo — catch bugs in pull requests. And autonomous agents — Devin, Factory, Sweep — take tickets and attempt the whole task.

The dividing line that matters: assistance versus autonomy. Autocomplete makes you faster; agents try to do the job while you review. Most professional teams now run both — an agent for well-scoped tasks, autocomplete for everything else.

Pricing follows the split. Most tools are freemium with seat-based plans, while agent-heavy tools increasingly charge for usage on top. The open-source options — Aider, Cline, Roo Code, and Gemini CLI — are free; you pay only for the model API. When comparing, weight codebase context above everything: a tool that understands your repo beats a smarter model that doesn't.`,
    faqs: [
      {
        question: "What's the difference between Cursor and Claude Code?",
        answer:
          "Cursor is a full code editor with AI built into every surface — autocomplete, chat, and agentic edits inside the IDE. Claude Code runs in your terminal as an autonomous agent for multi-file tasks. Many developers use both: Cursor for interactive work, Claude Code for scoped, hands-off jobs.",
      },
      {
        question: "Are there free AI coding tools?",
        answer:
          "Yes. Codeium and Gemini CLI have genuinely usable free tiers, and Aider, Cline, and Roo Code are open source — you pay only for the underlying model API, which can be a cheap local model if you prefer.",
      },
      {
        question: "Is GitHub Copilot still worth it?",
        answer:
          "For autocomplete inside your existing editor, yes — it's mature, widely integrated, and cheap. But the category has shifted toward agents: if you want multi-file changes and autonomous task execution, compare it against Cursor, Claude Code, or Devin rather than other autocomplete tools.",
      },
    ],
    bestSlug: "ai-tools-for-developers",
    blogSlugs: ["cursor-vs-github-copilot", "claude-code-vs-gemini-cli"],
  },

  "data-analytics": {
    intro: `AI data and analytics tools promise to replace the part of analysis everyone hates: wrangling inputs and translating questions into queries. This is a small category — three tools — but each owns a distinct job, so the choice is usually obvious once you know what you need.

Clay is data enrichment for go-to-market teams: it pulls company and contact data from dozens of sources into a spreadsheet-like table, then uses AI to research and personalize at scale. If your bottleneck is outbound and prospect research, this is the tool. Hex is the analyst's workbench: collaborative notebooks that mix SQL, Python, and AI assistance, with published reports on top. If your team lives in queries and dashboards, start here. Julius AI is the most accessible: upload a spreadsheet or connect a database, ask questions in plain English, and get charts and analysis back — no SQL required. If you're a founder or marketer who wants answers from data without learning the tooling, that's the fit.

All three are freemium, so you can validate the workflow before paying. The real differentiators: how much technical skill each assumes, whether AI is the interface (Julius) or an accelerator inside a pro tool (Hex), and how pricing scales — per seat, per row, or per credit — once your usage grows past the demo dataset.`,
    bestSlug: "ai-tools-for-data-analysts",
    blogSlugs: ["best-ai-spreadsheet-data-tools"],
  },

  "design-creative": {
    intro: `AI design tools come in two flavors, and the difference matters more than any feature list. The first is AI inside tools designers already use: Canva, Figma AI, Framer, Rive, and Picsart bolt generation and editing features onto established workflows. The ceiling is the host tool, but the floor is high — output stays editable, on-canvas, and compatible with everything else you make. The second flavor is AI-first generators that create the artifact for you: Gamma, Tome, and Beautiful.ai build presentations from a prompt, Looka generates logo and brand kits, Relume drafts website structures and wireframes, and Napkin AI turns text into diagrams and visuals for documents.

The tradeoffs are consistent. AI-first tools are astonishingly fast for a first draft — a deck in ninety seconds — but their output often looks generic until you push it, and editing inside them can be constrained. AI-assisted incumbents take longer to learn but produce work you fully control. Brand consistency is the other axis: tools that ingest your fonts, colors, and past work (Canva and Beautiful.ai both push this) save real cleanup time for teams.

Nearly everything here is freemium; Beautiful.ai and Looka are the paid exceptions. For freelancers, the freemium tools cover most needs. For teams, evaluate export quality and collaboration features — a gorgeous deck that exports as a broken PDF is a liability.`,
    bestSlug: "ai-tools-for-designers",
    blogSlugs: ["top-ai-tools-for-building-websites"],
  },

  "image-generation": {
    intro: `Twenty-one tools, one job — turning text into images — and surprisingly different results. The aesthetic leaders earn their reputation: Midjourney consistently produces the most striking output and is one of the few paid-only tools here. The strong generalists — DALL-E 3, Seedream, Reve, and Google's models via the GPT Image API — trade a little artistry for prompt accuracy and convenience. Ideogram and Recraft are the design picks: Ideogram handles legible text inside images better than most, and Recraft generates vectors and brand-consistent sets. Photoroom and Adobe Firefly serve commercial workflows — product photography and on-brand assets inside Adobe's apps. And Magnific AI and Topaz Labs do the unglamorous essential work of upscaling and enhancement.

The open-weights path deserves its own mention: Stable Diffusion and Flux run locally or on cheap hosting, and ComfyUI gives you node-level control over the whole pipeline. It's the steepest learning curve in the category and the only route to zero marginal cost per image.

Fifteen of the twenty-one tools are freemium, so taste-test widely before paying. When comparing, weight four things: style (subjective — trust your eyes), prompt adherence (does it draw what you asked?), text rendering (still a weak spot for many models), and licensing — commercial-use rights vary by plan, so check terms before client work.`,
    faqs: [
      {
        question: "Which AI image generator is best for beginners?",
        answer:
          "Start with a freemium tool like Ideogram, Leonardo AI, or Playground — generous free tiers, no setup, and good prompt adherence. Midjourney produces some of the best aesthetics but has no free tier, so it's a common step up once you know what style you want.",
      },
      {
        question: "Can I use AI-generated images commercially?",
        answer:
          "Usually yes on paid plans, but terms vary by tool and by tier — some free plans restrict commercial use. Open-weight models like Stable Diffusion and Flux carry their own licenses. Check each tool's current terms before using output in client or commercial work.",
      },
      {
        question: "Why run Stable Diffusion locally instead of using Midjourney?",
        answer:
          "Control and cost. Local generation has zero per-image fees after your hardware, full privacy, and access to thousands of fine-tuned community models via ComfyUI. The tradeoffs are setup effort, GPU requirements, and more trial-and-error to match Midjourney's out-of-box polish.",
      },
    ],
    bestSlug: "ai-image-generators",
    blogSlugs: ["ai-image-generators-guide"],
  },

  "llm-providers": {
    intro: `This category is the supply chain of AI: the companies that train frontier models and the platforms that serve them. It's here for builders — if you're an end user, you want a chatbot; if you're shipping an AI feature, this is where it comes from.

Three groups matter. First, the frontier labs selling API access to their own models: OpenAI API, Anthropic API, Google AI Studio, Mistral AI, Cohere, and AI21 Labs. You get the newest models first, direct from the source. Second, aggregators and marketplaces: Amazon Bedrock serves multiple model families inside AWS (useful if your infrastructure and compliance already live there), and OpenRouter gives you one API key for dozens of models — the fastest way to compare and switch without re-integrating. Third, inference specialists: Groq, Together AI, Fireworks AI, and DeepInfra host open-weight models — including Meta Llama, the open-weights anchor — optimized for speed and cost.

The differentiators are unglamorous and decisive: price per million tokens, latency and throughput, context window, rate limits, and fine-tuning options. Pricing is pay-as-you-go almost everywhere, which makes unit economics easy to test and easy to get wrong at scale. The practical advice: prototype through an aggregator like OpenRouter, then move production traffic to whichever provider wins on your actual workload's cost and latency — not on benchmark charts.`,
    bestSlug: "ai-model-leaderboards",
    blogSlugs: ["best-lmarena-alternatives"],
  },

  "local-open-source": {
    intro: `Local AI means running models on your own hardware instead of renting them from a cloud API. The reasons are compelling: total privacy (nothing leaves your machine), offline capability, zero marginal cost per query, and no rate limits. The tradeoff is equally real: setup effort, hardware requirements, and a quality gap against the best frontier models on hard reasoning tasks.

The tooling splits by interface. Ollama is the default starting point — a command-line engine that downloads and runs models with one command. LM Studio and Jan wrap the same idea in polished desktop apps if you prefer clicking to typing. GPT4All is the friendliest for non-technical users. Underneath many of these sits llama.cpp, the inference engine that made running models on consumer hardware practical, and Llamafile packages a model and runtime into a single executable file. Open WebUI adds a ChatGPT-like interface on top of a local backend. KoboldAI and TextGen cater to creative writing, LocalAI mimics the OpenAI API for self-hosted apps, and vLLM serves models at production scale.

Nine of the eleven tools here are fully open source. The software is free — the cost is hardware. A modern laptop with 16GB of RAM runs smaller models fine; a discrete GPU with plenty of VRAM unlocks the bigger ones. Start with Ollama or LM Studio and a mid-size model; you'll know within an hour whether local AI fits your workflow.`,
    faqs: [
      {
        question: "What hardware do I need to run AI locally?",
        answer:
          "Less than you'd think. A modern computer with 16GB of RAM runs smaller models comfortably on CPU alone. A discrete GPU with 8-24GB of VRAM runs larger models much faster. Start with Ollama or LM Studio and a mid-size model — no special rig required to try it.",
      },
      {
        question: "Is local AI as good as ChatGPT or Claude?",
        answer:
          "Top open-weight models are close for everyday tasks — summarization, drafting, coding help — but frontier cloud models still lead on hard reasoning and long-context work. Local wins on privacy, offline use, zero marginal cost, and no rate limits.",
      },
      {
        question: "Ollama vs LM Studio — which should I pick?",
        answer:
          "Ollama is a command-line engine; LM Studio is a desktop app with a graphical model browser and chat UI. Pick LM Studio if you prefer GUIs, Ollama if you live in the terminal. Many users run Ollama as the backend with Open WebUI on top for a ChatGPT-like experience.",
      },
    ],
    bestSlug: "open-source-ai-tools",
    blogSlugs: ["run-ai-locally-open-source-models", "best-llama-cpp-alternatives"],
  },

  "mcp-skills-platforms": {
    intro: `MCP and skills platforms solve the connective-tissue problem: an AI agent is only as useful as the tools, data sources, and services it can actually reach. This young category covers the registries, integration layers, and builders that wire agents to the outside world.

The registries — Smithery, Glama, PulseMCP, and ClawHub — are directories and marketplaces for MCP servers: discoverable, installable connectors that give agents access to everything from databases to design tools. PulseMCP and ClawHub are free; the others are freemium. Composio plays the integration-layer role: pre-built, managed tool connections your agents can call without you hand-rolling authentication and API plumbing for every service. The visual builders — Flowise, Wordware, and Langflow (the open-source option) — let you assemble LLM pipelines and agent flows on a canvas instead of in code.

Because this category is young, the evaluation criteria differ from mature markets. Maintenance matters more than features: check when a connector or server was last updated, because an abandoned integration is a security and reliability hole. Authentication handling is the other big one — understand where your credentials live and what each platform can access. And expect churn: the MCP ecosystem is consolidating fast, so favor platforms with active communities and transparent roadmaps over the longest feature list.`,
  },

  "models-infrastructure": {
    intro: `Models and infrastructure is the builder's category: where AI models get hosted, served, connected, and measured. If you're shipping an AI product rather than using one, these are your suppliers.

Hugging Face is the gravity well — the hub where open models, datasets, and demos live, plus hosting on top. Replicate and fal.ai sell serverless inference: call a model via API, pay per second or per generation, never touch a GPU. Modal and Baseten are deployment platforms for when you outgrow serverless and want your own endpoints with real scaling controls. Pinecone is the vector database most retrieval-augmented apps started on. LiteLLM is the open-source gateway that normalizes a hundred model APIs behind one interface. Heurist and x402 round out the infrastructure edge.

Unusually, this category also includes the scorekeepers: LMArena runs the crowdsourced model leaderboard, Artificial Analysis benchmarks price and performance across providers, and Stanford HELM and SWE-bench publish rigorous academic and coding evaluations. That mix is deliberate — choosing infrastructure without benchmarks is guessing.

The differentiators are practical: cold-start latency, GPU pricing, developer experience, and lock-in. Costs range from free (the benchmarks) to enterprise contracts. The sound pattern: prototype on serverless inference, validate with public benchmarks plus your own evals, and only then commit to dedicated deployment.`,
    bestSlug: "ai-infrastructure-tools",
  },

  "music-audio": {
    intro: `AI music tools crossed the line from curiosity to genuinely usable output, and the category now splits by what you're actually making. Suno and Udio are the headline acts: type a prompt — genre, mood, lyrics — and get a complete song with vocals back in under a minute. They're the fastest way to prototype a track or make something fun, and the quality gap between them is small enough that preference comes down to taste. AIVA is the composer's tool: structured, controllable composition aimed at film, game, and classical-style scoring rather than pop songs. Mubert and SOUNDRAW generate royalty-free background music — the practical pick for creators who need endless, license-clean tracks for videos, streams, or apps. Moises does the reverse of generation: it separates songs into stems — vocals, drums, bass — for practice, remixing, and karaoke.

All six tools are freemium, which makes the deciding factors licensing and control rather than access. Commercial-use rights typically kick in on paid tiers, and they differ in important ways — read the terms if the music goes into anything monetized. Control is the other axis: one-shot generators give you a song, take it or leave it; AIVA and SOUNDRAW let you edit structure, instrumentation, and sections. For content creators, the background-music tools pay for themselves fastest. For musicians, Moises is the sleeper pick.`,
    blogSlugs: ["best-ai-voice-audio-tools-2026"],
  },

  productivity: {
    intro: `Productivity is where AI saves time you can actually measure, and the category maps neatly onto the bottlenecks of knowledge work. Meetings: Fathom, Fireflies.ai, Otter.ai, Granola, tl;dv, and Read AI record, transcribe, and summarize calls, while Krisp cleans up your audio in real time. Email: Superhuman and Shortwave triage and draft at speed. Calendars: Reclaim AI and Motion defend your focus time and schedule tasks automatically. Workspace AI: Notion AI, Microsoft Copilot, Mem, and Taskade embed assistance where your documents already live. Automation: Zapier, Make.com, and Gumloop connect your apps so work moves without you. AI browsers: Arc Max, Dia, and ChatGPT Atlas bring the assistant into the tab itself. And the vertical specialists — Harvey and Spellbook for legal, Glean for enterprise search, Gong for sales teams — prove that "productivity" means very different things in different professions, at enterprise prices to match.

Twenty of the twenty-six tools are freemium, so experimentation is cheap. The trap is stacking: five AI subscriptions that each save twenty minutes still cost you an hour of context-switching. Pick the one bottleneck that eats your week — for most people that's meetings or email — and master a single tool before adding another. Integration with your existing stack matters more than raw capability: the best meeting assistant is the one that actually joins your calls.`,
    faqs: [
      {
        question: "Which AI productivity tool should I start with?",
        answer:
          "Pick by bottleneck, not by hype. Drowning in meetings? Try Fathom or Otter.ai. Email overwhelming? Superhuman or Shortwave. Calendar chaos? Reclaim AI or Motion. Adopt one tool, prove the time savings, then consider a second.",
      },
      {
        question: "Are AI meeting recorders safe for confidential calls?",
        answer:
          "It depends on the tool and plan. Check where recordings are stored, whether transcripts are used for model training, and who in your organization can access them — enterprise tiers typically offer stronger controls. And always get consent from participants before recording.",
      },
      {
        question: "Do I need an AI browser?",
        answer:
          "Optional. Arc Max, Dia, and ChatGPT Atlas embed AI directly into browsing — summarizing pages, drafting in tabs, answering questions about what you're viewing. If your work lives in the browser all day they're worth a try; otherwise a regular assistant covers the same ground.",
      },
    ],
    blogSlugs: ["best-ai-meeting-notes-tools-compared", "ai-meeting-notes-tools-guide"],
  },

  "research-search": {
    intro: `Research and search tools answer the question AI chatbots handle worst: "what's actually true, and where's the source?" The category splits by audience. Answer engines — Perplexity, You.com, Genspark, and Perplexity's Comet browser — synthesize web results into cited answers, replacing the open-ten-tabs workflow with a conversation that shows its work. Academic tools do the same for papers: Consensus and Elicit search the scientific literature and summarize findings, SciSpace explains papers section by section, scite shows whether later work supported or disputed a claim, and Semantic Scholar and Connected Papers — two of the free options here — map and search the research graph. Phind is the developer's variant, tuned for technical questions. NotebookLM synthesizes your own documents into briefings and answers. And for builders, Exa and Tavily sell search APIs designed for AI agents, while Hebbia handles enterprise-scale document analysis.

Eleven of fifteen are freemium, and the free tiers here are unusually generous. The differentiators that matter: citation quality (does the answer link real sources, and do they say what's claimed?), source coverage (open web versus paywalled journals versus your own files), and recency. Whichever tool you pick, keep the habit that makes this category valuable: click through to the source before you trust the summary.`,
    faqs: [
      {
        question: "Is Perplexity better than Google?",
        answer:
          "Different jobs. Perplexity synthesizes an answer with citations — faster for research questions. Google gives you links — better for navigation, local results, and primary sources. Many people use Perplexity for the first pass and Google to dig deeper.",
      },
      {
        question: "What's the best AI tool for academic research?",
        answer:
          "Consensus and Elicit search papers and summarize evidence in plain language. Semantic Scholar is free and covers the research graph broadly. scite is the specialist: it shows whether later papers supported or disputed a citation. Combine one discovery tool with your university's database access.",
      },
      {
        question: "Can AI research tools hallucinate sources?",
        answer:
          "Yes — less often than raw chatbots, since these tools ground answers in retrieved documents, but it still happens. Always click through to the cited source before relying on a claim, especially for statistics and quotes.",
      },
    ],
    bestSlug: "ai-tools-for-research",
    blogSlugs: ["best-ai-research-tools"],
  },

  "video-audio": {
    intro: `This is the biggest creative category in the directory, and it covers four distinct jobs. Video generation — Sora, Runway, Kling AI, Luma Dream Machine, Pika, Hailuo AI, PixVerse, Seedance, Higgsfield, Haiper, Google Flow, and LTX Studio — turns prompts and images into moving footage; output quality is now good enough for ads, concept work, and social content, though coherence on longer clips remains the frontier. Avatar tools — HeyGen, Synthesia, D-ID — put a realistic presenter on your script, which is why they dominate training, onboarding, and multilingual explainer content. Editing and repurposing — Descript, CapCut, VEED, Opus Clip, InVideo AI — cut hours from post-production; Descript famously lets you edit video by editing the transcript. And voice — ElevenLabs, Murf AI, PlayHT — generates narration indistinguishable from studio reads, with Deepgram handling the reverse: fast, accurate speech-to-text.

Twenty-three of twenty-four tools are freemium; Sora is the paid exception. But read the fine print on "free": this category runs on credits, and video generation burns them fast — a handful of test clips can exhaust a monthly allowance. The differentiators that matter: clip length and coherence for generators, realism and language coverage for avatars, voice quality and cloning rights for audio, and commercial licensing on every tier.`,
    faqs: [
      {
        question: "Are AI video generators free?",
        answer:
          "Almost all have free tiers, but they run on credits that deplete quickly — a few test generations can use up a month's allowance. Serious use means a paid plan. The smart move: test the same prompt across two or three free tiers, then pay for the one that fits your style.",
      },
      {
        question: "What's the difference between text-to-video and avatar tools?",
        answer:
          "Text-to-video generators (Sora, Runway, Kling AI) create scenes and footage from prompts — ads, B-roll, concepts. Avatar tools (HeyGen, Synthesia) put a realistic human presenter on a written script — training videos, onboarding, localized explainers. Most teams need one of each, not twelve of either.",
      },
      {
        question: "Which AI voice tool should I use for narration?",
        answer:
          "ElevenLabs is the most common starting point — realistic voices, strong cloning, generous free tier. Murf AI and PlayHT are solid alternatives with team and studio features. For transcription rather than generation, Deepgram is the specialist.",
      },
    ],
    bestSlug: "ai-video-generators",
    blogSlugs: ["best-ai-video-tools-2026", "elevenlabs-vs-higgsfield"],
  },

  "writing-content": {
    intro: `AI writing tools do four different jobs, and buying the wrong one is the most common mistake in this category. Polishers improve text you wrote: Grammarly, Wordtune, and the Hemingway Editor fix grammar, tone, and clarity. Generators draft marketing copy from scratch: Jasper, Copy.ai, Writesonic, and Rytr produce ads, emails, and posts at volume. SEO content tools — Surfer SEO, Clearscope, Frase, Semrush AI — optimize drafts against what actually ranks, blending generation with search data. And the long-form specialists serve writers rather than marketers: Lex is a minimalist AI-native document editor, Sudowrite is built for fiction, and Writer brings governed AI writing to enterprises with brand and compliance controls.

One pricing signal worth knowing: six of the fifteen tools here are paid-only — a higher share than most categories — because SEO suites and enterprise tools don't do free tiers. The freemium eight cover most individual needs.

The honest assessment: every tool here can produce a passable first draft, and none produces a final draft. What differentiates them is everything around the generation — brand voice controls, SEO workflow integration, editing suggestions versus full rewrites, and how little cleanup the output needs. Pick based on your volume and editing tolerance: occasional writing needs a polisher, content marketing needs a generator plus an SEO tool, and fiction needs Sudowrite's long-memory approach.`,
    faqs: [
      {
        question: "Will AI-written content hurt my SEO?",
        answer:
          "Generic, unedited AI content performs poorly — search engines reward original information and real expertise. AI works best as a drafting and optimization assistant: tools like Surfer SEO and Clearscope help you match search intent, but the editing, reporting, and point of view have to be yours.",
      },
      {
        question: "What's the best free AI writing tool?",
        answer:
          "Grammarly's free tier is the strongest for polishing your own text. For generation, Rytr and Copy.ai have free plans worth trying. See our ranked list of free AI writing tools for the full breakdown.",
      },
      {
        question: "Should I choose a writing generator or an SEO content tool?",
        answer:
          "Depends on the job. If you need volume — ads, emails, social posts — a generator like Jasper or Writesonic fits. If you need articles that rank, an SEO tool like Surfer SEO or Frase matters more, because optimization against real search data beats raw generation quality.",
      },
    ],
    bestSlug: "free-ai-writing-tools",
    blogSlugs: ["best-ai-writing-tools"],
  },
};

/** Look up the editorial intro for a category slug. Returns undefined for unknown slugs. */
export function getCategoryIntro(slug: string): CategoryIntro | undefined {
  return CATEGORY_INTROS[slug];
}
