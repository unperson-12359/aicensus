// ------------------------------------------------------------
// Stack Explorer — capability catalog used by /stacks/build.
// Each capability maps to a list of tool slugs ordered by editor preference.
// The runtime intersects this with the live tools table so a tool that's
// in the catalog but not in the DB is silently skipped.
// ------------------------------------------------------------

export interface CapabilityDef {
  slug: string;
  name: string;
  /** A short verb-phrase shown on the picker chip. */
  blurb: string;
  /** Ordered tool-slug picks; first preferred. */
  toolSlugs: string[];
}

export const CAPABILITIES: CapabilityDef[] = [
  {
    slug: "thinking-partner",
    name: "Thinking partner",
    blurb: "An LLM you can argue with",
    toolSlugs: [
      "claude",
      "chatgpt",
      "gemini",
      "grok",
      "mistral-ai",
      "perplexity",
    ],
  },
  {
    slug: "code-editor",
    name: "Code editor / IDE",
    blurb: "Write, refactor, and ship code",
    toolSlugs: [
      "cursor",
      "github-copilot",
      "windsurf",
      "qodo",
      "replit",
    ],
  },
  {
    slug: "coding-agent",
    name: "Coding agent",
    blurb: "Delegate tickets and refactors",
    toolSlugs: [
      "claude-code",
      "openai-codex",
      "cursor",
      "augment-code",
      "github-copilot",
      "gemini-cli",
    ],
  },
  {
    slug: "ui-scaffolding",
    name: "UI scaffolding",
    blurb: "Generate React from a prompt",
    toolSlugs: ["v0", "bolt-new", "lovable", "framer", "replit"],
  },
  {
    slug: "writing",
    name: "Writing & editing",
    blurb: "Drafts, edits, polish",
    toolSlugs: [
      "claude",
      "wordtune",
      "grammarly",
      "jasper",
      "copy-ai",
      "notion-ai",
    ],
  },
  {
    slug: "research",
    name: "Research & citations",
    blurb: "Find, verify, synthesize",
    toolSlugs: [
      "perplexity",
      "notebooklm",
      "elicit",
      "consensus",
      "semantic-scholar",
      "connected-papers",
    ],
  },
  {
    slug: "ai-browser",
    name: "AI browser",
    blurb: "Browse, summarize, act",
    toolSlugs: [
      "chatgpt-atlas",
      "perplexity-comet",
      "dia",
      "arc-max",
      "perplexity",
      "tavily",
    ],
  },
  {
    slug: "model-benchmarks",
    name: "Model benchmarks",
    blurb: "Compare quality and cost",
    toolSlugs: [
      "lmarena",
      "artificial-analysis",
      "swe-bench",
      "stanford-helm",
      "hugging-face",
      "openrouter",
    ],
  },
  {
    slug: "image-gen",
    name: "Image generation",
    blurb: "Hero shots and graphics",
    toolSlugs: [
      "midjourney",
      "ideogram",
      "flux",
      "dall-e-3",
      "leonardo-ai",
      "adobe-firefly",
    ],
  },
  {
    slug: "video-edit",
    name: "Video editing",
    blurb: "Cut, caption, clip",
    toolSlugs: ["descript", "opus-clip", "runway"],
  },
  {
    slug: "video-gen",
    name: "Video generation",
    blurb: "Text- and image-to-video",
    toolSlugs: ["runway", "pika", "luma-dream-machine", "kling-ai", "hailuo-ai", "heygen"],
  },
  {
    slug: "voice",
    name: "Voice & TTS",
    blurb: "Narration, dubs, pickups",
    toolSlugs: ["elevenlabs", "deepgram"],
  },
  {
    slug: "music",
    name: "Music generation",
    blurb: "Tracks, stems, scores",
    toolSlugs: ["suno", "udio", "mubert", "aiva"],
  },
  {
    slug: "design",
    name: "Design & layout",
    blurb: "Brand assets and layouts",
    toolSlugs: ["figma-ai", "framer", "looka", "canva", "gamma"],
  },
  {
    slug: "automation",
    name: "Automation & workflows",
    blurb: "No-code glue between apps",
    toolSlugs: ["zapier", "make-com", "n8n", "composio"],
  },
  {
    slug: "agents",
    name: "Agent framework",
    blurb: "Build agentic systems",
    toolSlugs: ["langchain", "llamaindex", "crewai", "composio"],
  },
  {
    slug: "inference",
    name: "Model inference",
    blurb: "API or local model runtime",
    toolSlugs: [
      "anthropic-api",
      "groq",
      "ollama",
      "openrouter",
      "fireworks-ai",
      "mistral-ai",
    ],
  },
  {
    slug: "ai-infrastructure",
    name: "AI infrastructure",
    blurb: "Route, serve, and monitor models",
    toolSlugs: [
      "hugging-face",
      "replicate",
      "fal-ai",
      "modal",
      "baseten",
      "openrouter",
      "fireworks-ai",
    ],
  },
  {
    slug: "meeting-notes",
    name: "Meeting notes",
    blurb: "Transcribe and summarize",
    toolSlugs: ["granola", "otter-ai", "descript"],
  },
  {
    slug: "knowledge",
    name: "Knowledge / docs",
    blurb: "Capture, search, share",
    toolSlugs: ["glean", "notion-ai", "notebooklm", "mem-ai"],
  },
];

export function getCapabilityBySlug(slug: string): CapabilityDef | undefined {
  return CAPABILITIES.find((c) => c.slug === slug);
}
