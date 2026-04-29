// ------------------------------------------------------------
// Editorial content helpers for the /tools/[slug]/alternatives page.
// We don't want every alternatives page to read like the same template —
// these helpers generate copy that varies based on the tool's metadata
// (category, pricing, key features) so each page is unique enough for
// search engines and useful for readers.
// ------------------------------------------------------------

import type { Tool, ToolWithCategory } from "@/lib/types/database";

const PRICING_LABEL: Record<string, string> = {
  free: "free",
  freemium: "freemium",
  paid: "paid",
  open_source: "open-source",
  enterprise: "enterprise",
  contact: "contact-sales",
};

const PRICING_DESCRIPTOR: Record<string, string> = {
  free: "fully free",
  freemium: "freemium with paid tiers",
  paid: "paid",
  open_source: "open-source and self-hostable",
  enterprise: "enterprise-priced",
  contact: "custom-priced (contact sales)",
};

function articleFor(noun: string): "a" | "an" {
  return /^[aeiou]/i.test(noun.trim()) ? "an" : "a";
}

export function buildIntroParagraph(tool: ToolWithCategory, alternativesCount: number): string {
  const categoryName = tool.categories?.name?.toLowerCase() ?? "AI";
  const pricingLabel = PRICING_DESCRIPTOR[tool.pricing_model] ?? tool.pricing_model;
  const verb = alternativesCount > 0 ? "Here are" : "Browse";
  const count = alternativesCount > 0 ? `${alternativesCount} ` : "";

  return `${tool.name} is ${articleFor(pricingLabel)} ${pricingLabel} ${categoryName} tool. If it's not the right fit — pricing, missing features, performance, or you just want to compare — there are strong alternatives worth a look. ${verb} ${count}of the closest matches in 2026, ranked by editor rating with notes on where each one beats or trails ${tool.name}.`;
}

export function buildMethodologyLine(tool: ToolWithCategory): string {
  const cat = tool.categories?.name ?? "this category";
  return `Tools selected from our ${cat} index, ranked by editor rating, manually curated for relevance to ${tool.name} use cases. Pricing reflects published rates as of the last update.`;
}

/**
 * Generate a one-line "why this is a real alternative" pitch comparing the
 * alternative to the original tool. Pulls from the alternative's tagline,
 * pricing model, and editor rating. Keeps each page's blurbs distinct
 * because the input data differs per pair.
 */
export function buildAlternativeBlurb(
  original: Tool,
  alt: ToolWithCategory
): string {
  const altPricing = PRICING_DESCRIPTOR[alt.pricing_model] ?? alt.pricing_model;
  const origPricing = PRICING_DESCRIPTOR[original.pricing_model] ?? original.pricing_model;

  const sameModel = alt.pricing_model === original.pricing_model;
  const cheaper =
    (original.pricing_model === "paid" || original.pricing_model === "enterprise") &&
    (alt.pricing_model === "free" || alt.pricing_model === "freemium" || alt.pricing_model === "open_source");
  const pricier =
    (alt.pricing_model === "paid" || alt.pricing_model === "enterprise") &&
    (original.pricing_model === "free" || original.pricing_model === "freemium" || original.pricing_model === "open_source");

  let pricingLine = "";
  if (cheaper) {
    pricingLine = `Cheaper than ${original.name} (${altPricing} vs ${origPricing}).`;
  } else if (pricier) {
    pricingLine = `Pricier than ${original.name} (${altPricing} vs ${origPricing}) — usually buys more capability or scale.`;
  } else if (sameModel) {
    pricingLine = `Same pricing model as ${original.name} (${altPricing}).`;
  } else {
    pricingLine = `${altPricing.charAt(0).toUpperCase() + altPricing.slice(1)} pricing.`;
  }

  const ratingLine = (() => {
    const orig = original.editor_rating ?? 0;
    const altr = alt.editor_rating ?? 0;
    if (!orig || !altr) return "";
    if (altr > orig) return ` Rated ${altr.toFixed(1)} vs ${orig.toFixed(1)} for ${original.name}.`;
    if (altr === orig) return ` Same editor rating (${altr.toFixed(1)}).`;
    return ` Rated ${altr.toFixed(1)} vs ${orig.toFixed(1)} for ${original.name}.`;
  })();

  return `${alt.tagline} ${pricingLine}${ratingLine}`.trim();
}

export function buildFaq(
  tool: ToolWithCategory,
  topAlternatives: ToolWithCategory[]
): { question: string; answer: string }[] {
  const cat = tool.categories?.name ?? "AI tool";
  const pricing = PRICING_LABEL[tool.pricing_model] ?? tool.pricing_model;
  const top3 = topAlternatives.slice(0, 3).map((t) => t.name);

  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: `What are the best alternatives to ${tool.name}?`,
    answer:
      top3.length > 0
        ? `Our top-rated alternatives to ${tool.name} are ${top3.join(", ")}${top3.length > 1 ? "" : ""} — ranked by editor rating, feature parity, and overall fit. The full list below is sorted so the closest matches appear first.`
        : `${tool.name} sits in a fast-moving space. We're actively adding alternatives — check back soon, or browse the ${cat} category for similar tools.`,
  });

  faqs.push({
    question: `Is ${tool.name} free?`,
    answer:
      tool.pricing_model === "free"
        ? `Yes — ${tool.name} is fully free to use. Some of the alternatives below are paid; we've called out which is which in each card.`
        : tool.pricing_model === "open_source"
        ? `${tool.name} is open-source and self-hostable. If you'd rather not host, several alternatives below are managed SaaS.`
        : tool.pricing_model === "freemium"
        ? `${tool.name} has a free tier with paid upgrades. If you've outgrown the free tier, the alternatives below include both cheaper and more powerful options.`
        : tool.pricing_model === "paid"
        ? `${tool.name} is a paid (${pricing}) tool. If price is the reason you're looking, the alternatives below include free, freemium, and open-source options.`
        : `${tool.name} uses ${pricing} pricing. The alternatives below cover free, freemium, paid, and open-source pricing — pick whichever model fits your budget.`,
  });

  faqs.push({
    question: `What's similar to ${tool.name}?`,
    answer: `Tools similar to ${tool.name} typically share the same use case (${cat.toLowerCase()}) and overlap on the core features below. The closer the editor rating and feature set, the more directly the alternative competes.`,
  });

  if (topAlternatives.length > 0) {
    const lead = topAlternatives[0];
    faqs.push({
      question: `${tool.name} vs ${lead.name} — which is better?`,
      answer: `It depends on what you're optimizing for. ${lead.name} ${lead.editor_rating && tool.editor_rating && lead.editor_rating > tool.editor_rating ? "edges out" : "is closely matched with"} ${tool.name} on our editor scoring, but the right pick comes down to pricing model, ecosystem, and which features you actually use. See the full side-by-side comparison for the verdict.`,
    });
  }

  faqs.push({
    question: `How did you choose these alternatives?`,
    answer: `${buildMethodologyLine(tool)} We re-evaluate quarterly and accept reader suggestions through the contact page.`,
  });

  return faqs;
}
