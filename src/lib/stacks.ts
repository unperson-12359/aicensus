// ------------------------------------------------------------
// Stacks — curated, opinionated AI tool recipes.
// Each stack is a battle-tested combo of real tools in our directory,
// ordered by build sequence, with one-sentence editorial rationales.
// ------------------------------------------------------------

export type StackConstraint =
  | "free"
  | "indie"
  | "team"
  | "no-code"
  | "open-source"
  | "serious-scale";

export interface StackStep {
  toolSlug: string;
  role: string;
  why: string;
}

export interface Stack {
  slug: string;
  name: string;
  tagline: string;
  useCases: string[];
  constraints: StackConstraint[];
  heroTakeaway: string;
  steps: StackStep[];
}

export const stacks: Stack[] = [
  {
    slug: "build-a-saas",
    name: "Build a SaaS",
    tagline: "From empty Figma to paying users in a weekend.",
    useCases: ["saas", "web-app"],
    constraints: ["indie", "free"],
    heroTakeaway:
      "The leanest path from idea to revenue. Every tool here has a generous free tier or open-source fallback, and every step pulls its weight — no decorative infra, no premature scale.",
    steps: [
      {
        toolSlug: "claude",
        role: "Architecture partner",
        why: "Before you write code, argue with Claude about the schema, auth model, and pricing tiers. It catches half of the shape you'd otherwise refactor on day 14.",
      },
      {
        toolSlug: "v0",
        role: "UI scaffolding",
        why: "Describe a dashboard, get working Tailwind + shadcn/ui React. Not pixel-perfect, but 80% of the chrome done in minutes means you ship the actual business logic faster.",
      },
      {
        toolSlug: "cursor",
        role: "Code editor",
        why: "This is where the V0 output becomes a real codebase. Multi-file edits, agentic refactors, tab-complete that understands your domain. Non-negotiable.",
      },
      {
        toolSlug: "bolt-new",
        role: "Full-stack prototype",
        why: "When you want a throwaway Next.js + Supabase prototype live in 5 minutes to test a flow before committing. Wasted iterations are the expensive kind.",
      },
      {
        toolSlug: "perplexity",
        role: "Launch research",
        why: "Who are the three closest competitors, priced how, positioned against whom? Perplexity with citations is faster than any human consultant and less biased than Twitter.",
      },
      {
        toolSlug: "notion-ai",
        role: "Internal docs",
        why: "You'll forget why you made every decision. Notion AI will remember and summarize, and turns your scattered product thinking into an actual living spec.",
      },
    ],
  },
  {
    slug: "ship-a-landing-page",
    name: "Ship a landing page",
    tagline: "One URL, one weekend, zero ops work.",
    useCases: ["landing-page", "marketing"],
    constraints: ["indie", "free", "no-code"],
    heroTakeaway:
      "A landing page is a sales document with a deploy button. Skip the design system debate and the static site generator research — use the tools that go from copy to live URL in an afternoon.",
    steps: [
      {
        toolSlug: "claude",
        role: "Copywriting",
        why: "Feed it your product, one-line value prop, and ICP. It writes a hero, three benefits, and an FAQ in the voice you specify. Edit down, don't draft up.",
      },
      {
        toolSlug: "v0",
        role: "Layout generator",
        why: "Paste the copy, get a React landing page. It's opinionated about modern aesthetics — dark modes, gradient accents, the works — which is what you want if you're not a designer.",
      },
      {
        toolSlug: "framer",
        role: "No-code publish",
        why: "If you don't want a codebase at all, Framer's AI layouts and one-click publish replace the whole stack. It's the lowest total time-to-URL for a non-technical founder.",
      },
      {
        toolSlug: "ideogram",
        role: "Hero imagery",
        why: "Best-in-class text-in-image means you can ship branded hero art — logos, product shots with legible text — without a designer. Midjourney looks prettier; Ideogram ships faster.",
      },
      {
        toolSlug: "canva",
        role: "Social assets",
        why: "OG image, Twitter card, LinkedIn share. Canva's Magic Design has you covered — match the landing page, export five sizes, done.",
      },
    ],
  },
  {
    slug: "ai-agent-from-scratch",
    name: "Build an AI agent from scratch",
    tagline: "A production agent that does real work, not a demo.",
    useCases: ["ai-agents", "automation"],
    constraints: ["serious-scale"],
    heroTakeaway:
      "Most agent tutorials are toys. A real agent has memory, tool use, guardrails, and observability. This is the stack that survives week two, not just the launch tweet.",
    steps: [
      {
        toolSlug: "anthropic-api",
        role: "Reasoning engine",
        why: "Claude's tool-calling and long-context behavior is the most reliable substrate for agents that need to reason over documents and invoke tools in sequence without going off the rails.",
      },
      {
        toolSlug: "langchain",
        role: "Orchestration framework",
        why: "Batteries-included patterns for chains, memory, retries, and tool routing. You'll outgrow it — but it saves six weeks of scaffolding you don't want to write.",
      },
      {
        toolSlug: "llamaindex",
        role: "RAG layer",
        why: "If your agent needs to know your data, LlamaIndex is the fastest path from documents to a production retrieval pipeline. Better defaults than rolling your own.",
      },
      {
        toolSlug: "composio",
        role: "Tool access",
        why: "Instead of writing OAuth flows for every third-party integration, Composio gives your agent 200+ pre-wired tools. You go from GitHub-Slack-Notion in a day.",
      },
      {
        toolSlug: "crewai",
        role: "Multi-agent coordination",
        why: "When one agent isn't enough. CrewAI's role-based coordination beats hand-rolled message passing when you need researcher-plus-writer-plus-reviewer workflows.",
      },
      {
        toolSlug: "groq",
        role: "Inference for sub-tasks",
        why: "For the low-stakes reasoning inside the loop — classification, routing, summarization — Groq's LPU inference is 10x cheaper and 5x faster than frontier model calls. Use it everywhere it's good enough.",
      },
    ],
  },
  {
    slug: "write-a-book-with-ai",
    name: "Write a book with AI",
    tagline: "Co-authorship without losing your voice.",
    useCases: ["writing", "book"],
    constraints: ["indie", "free"],
    heroTakeaway:
      "The book doesn't write itself, and if it does, it reads like it. AI is your research assistant, sparring partner, and editor — you are still the author. This stack keeps that boundary.",
    steps: [
      {
        toolSlug: "notebooklm",
        role: "Research corpus",
        why: "Upload every paper, transcript, and interview that informs your book. Ask it questions across all sources at once. It's a personal librarian that cites its answers — indispensable for non-fiction.",
      },
      {
        toolSlug: "claude",
        role: "Writing partner",
        why: "Claude's long-context handling means you can paste entire chapters and get feedback that understands structure, not just sentences. The best sparring partner for prose.",
      },
      {
        toolSlug: "wordtune",
        role: "Line-level editor",
        why: "Not for generation — for rewriting. Wordtune suggests alternative phrasings that preserve meaning, which is what you want in the final edit pass.",
      },
      {
        toolSlug: "grammarly",
        role: "Copy edit pass",
        why: "Last stop before anyone reads. Grammarly catches the last 5% — tone inconsistency, passive voice, the semicolon you used wrong — that tired-you won't see.",
      },
      {
        toolSlug: "perplexity",
        role: "Fact-checking",
        why: "Before you publish a claim, verify it with sources. Perplexity's citations let you cross-reference in seconds. Cheaper than a lawsuit.",
      },
    ],
  },
  {
    slug: "indie-hacker-starter",
    name: "Indie hacker starter pack",
    tagline: "The solo-builder toolkit. Nothing you don't need.",
    useCases: ["coding", "saas", "web-app"],
    constraints: ["indie", "free", "open-source"],
    heroTakeaway:
      "You are one person with one evening a day. Every tool here earns its monthly cost or its learning curve. This is what I'd tell my past self to install on day one.",
    steps: [
      {
        toolSlug: "cursor",
        role: "IDE",
        why: "The one non-negotiable spend. If you'll only pay for one tool all year, make it this one — it's the compounding productivity bet.",
      },
      {
        toolSlug: "claude",
        role: "Thinking partner",
        why: "Debug the idea, not just the code. Claude is a senior engineer, PM, and copywriter on call for $20/mo. Rubber duck with opinions.",
      },
      {
        toolSlug: "v0",
        role: "UI shortcut",
        why: "Skips the part of building a product that doesn't differentiate you — the layout. Hand it to V0, ship faster.",
      },
      {
        toolSlug: "perplexity",
        role: "Research",
        why: "Market research, library comparisons, pricing benchmarks, SEO research. Replaces three hours of googling with a five-minute conversation and sources you can verify.",
      },
      {
        toolSlug: "ollama",
        role: "Local models",
        why: "For the privacy-sensitive, rate-limit-sensitive, or just-cheap-sensitive workloads. Run Llama 3.1 or Qwen locally — free inference that survives API outages.",
      },
      {
        toolSlug: "raycast",
        role: "Launcher",
        why: "Not strictly AI, but the glue. Raycast's AI quick-access plus command palette shaves minutes off every context switch — and indie hacking is all context switches.",
      },
    ],
  },
  {
    slug: "launch-a-newsletter",
    name: "Launch a newsletter",
    tagline: "Voice, cadence, distribution — covered.",
    useCases: ["writing", "content"],
    constraints: ["indie", "free"],
    heroTakeaway:
      "A newsletter is a discipline, not a product. The tools are just there to remove the 20% of friction that causes you to skip a week. Which is how newsletters die.",
    steps: [
      {
        toolSlug: "claude",
        role: "Outline partner",
        why: "Turn a half-formed idea into a structured draft in 10 minutes. Claude is better than any generation tool at preserving your voice if you give it three prior issues as samples.",
      },
      {
        toolSlug: "perplexity",
        role: "Research engine",
        why: "Every newsletter is 60% synthesis of what's out there plus 40% your take. Perplexity accelerates the synthesis so you spend the hour on the take.",
      },
      {
        toolSlug: "grammarly",
        role: "Edit pass",
        why: "You write the newsletter after dinner, tired. Grammarly catches the typos that make a reader unsubscribe. Worth it for that alone.",
      },
      {
        toolSlug: "ideogram",
        role: "Header art",
        why: "One custom illustration per issue, generated in 30 seconds. Turns a newsletter from 'text in an email' into something that looks like a publication.",
      },
      {
        toolSlug: "opus-clip",
        role: "Social distribution",
        why: "Newsletter gets turned into short-form clips for LinkedIn, Twitter, and TikTok automatically. One long-form → five short-form. That's the leverage play.",
      },
    ],
  },
  {
    slug: "music-production-with-ai",
    name: "Music production with AI",
    tagline: "From humming into a phone to finished track.",
    useCases: ["music", "creative"],
    constraints: ["indie"],
    heroTakeaway:
      "AI music is good enough now that the hard part isn't generation — it's taste. These tools each cover a different phase of production, and knowing when to hand off matters more than which model you picked.",
    steps: [
      {
        toolSlug: "suno",
        role: "Song generation",
        why: "The fastest path from a lyric idea or mood to a full track with vocals. Not studio-grade, but the best starting point for experimenting with structure and melody.",
      },
      {
        toolSlug: "udio",
        role: "Composition variation",
        why: "Where Suno is good at pop-coherent songs, Udio is better at genre fidelity and subtle variations. Use both, pick the one that serves the track you have in your head.",
      },
      {
        toolSlug: "mubert",
        role: "Royalty-free stems",
        why: "For when you need a specific instrument or loop — drum breaks, ambient pads, bass lines. Mubert generates them as stems you can drop into your DAW.",
      },
      {
        toolSlug: "aiva",
        role: "Orchestral composition",
        why: "If your track needs strings, brass, or a cinematic score, AIVA is the one tool that produces actual music-theory-correct orchestral arrangements. Specialized but unmatched.",
      },
      {
        toolSlug: "elevenlabs",
        role: "Vocal generation",
        why: "When you need a voice that isn't yours — backing vocals, spoken-word intros, multilingual versions. Clone a voice from a clip, generate new takes.",
      },
      {
        toolSlug: "descript",
        role: "Audio editing",
        why: "Audio editing via a transcript. Rearrange verses by dragging paragraphs. Way faster than Logic or Pro Tools for lyric-driven edits.",
      },
    ],
  },
  {
    slug: "video-content-pipeline",
    name: "Video content pipeline",
    tagline: "One long-form shoot, ten distribution assets.",
    useCases: ["video", "creative", "content"],
    constraints: ["indie", "team"],
    heroTakeaway:
      "The economics of video changed when AI started doing the repetitive parts — transcripts, clipping, captions, dubs. This stack is how creators who shoot once and publish everywhere actually work.",
    steps: [
      {
        toolSlug: "descript",
        role: "Edit from transcript",
        why: "Paste your footage, get a transcript, cut the video by deleting words. If you ever recorded a 40-minute interview and had to find the best three minutes, you already know why this wins.",
      },
      {
        toolSlug: "opus-clip",
        role: "Auto-clipping",
        why: "Feeds the long-form video, spits out 10-12 short-form clips ranked by virality. The work behind a content creator's feed that looks like magic.",
      },
      {
        toolSlug: "elevenlabs",
        role: "Voiceover + dubbing",
        why: "Multilingual dubbing that preserves your voice. One video in English becomes five videos in five languages with zero re-recording.",
      },
      {
        toolSlug: "runway",
        role: "B-roll generation",
        why: "When the footage you have isn't enough. Runway generates shots that match your scene — landscape, abstract, product renders — faster than searching stock libraries.",
      },
      {
        toolSlug: "sora",
        role: "Hero sequences",
        why: "For the occasional shot you absolutely can't film — a drone over a canyon, a dream sequence, a product in zero gravity. Used sparingly, it raises the ceiling.",
      },
      {
        toolSlug: "canva",
        role: "Thumbnails + end cards",
        why: "Thumbnails are 50% of the CTR fight. Canva's Magic Design nails them in minutes and keeps the whole channel's brand coherent.",
      },
    ],
  },
  {
    slug: "brand-identity-design",
    name: "Brand identity design",
    tagline: "Logo, palette, voice — without a designer.",
    useCases: ["design", "branding"],
    constraints: ["indie", "no-code"],
    heroTakeaway:
      "You're not building Nike's brand. You're getting to an identity that's consistent, professional, and ownable, fast. These tools compress weeks of agency work into an afternoon of decisions.",
    steps: [
      {
        toolSlug: "looka",
        role: "Logo system",
        why: "Generate, customize, and export a full logo kit with variations. Not the thing a design-first company will use, but perfectly sufficient for 90% of startups.",
      },
      {
        toolSlug: "ideogram",
        role: "Brand imagery",
        why: "Consistent brand illustrations with text that actually reads. Better than Midjourney when your images need to carry type — hero shots with taglines, product renders with labels.",
      },
      {
        toolSlug: "figma-ai",
        role: "Layout system",
        why: "Figma with AI-assisted layout generation. Turn a brand kit into a template library — social posts, slide decks, doc headers — that non-designers can remix without breaking consistency.",
      },
      {
        toolSlug: "claude",
        role: "Voice + messaging",
        why: "Brand voice is just vocabulary choices and rhythm. Claude distills it from five sample paragraphs into a usable style guide anyone on the team can follow.",
      },
      {
        toolSlug: "canva",
        role: "Asset production",
        why: "Once the brand is set, Canva is where marketing operationalizes it — 50 social posts a month, on-brand, without bothering the founder.",
      },
    ],
  },
  {
    slug: "build-a-mobile-app",
    name: "Build a mobile app",
    tagline: "iOS and Android without two codebases.",
    useCases: ["mobile", "coding"],
    constraints: ["indie"],
    heroTakeaway:
      "Mobile development is still harder than web, but the gap has closed. With the right stack, a single developer can ship to both stores. This is what that looks like in 2026.",
    steps: [
      {
        toolSlug: "claude",
        role: "Architecture partner",
        why: "Navigation model, state management, offline behavior — the decisions that hurt most to change later. Talk through them with Claude before you write a screen.",
      },
      {
        toolSlug: "cursor",
        role: "IDE",
        why: "React Native's ecosystem churns. Cursor's context on the current lib versions and idioms saves hours of hunting deprecated examples.",
      },
      {
        toolSlug: "v0",
        role: "Screen generator",
        why: "V0 now supports React Native primitives. Generating screens from a text prompt cuts the boilerplate part of mobile dev in half.",
      },
      {
        toolSlug: "bolt-new",
        role: "Prototype flow",
        why: "Before you commit to a full React Native codebase, prototype the flow as a web app in Bolt. Users will tell you if the idea works before Expo setup is done.",
      },
      {
        toolSlug: "replit",
        role: "Backend + deploy",
        why: "For the auth, DB, and API backing your app — Replit's agent-built backends are faster than spinning up Firebase or Supabase from scratch if you're solo.",
      },
    ],
  },
  {
    slug: "youtube-creator-stack",
    name: "YouTube creator stack",
    tagline: "Ideation to upload, on a channel cadence.",
    useCases: ["video", "content", "creative"],
    constraints: ["indie"],
    heroTakeaway:
      "YouTube is a funnel: hook, retention, CTR, sub rate. Each tool here optimizes a specific metric — not because the creator is cynical but because the alternative is burnout.",
    steps: [
      {
        toolSlug: "perplexity",
        role: "Topic research",
        why: "Before the thumbnail, the title, or the script: what's actually underexplored in your niche? Perplexity pulls together what exists so you can aim at what doesn't.",
      },
      {
        toolSlug: "claude",
        role: "Script writing",
        why: "Structure — cold open, setup, promise, payoff — is what retains viewers. Claude is a better script doctor than any YouTube guru on Twitter because it actually read your draft.",
      },
      {
        toolSlug: "descript",
        role: "Video edit",
        why: "The editor for creators who don't love editing. Descript removes the suffering; you keep the creative decisions.",
      },
      {
        toolSlug: "elevenlabs",
        role: "Voiceover",
        why: "B-roll narration, multilingual dubs, pickup lines you didn't record. Lets a solo creator sound like a channel with a voiceover budget.",
      },
      {
        toolSlug: "opus-clip",
        role: "Shorts + social",
        why: "Your YouTube video becomes TikToks, Reels, and Shorts automatically. Same hour of shooting, five distribution channels.",
      },
      {
        toolSlug: "canva",
        role: "Thumbnails",
        why: "The single biggest CTR lever on YouTube. Canva's thumbnail A/B workflow helps you iterate until the curve points up.",
      },
    ],
  },
  {
    slug: "podcast-production",
    name: "Podcast production",
    tagline: "From raw recording to RSS in two hours.",
    useCases: ["audio", "content"],
    constraints: ["indie"],
    heroTakeaway:
      "Podcasts die from production friction more than content problems. This stack cuts the edit-publish loop from a day to an evening, which is how a weekly show survives month three.",
    steps: [
      {
        toolSlug: "descript",
        role: "Transcript edit",
        why: "Edit a podcast by editing the transcript. Remove 'ums', rearrange segments, export a clean audio. It's not faster than a pro editor — it's just that you can do it.",
      },
      {
        toolSlug: "otter-ai",
        role: "Live transcript + notes",
        why: "Record a live interview and get a real-time transcript with speaker labels and action items. Cuts the post-interview prep for show notes in half.",
      },
      {
        toolSlug: "elevenlabs",
        role: "Intro + re-recordings",
        why: "Your voice, cleanly synthesized, for intro stingers and the lines you flubbed. Also: translation into other languages for international distribution.",
      },
      {
        toolSlug: "claude",
        role: "Show notes + chapters",
        why: "Paste the transcript, get timestamped chapters, a summary, and three quotable lines for social. Two hours of show-notes work, gone.",
      },
      {
        toolSlug: "deepgram",
        role: "Transcription API",
        why: "When you're producing enough volume that paid tools get expensive. Deepgram's API is the cost-efficient way to run transcription on every episode, ongoing.",
      },
      {
        toolSlug: "opus-clip",
        role: "Audiograms",
        why: "Turns the best 60 seconds of every episode into a shareable clip. Podcasts that grow have a clip pipeline. This is it.",
      },
    ],
  },
  {
    slug: "enterprise-data-analysis",
    name: "Enterprise data analysis",
    tagline: "Insights that survive a data review meeting.",
    useCases: ["data", "analytics"],
    constraints: ["team", "serious-scale"],
    heroTakeaway:
      "Consumer AI analysis tools are fine for a founder with a CSV. At enterprise scale, you need tools that respect permissions, document their reasoning, and plug into the data warehouse. These do.",
    steps: [
      {
        toolSlug: "julius-ai",
        role: "Exploratory analysis",
        why: "Conversational data analysis for the analyst who wants to skip the syntax wrestling. Upload, ask, get charts and tested statistical interpretations.",
      },
      {
        toolSlug: "glean",
        role: "Enterprise search",
        why: "Before you analyze the data, you have to find it. Glean is permission-aware search across all internal tools — the substrate for any serious enterprise AI work.",
      },
      {
        toolSlug: "notebooklm",
        role: "Reports + briefings",
        why: "Dump your analysis, raw data, and a brief. NotebookLM writes the executive summary with citations back to your source data. Saves the analyst four hours of slide-building.",
      },
      {
        toolSlug: "claude",
        role: "Statistical sanity check",
        why: "Before a number goes to the CEO, paste the analysis into Claude and ask what could be wrong with it. It's the cheapest peer review you'll ever get.",
      },
      {
        toolSlug: "perplexity",
        role: "External benchmarking",
        why: "Internal data without external context is half the picture. Perplexity pulls industry benchmarks with citations so your insights land in the right frame.",
      },
      {
        toolSlug: "gamma",
        role: "Executive deck",
        why: "The best analysis dies in a bad slide. Gamma turns a doc into a deck in minutes — the 10% of production work that determines whether the insight actually moves anything.",
      },
    ],
  },
  {
    slug: "academic-research-helper",
    name: "Academic research helper",
    tagline: "From lit review to paper, at graduate-student scale.",
    useCases: ["research", "writing", "academic"],
    constraints: ["indie", "free"],
    heroTakeaway:
      "Academic research is a throughput problem. You read 40 papers to cite 10. These tools don't do the thinking for you — they remove the mechanical overhead so you can spend more time on the part that matters.",
    steps: [
      {
        toolSlug: "elicit",
        role: "Literature search",
        why: "Semantic search across 200M papers. Not just keyword matching — asks 'what's the effect of X on Y' and returns studies that actually answer, with data extracted into tables.",
      },
      {
        toolSlug: "consensus",
        role: "Claim verification",
        why: "When a paper makes a strong claim, Consensus shows you the meta-picture: how many studies agree, disagree, and with what effect sizes. It's the spot-check you need before citing.",
      },
      {
        toolSlug: "notebooklm",
        role: "Paper synthesis",
        why: "Upload 20 PDFs, ask synthesis questions across all of them at once. Its audio overviews are genuinely useful for finding your way into an unfamiliar field.",
      },
      {
        toolSlug: "connected-papers",
        role: "Citation graph",
        why: "Visualize the paper's intellectual lineage. You find the actual load-bearing citations — not just the ones the paper itself cites — and the adjacent work it doesn't.",
      },
      {
        toolSlug: "claude",
        role: "Writing assistance",
        why: "Long context handles paste-the-whole-draft edits. Better than generic AI writers because you can say 'preserve my voice, tighten the argument' and it actually will.",
      },
      {
        toolSlug: "semantic-scholar",
        role: "Reference management",
        why: "The canonical open academic graph. Export citations, track what cites your work, find related papers algorithmically. Free, and the bedrock of several other tools above.",
      },
    ],
  },
  {
    slug: "game-dev-starter",
    name: "Game dev starter",
    tagline: "Prototype a game without a team.",
    useCases: ["games", "coding", "creative"],
    constraints: ["indie"],
    heroTakeaway:
      "Game development historically required a team because of the asset pipeline. AI didn't remove the need for taste, but it did remove the need for ten specialists. Solo devs can now ship.",
    steps: [
      {
        toolSlug: "scenario",
        role: "Art + asset generation",
        why: "Fine-tune a model on your art style and generate consistent sprites, tiles, and UI assets. The tool that eliminates the 'I need an artist' blocker for indie devs.",
      },
      {
        toolSlug: "meshy",
        role: "3D model generation",
        why: "Text-to-3D that actually produces game-ready meshes with UVs. Not film-quality, but for prototypes and background props it's transformative.",
      },
      {
        toolSlug: "suno",
        role: "Music + SFX",
        why: "Generate an original soundtrack in the right mood without a composer. Plus variations for menu, boss fights, exploration — the parts of scoring that kill indie project velocity.",
      },
      {
        toolSlug: "elevenlabs",
        role: "Voice acting",
        why: "NPCs, narration, protagonist voice-overs. At indie scale, hiring voice actors is where scope explodes. ElevenLabs collapses it.",
      },
      {
        toolSlug: "cursor",
        role: "Code",
        why: "Unity C# or Godot GDScript — Cursor handles both. The agentic refactors save dozens of hours once the game's systems start interlocking.",
      },
      {
        toolSlug: "claude",
        role: "Game design thinking",
        why: "A good game design doc is the difference between six months of drift and a shipped game. Claude is a patient design lead for the solo dev who doesn't have one.",
      },
    ],
  },
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

export function getStackBySlug(slug: string): Stack | undefined {
  return stacks.find((s) => s.slug === slug);
}

export function getAllStackSlugs(): string[] {
  return stacks.map((s) => s.slug);
}

// All constraint values (for filter UIs)
export const ALL_CONSTRAINTS: StackConstraint[] = [
  "free",
  "indie",
  "team",
  "no-code",
  "open-source",
  "serious-scale",
];

// Derive the union of all use-cases across stacks
export function getAllUseCases(): string[] {
  const set = new Set<string>();
  for (const stack of stacks) {
    for (const uc of stack.useCases) set.add(uc);
  }
  return Array.from(set).sort();
}

// Human-readable labels for constraints
export const CONSTRAINT_LABELS: Record<StackConstraint, string> = {
  free: "Free",
  indie: "Indie",
  team: "Team",
  "no-code": "No-code",
  "open-source": "Open source",
  "serious-scale": "Serious scale",
};
