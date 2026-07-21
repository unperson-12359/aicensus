// ------------------------------------------------------------
// Hand-written editorial verdicts for the highest-traffic
// /compare/<a>/<b> pairs. The auto-generated intro in
// comparison-content.ts is identical in structure across every
// comparison page; these verdicts give the top pairs unique,
// opinionated copy instead.
//
// Keys are the normalized comparison key: the two slugs sorted
// alphabetically and joined with "|" (see compare-urls.ts).
// Keep verdicts qualitative (no version numbers or prices that
// rot) and in the site's direct "X wins if…; Y wins if…" voice.
// ------------------------------------------------------------

import { comparisonKey } from "@/lib/compare-urls";

export const COMPARE_VERDICTS: Record<string, string> = {
  // -- Frontier assistants -------------------------------------------------
  "chatgpt|claude":
    "ChatGPT wins if you want one app that does everything — strong reasoning, image generation, browsing, memory, and the largest ecosystem around it. Claude wins if your work is long-form writing, careful analysis, or code — it follows instructions more literally and produces cleaner prose with less filler. If you can only pay for one, pick whichever default style you argue with less; most heavy users end up with both.",
  "chatgpt|gemini":
    "ChatGPT wins as a general-purpose assistant: stronger creative writing, a more mature app, and better memory across conversations. Gemini wins if you live in Google Workspace — its long context and native Docs, Gmail, and Drive integration make it the shortest path to AI inside files you already have. Raw model quality is close enough that your ecosystem should decide this one.",
  "claude|gemini":
    "Claude wins for writing quality, nuanced analysis, and coding — it is more careful with long documents and less prone to confident filler. Gemini wins on context length, multimodal breadth, and price, and it slots directly into Google Workspace. Pick Claude for craft, Gemini for scale and integration.",
  "chatgpt|grok":
    "ChatGPT wins for almost everyone: broader features, more reliable reasoning, better memory, and a real third-party ecosystem. Grok wins if you want fewer guardrails and deep X integration — its real-time access to X is genuinely unique. Unless X is your daily workflow, ChatGPT is the safer default.",
  "claude|grok":
    "Claude wins for serious work — long documents, code, analysis, and writing where accuracy and tone matter. Grok wins for real-time X awareness and a looser, more opinionated personality. These barely overlap: pick Claude as your workhorse, and only consider Grok if your information diet runs through X.",
  "chatgpt|perplexity":
    "Perplexity wins for research: cited answers, clickable sources, and a search-first design that makes verification cheap. ChatGPT wins as a general assistant — writing, coding, images, and long multi-step tasks. Many people use both: Perplexity to find what is true, ChatGPT to do something with it.",
  "claude|perplexity":
    "These do different jobs. Perplexity wins for finding and citing current information — it is an answer engine, not a chatbot. Claude wins for working with what you found: drafting, analysis, code, and long-document reasoning. If you mostly need sourced answers, pick Perplexity; if you mostly need thinking and writing, pick Claude.",
  "gemini|grok":
    "Gemini wins on capability and integration — long context, Workspace hooks, and multimodal features cover far more ground. Grok wins on real-time social awareness, with X data nothing else matches. For most people this is not close: Gemini is the better tool; Grok is the more entertaining companion.",

  // -- Coding --------------------------------------------------------------
  "cursor|github-copilot":
    "Cursor wins if you want the most capable AI coding environment and will switch editors to get it — its agent mode, multi-file edits, and model choice are a step ahead. Copilot wins if you must stay in your existing IDE or your company already pays for it, and its free tier is the cheapest way to try AI coding. Power users pick Cursor; everyone else starts with Copilot.",
  "cursor|windsurf":
    "Both are AI-first editors and closer to each other than to anything else. Cursor wins on polish, agent reliability, and community momentum — it is the default choice for a reason. Windsurf wins on flow-style automation and often on price. Try both on a real project for a week; at this point the difference is feel more than features.",
  "claude-code|openai-codex":
    "Claude Code wins for terminal-native agentic coding — it reads large codebases well, follows instructions tightly, and its plans rarely go off the rails. Codex wins if you are deep in the OpenAI ecosystem and want cloud-sandboxed task execution tied to your ChatGPT subscription. For day-to-day repo work, most developers we hear from reach for Claude Code first.",
  "claude-code|cursor":
    "These are complements more than competitors. Claude Code wins for terminal-driven agentic tasks — refactors, test runs, and multi-step changes you supervise from the CLI. Cursor wins for interactive editing: autocomplete, inline edits, and diffs you watch as you work. Plenty of developers run both — Cursor to write, Claude Code to transform.",

  // -- Image ---------------------------------------------------------------
  "chatgpt|midjourney":
    "Different tools that happen to overlap. Midjourney wins for image quality and artistic control — it remains the benchmark for aesthetics, style, and photographic detail. ChatGPT wins for convenience: images inside a chat you already use, with decent text rendering and edits by instruction. Designers pick Midjourney; everyone else is fine with ChatGPT.",
  "flux|midjourney":
    "Midjourney wins on taste — its default aesthetic, style consistency, and community knowledge are still ahead. FLUX wins on openness: weights you can self-host, fine-tune, and run inside ComfyUI pipelines without per-image costs. Artists who want the best output pick Midjourney; builders who want control pick FLUX.",
  "ideogram|midjourney":
    "Midjourney wins on overall image quality and artistic range. Ideogram wins on one thing that matters a lot: accurate text inside images — logos, posters, and designs with words. If your images need legible typography, start with Ideogram; for everything else, Midjourney.",

  // -- Video ---------------------------------------------------------------
  "pika|runway":
    "Runway wins for serious video work — better consistency, more control, and a track record in real productions. Pika wins for speed and playfulness: fast, cheap generations for social content and effects. Professionals pick Runway; casual creators have more fun with Pika.",
  "kling-ai|runway":
    "Kling wins on raw generation quality per dollar — realistic motion, longer clips, and aggressive pricing. Runway wins on the full workflow: editing tools, control features, and the reliability client work demands. If you are generating volume, pick Kling; if you are delivering finished work, pick Runway.",
  "luma-dream-machine|runway":
    "Runway wins for control and professional features — it is the more complete video toolkit. Luma Dream Machine wins for ease and speed: good-looking clips from a prompt with almost no learning curve. New to AI video? Start with Luma. Shipping work? Runway.",
  "heygen|synthesia":
    "Both make avatar talking-head videos, for different buyers. Synthesia wins for corporate training and localization — mature enterprise controls, templates, and compliance. HeyGen wins for marketing and creator content — faster iteration, strong avatar realism, and features like video translation. Internal L&D teams pick Synthesia; growth teams pick HeyGen.",

  // -- Music ---------------------------------------------------------------
  "suno|udio":
    "Suno wins for complete songs fast — vocals, structure, and radio-ready output from a short prompt, with the friendlier free on-ramp. Udio wins for audio fidelity and genre nuance, especially for producers who like iterating section by section. Casual creators pick Suno; musicians tinkering toward a track pick Udio.",
};

/**
 * Return the hand-written verdict for a comparison, or null when the pair
 * has none (fall back to generated copy).
 */
export function getCompareVerdict(slugs: string[]): string | null {
  if (slugs.length !== 2) return null;
  return COMPARE_VERDICTS[comparisonKey(slugs)] ?? null;
}
