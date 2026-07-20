// ------------------------------------------------------------
// Curated popular comparison pairs — used to:
//   1. Pre-render high-traffic /compare/<a>/<b> pages via generateStaticParams
//   2. Seed the "Popular comparisons" section on /compare and on each
//      individual comparison page.
// Each pair must reference real tool slugs from our seed data. Pairs whose
// tools are missing in the DB at build time are skipped gracefully — they
// still render on demand if both tools later exist.
// ------------------------------------------------------------

export interface ComparisonPair {
  /** Two slugs (the URL is /compare/<a>/<b>) */
  slugs: [string, string];
  /** Optional grouping for the index page */
  group?:
    | "llms"
    | "coding"
    | "image"
    | "video"
    | "music"
    | "audio"
    | "frameworks"
    | "automation"
    | "writing"
    | "research"
    | "browser"
    | "benchmarks"
    | "design"
    | "inference";
}

export const POPULAR_COMPARISONS: ComparisonPair[] = [
  // LLMs / chat
  { slugs: ["claude", "chatgpt"], group: "llms" },
  { slugs: ["claude", "gemini"], group: "llms" },
  { slugs: ["chatgpt", "gemini"], group: "llms" },
  { slugs: ["chatgpt", "grok"], group: "llms" },
  { slugs: ["claude", "grok"], group: "llms" },
  { slugs: ["chatgpt", "perplexity"], group: "llms" },
  { slugs: ["gemini", "grok"], group: "llms" },
  { slugs: ["claude", "perplexity"], group: "llms" },
  { slugs: ["venice-ai", "chatgpt"], group: "llms" },
  { slugs: ["venice-ai", "claude"], group: "llms" },

  // Coding
  { slugs: ["cursor", "github-copilot"], group: "coding" },
  { slugs: ["cursor", "codeium"], group: "coding" },
  { slugs: ["github-copilot", "codeium"], group: "coding" },
  { slugs: ["cursor", "windsurf"], group: "coding" },
  { slugs: ["cursor", "v0"], group: "coding" },
  { slugs: ["v0", "bolt-new"], group: "coding" },
  { slugs: ["v0", "lovable"], group: "coding" },
  { slugs: ["bolt-new", "lovable"], group: "coding" },
  { slugs: ["cursor", "replit"], group: "coding" },
  { slugs: ["github-copilot", "windsurf"], group: "coding" },
  { slugs: ["devin", "cursor"], group: "coding" },
  { slugs: ["claude-code", "openai-codex"], group: "coding" },
  { slugs: ["claude-code", "cursor"], group: "coding" },
  { slugs: ["openai-codex", "github-copilot"], group: "coding" },
  { slugs: ["augment-code", "cursor"], group: "coding" },
  { slugs: ["gemini-cli", "claude-code"], group: "coding" },
  { slugs: ["warp", "cursor"], group: "coding" },
  { slugs: ["roo-code", "cline"], group: "coding" },

  // Image
  { slugs: ["midjourney", "chatgpt"], group: "image" },
  { slugs: ["midjourney", "flux"], group: "image" },
  { slugs: ["midjourney", "ideogram"], group: "image" },
  { slugs: ["ideogram", "chatgpt"], group: "image" },
  { slugs: ["midjourney", "leonardo-ai"], group: "image" },
  { slugs: ["adobe-firefly", "midjourney"], group: "image" },

  // Video
  { slugs: ["runway", "pika"], group: "video" },
  { slugs: ["runway", "kling-ai"], group: "video" },
  { slugs: ["luma-dream-machine", "runway"], group: "video" },
  { slugs: ["heygen", "synthesia"], group: "video" },
  { slugs: ["pika", "kling-ai"], group: "video" },

  // Music / audio
  { slugs: ["suno", "udio"], group: "music" },
  { slugs: ["mubert", "suno"], group: "music" },
  { slugs: ["elevenlabs", "deepgram"], group: "audio" },
  { slugs: ["elevenlabs", "higgsfield"], group: "audio" },
  { slugs: ["descript", "otter-ai"], group: "audio" },
  { slugs: ["otter-ai", "fathom"], group: "audio" },
  { slugs: ["otter-ai", "fireflies-ai"], group: "audio" },
  { slugs: ["fathom", "fireflies-ai"], group: "audio" },
  { slugs: ["opus-clip", "descript"], group: "audio" },

  // Frameworks / agents
  { slugs: ["langchain", "llamaindex"], group: "frameworks" },
  { slugs: ["crewai", "langchain"], group: "frameworks" },
  { slugs: ["composio", "zapier"], group: "frameworks" },

  // Automation
  { slugs: ["zapier", "make-com"], group: "automation" },
  { slugs: ["zapier", "n8n"], group: "automation" },
  { slugs: ["make-com", "n8n"], group: "automation" },

  // Writing
  { slugs: ["jasper", "copy-ai"], group: "writing" },
  { slugs: ["grammarly", "wordtune"], group: "writing" },
  { slugs: ["notion-ai", "chatgpt"], group: "writing" },

  // Research
  { slugs: ["perplexity", "notebooklm"], group: "research" },
  { slugs: ["elicit", "consensus"], group: "research" },

  // AI browsers / web agents
  { slugs: ["chatgpt-atlas", "perplexity-comet"], group: "browser" },
  { slugs: ["chatgpt-atlas", "dia"], group: "browser" },
  { slugs: ["perplexity-comet", "dia"], group: "browser" },
  { slugs: ["perplexity-comet", "perplexity"], group: "browser" },

  // Model leaderboards / benchmarks
  { slugs: ["lmarena", "artificial-analysis"], group: "benchmarks" },
  { slugs: ["swe-bench", "stanford-helm"], group: "benchmarks" },
  { slugs: ["swe-bench", "artificial-analysis"], group: "benchmarks" },
  { slugs: ["hugging-face", "lmarena"], group: "benchmarks" },
  { slugs: ["stanford-helm", "lmarena"], group: "benchmarks" },

  // Inference / infra
  { slugs: ["groq", "anthropic-api"], group: "inference" },
  { slugs: ["ollama", "groq"], group: "inference" },
  { slugs: ["openai-api", "anthropic-api"], group: "inference" },
  { slugs: ["openrouter", "fireworks-ai"], group: "inference" },
  { slugs: ["fal-ai", "replicate"], group: "inference" },
  { slugs: ["modal", "baseten"], group: "inference" },
  { slugs: ["hugging-face", "replicate"], group: "inference" },
  { slugs: ["deepinfra", "together-ai"], group: "inference" },

  // Design
  { slugs: ["canva", "adobe-firefly"], group: "design" },
  { slugs: ["gamma", "canva"], group: "design" },
  { slugs: ["framer", "figma-ai"], group: "design" },
];

export const GROUP_LABELS: Record<NonNullable<ComparisonPair["group"]>, string> = {
  llms: "Chatbots & LLMs",
  coding: "Coding & IDE",
  image: "Image generation",
  video: "Video generation",
  music: "Music",
  audio: "Audio & speech",
  frameworks: "Agent frameworks",
  automation: "Automation",
  writing: "Writing",
  research: "Research",
  browser: "AI browsers",
  benchmarks: "Model benchmarks",
  design: "Design",
  inference: "Inference & infrastructure",
};

export function getComparisonsForTool(slug: string): ComparisonPair[] {
  return POPULAR_COMPARISONS.filter((p) => p.slugs.includes(slug));
}

export function getRelatedComparisons(
  slugs: string[],
  limit = 6
): ComparisonPair[] {
  // Find pairs that share at least one tool with the current comparison
  const set = new Set(slugs);
  const exact = slugs.slice().sort().join("|");
  return POPULAR_COMPARISONS.filter((p) => {
    const key = p.slugs.slice().sort().join("|");
    if (key === exact) return false;
    return p.slugs.some((s) => set.has(s));
  }).slice(0, limit);
}
