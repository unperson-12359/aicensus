// ------------------------------------------------------------
// Editorial content helpers for /compare/<slugs> pages.
// Generates a verdict (which tool wins on what), per-tool "best for"
// callouts, and FAQ blocks — all derived from tool metadata so each
// comparison page renders distinct copy.
// ------------------------------------------------------------

import type { ToolWithCategory } from "@/lib/types/database";
import { getCompareVerdict } from "@/lib/compare-verdicts";

const PRICING_DESCRIPTOR: Record<string, string> = {
  free: "fully free",
  freemium: "freemium with paid tiers",
  paid: "paid",
  open_source: "open-source and self-hostable",
  enterprise: "enterprise-priced",
  contact: "custom-priced",
};

const PRICING_RANK: Record<string, number> = {
  free: 0,
  open_source: 1,
  freemium: 2,
  paid: 3,
  enterprise: 4,
  contact: 5,
};

interface VerdictLine {
  label: string;
  toolName: string;
  reason: string;
}

export function buildVerdict(tools: ToolWithCategory[]): VerdictLine[] {
  if (tools.length < 2) return [];

  const lines: VerdictLine[] = [];

  // Highest editor rating
  const ratedSorted = [...tools]
    .filter((t) => t.editor_rating != null)
    .sort((a, b) => (b.editor_rating ?? 0) - (a.editor_rating ?? 0));
  if (ratedSorted.length > 0 && ratedSorted[0].editor_rating != null) {
    const top = ratedSorted[0];
    lines.push({
      label: "Highest rated",
      toolName: top.name,
      reason: `Editor score ${top.editor_rating!.toFixed(1)}/5 — leads on overall quality across our evaluation.`,
    });
  }

  // Cheapest pricing model
  const priceSorted = [...tools].sort(
    (a, b) =>
      (PRICING_RANK[a.pricing_model] ?? 99) - (PRICING_RANK[b.pricing_model] ?? 99)
  );
  const cheapest = priceSorted[0];
  if (cheapest) {
    lines.push({
      label: "Best value",
      toolName: cheapest.name,
      reason: `${PRICING_DESCRIPTOR[cheapest.pricing_model] ?? cheapest.pricing_model} pricing — the lowest-friction option of the group.`,
    });
  }

  // Most key features
  const featSorted = [...tools].sort(
    (a, b) => (b.key_features?.length ?? 0) - (a.key_features?.length ?? 0)
  );
  if (featSorted[0] && (featSorted[0].key_features?.length ?? 0) > 0) {
    const top = featSorted[0];
    lines.push({
      label: "Broadest feature set",
      toolName: top.name,
      reason: `${top.key_features!.length} headline features — the most all-in-one option.`,
    });
  }

  // Open-source pick if any
  const oss = tools.find((t) => t.pricing_model === "open_source");
  if (oss) {
    lines.push({
      label: "OSS / self-host",
      toolName: oss.name,
      reason: "Open-source — the only option in this group you can self-host or fork.",
    });
  }

  // Deduplicate by toolName so we don't repeat the same winner
  const seen = new Set<string>();
  return lines.filter((l) => {
    const k = `${l.label}:${l.toolName}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function buildBestForCallouts(tools: ToolWithCategory[]): {
  toolName: string;
  toolSlug: string;
  bestFor: string;
}[] {
  return tools.map((t) => {
    const persona = t.who_its_for?.[0];
    const useCase = t.use_cases?.[0];
    const fallback = t.tagline;
    const bestFor =
      persona && useCase
        ? `${persona} who need ${useCase.toLowerCase()}.`
        : persona
        ? `${persona}.`
        : useCase
        ? `${useCase}.`
        : fallback;
    return { toolName: t.name, toolSlug: t.slug, bestFor };
  });
}

export function buildIntroParagraph(tools: ToolWithCategory[]): string {
  // Hand-written editorial verdict for high-traffic pairs — keeps the top
  // comparison pages from sharing the same generated intro.
  const handVerdict = getCompareVerdict(tools.map((t) => t.slug));
  if (handVerdict) {
    return `${handVerdict} The spec sheet, editor scores, and answers below back that up with data.`;
  }

  const names = tools.map((t) => t.name);
  const joined =
    names.length === 2
      ? `${names[0]} and ${names[1]}`
      : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;

  const sameCategory =
    tools.every((t) => t.category_id) &&
    new Set(tools.map((t) => t.category_id)).size === 1;
  const cat = sameCategory ? tools[0].categories?.name?.toLowerCase() : null;
  const categoryClause = cat
    ? `Both compete in the ${cat} space, `
    : "These tools target overlapping use cases, ";

  return `${joined} are frequently shortlisted together. ${categoryClause}so the right pick comes down to pricing model, ecosystem, and the specific features you'll lean on. This page lays out the spec sheet, an editor verdict, and answers to the questions people search before choosing.`;
}

export function buildFaq(
  tools: ToolWithCategory[]
): { question: string; answer: string }[] {
  if (tools.length < 2) return [];
  const a = tools[0];
  const b = tools[1];
  const restNames = tools.slice(2).map((t) => t.name);

  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: `${a.name} vs ${b.name} — which is better?`,
    answer: `It depends on what you're optimizing for. ${
      a.editor_rating && b.editor_rating
        ? a.editor_rating > b.editor_rating
          ? `${a.name} edges ${b.name} on our editor rating (${a.editor_rating.toFixed(1)} vs ${b.editor_rating.toFixed(1)}), `
          : a.editor_rating < b.editor_rating
          ? `${b.name} edges ${a.name} on our editor rating (${b.editor_rating.toFixed(1)} vs ${a.editor_rating.toFixed(1)}), `
          : `Both score ${a.editor_rating.toFixed(1)} on our editor rating, `
        : ""
    }but ratings are a coarse signal. The verdict above breaks down which one wins for budget, feature breadth, and self-hosting.`,
  });

  // Free / pricing question
  const freeOnes = tools.filter(
    (t) => t.pricing_model === "free" || t.pricing_model === "freemium" || t.pricing_model === "open_source"
  );
  if (freeOnes.length > 0 && freeOnes.length < tools.length) {
    faqs.push({
      question: `Which of these is free?`,
      answer: `${freeOnes.map((t) => t.name).join(" and ")} ${freeOnes.length === 1 ? "is the" : "are the"} no-cost option${freeOnes.length === 1 ? "" : "s"} in this comparison${
        freeOnes.length === 1
          ? ` (${PRICING_DESCRIPTOR[freeOnes[0].pricing_model]})`
          : ""
      }. The rest charge per seat, per token, or by usage.`,
    });
  } else if (freeOnes.length === tools.length) {
    faqs.push({
      question: `Are these tools free?`,
      answer: `Yes — every tool here has a free or freemium tier. The differences are in usage limits, advanced features, and how aggressive each free tier is.`,
    });
  } else {
    faqs.push({
      question: `Are any of these free?`,
      answer: `No fully free options in this group. ${tools[0].name} is ${PRICING_DESCRIPTOR[tools[0].pricing_model]}, ${tools[1].name} is ${PRICING_DESCRIPTOR[tools[1].pricing_model]}${restNames.length > 0 ? `, and ${restNames.join(", ")} sit similarly` : ""}.`,
    });
  }

  // Use case question
  const aUseCase = a.use_cases?.[0];
  const bUseCase = b.use_cases?.[0];
  if (aUseCase || bUseCase) {
    faqs.push({
      question: `When should I pick ${a.name} over ${b.name}?`,
      answer: `Pick ${a.name} when ${aUseCase ? aUseCase.toLowerCase() : "its core feature set"} matters more than ${b.name}'s strengths in ${bUseCase ? bUseCase.toLowerCase() : "its primary domain"}. The "best for" callouts above translate this into concrete personas.`,
    });
  }

  // The generic "other tools" closer is word-for-word identical on every
  // comparison page; skip it on pairs that have a hand-written verdict so
  // those pages stay fully unique.
  if (!getCompareVerdict(tools.map((t) => t.slug))) {
    faqs.push({
      question: `Are there other tools to consider?`,
      answer: `Yes — every tool in this comparison has its own alternatives page that ranks the closest competitors. Click any tool name to drill into its full review and alternatives list.`,
    });
  }

  return faqs;
}
