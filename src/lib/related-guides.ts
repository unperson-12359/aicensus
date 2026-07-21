/**
 * Related-guides mapping: which blog posts to promote from tool pages.
 *
 * Blog posts already link out to tool pages, but tool pages historically
 * never linked back — this module fixes the reverse direction by mapping
 * each category slug (and a few high-traffic tool slugs) to 2-3 relevant
 * posts from src/content/blog. All slugs below must exist as .mdx files.
 */

const CATEGORY_GUIDE_MAP: Record<string, string[]> = {
  "chatbots-assistants": [
    "chatgpt-vs-claude-vs-gemini",
    "how-to-write-better-ai-prompts",
    "understanding-ai-hallucinations",
  ],
  "research-search": [
    "best-ai-research-tools",
    "understanding-ai-hallucinations",
    "best-free-ai-tools-2026",
  ],
  "coding-development": [
    "cursor-vs-github-copilot",
    "claude-code-vs-gemini-cli",
    "top-ai-tools-for-building-websites",
  ],
  "image-generation": [
    "ai-image-generators-guide",
    "best-free-ai-tools-2026",
    "free-ai-tools-no-signup",
  ],
  "video-audio": [
    "best-ai-video-tools-2026",
    "best-ai-voice-audio-tools-2026",
    "elevenlabs-vs-higgsfield",
  ],
  "writing-content": [
    "best-ai-writing-tools",
    "how-to-use-ai-for-marketing",
    "ai-email-tools-guide",
  ],
  "design-creative": [
    "ai-image-generators-guide",
    "top-ai-tools-for-building-websites",
    "best-ai-video-tools-2026",
  ],
  productivity: [
    "ai-meeting-notes-tools-guide",
    "best-ai-meeting-notes-tools-compared",
    "ai-email-tools-guide",
  ],
  "ai-agents": [
    "ai-agents-explained",
    "claude-code-vs-gemini-cli",
    "how-to-build-ai-toolkit",
  ],
  "data-analytics": [
    "best-ai-spreadsheet-data-tools",
    "best-ai-research-tools",
    "how-to-choose-the-best-ai-tool-for-your-workflow",
  ],
  "llm-providers": [
    "chatgpt-vs-claude-vs-gemini",
    "run-ai-locally-open-source-models",
    "best-lmarena-alternatives",
  ],
  "local-open-source": [
    "run-ai-locally-open-source-models",
    "best-llama-cpp-alternatives",
    "ai-privacy-guide-for-normal-people",
  ],
  "mcp-skills-platforms": [
    "ai-agents-explained",
    "run-ai-locally-open-source-models",
    "how-to-build-ai-toolkit",
  ],
  "ai-education": [
    "ai-tools-for-beginners",
    "understanding-ai-hallucinations",
    "how-to-write-better-ai-prompts",
  ],
  "ai-science-healthcare": [
    "best-ai-research-tools",
    "understanding-ai-hallucinations",
    "ai-privacy-guide-for-normal-people",
  ],
  "ai-3d-game-dev": [
    "best-ai-video-tools-2026",
    "ai-image-generators-guide",
    "top-ai-tools-for-building-websites",
  ],
  "agents-automation": [
    "ai-agents-explained",
    "how-to-build-ai-toolkit",
    "how-to-use-ai-for-marketing",
  ],
  "models-infrastructure": [
    "run-ai-locally-open-source-models",
    "best-llama-cpp-alternatives",
    "best-lmarena-alternatives",
  ],
  "music-audio": [
    "best-ai-voice-audio-tools-2026",
    "elevenlabs-vs-higgsfield",
    "best-free-ai-tools-2026",
  ],
};

/** Per-tool overrides for high-traffic tools — checked before the category map. */
const TOOL_GUIDE_MAP: Record<string, string[]> = {
  chatgpt: [
    "chatgpt-vs-claude-vs-gemini",
    "how-to-write-better-ai-prompts",
    "understanding-ai-hallucinations",
  ],
  midjourney: [
    "ai-image-generators-guide",
    "best-free-ai-tools-2026",
    "free-ai-tools-no-signup",
  ],
  cursor: [
    "cursor-vs-github-copilot",
    "top-ai-tools-for-building-websites",
    "claude-code-vs-gemini-cli",
  ],
  "github-copilot": [
    "cursor-vs-github-copilot",
    "claude-code-vs-gemini-cli",
    "top-ai-tools-for-building-websites",
  ],
  elevenlabs: [
    "best-ai-voice-audio-tools-2026",
    "elevenlabs-vs-higgsfield",
    "best-ai-video-tools-2026",
  ],
};

/** Fallback for categories (or tools) without a curated mapping. */
const DEFAULT_GUIDES: string[] = [
  "best-free-ai-tools-2026",
  "how-to-choose-the-best-ai-tool-for-your-workflow",
  "ai-tools-for-beginners",
];

/**
 * Resolve the blog post slugs to feature on a tool page. A per-tool override
 * wins; otherwise the tool's category mapping; otherwise the default list.
 */
export function getRelatedGuideSlugs(
  toolSlug: string,
  categorySlug?: string | null
): string[] {
  const toolGuides = TOOL_GUIDE_MAP[toolSlug];
  if (toolGuides) return toolGuides;

  if (categorySlug) {
    const categoryGuides = CATEGORY_GUIDE_MAP[categorySlug];
    if (categoryGuides) return categoryGuides;
  }

  return DEFAULT_GUIDES;
}
