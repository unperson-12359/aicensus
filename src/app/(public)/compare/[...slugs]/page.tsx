import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Trophy, Sparkles, ArrowRight } from "lucide-react";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { SaveComparisonButton } from "@/components/saved/save-comparison-button";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FadeIn, RevealText } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/queries/tools";
import {
  buildVerdict,
  buildBestForCallouts,
  buildIntroParagraph,
  buildFaq,
} from "@/lib/comparison-content";
import { formatContentLastUpdated, maxUpdatedAt } from "@/lib/content-dates";
import {
  getComparisonPath,
  normalizeComparisonSlugs,
  shouldIndexComparison,
  slugsNeedRedirect,
} from "@/lib/compare-urls";
import {
  POPULAR_COMPARISONS,
  getRelatedComparisons,
} from "@/lib/popular-comparisons";
import { CompareViewTracker } from "@/components/compare/compare-view-tracker";
import { PageContainer } from "@/components/shared/page-container";
import { section } from "@/lib/layout";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600;
// Allow on-demand rendering of arbitrary slug combinations beyond the
// pre-rendered popular pairs.
export const dynamicParams = true;

interface Props {
  params: Promise<{ slugs: string[] }>;
}

// Pre-render the curated popular comparison pairs at build time so they ship
// indexable HTML without a DB round trip at request time.
export function generateStaticParams() {
  return POPULAR_COMPARISONS.map((pair) => ({ slugs: pair.slugs as string[] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  if (!slugs || slugs.length < 2 || slugs.length > 4) {
    return { title: "Compare AI Tools" };
  }

  const normalizedSlugs = normalizeComparisonSlugs(slugs);
  const tools = await Promise.all(normalizedSlugs.map((s) => getToolBySlug(s)));
  const names = tools.filter(Boolean).map((t) => t!.name);
  if (names.length < 2) return { title: "Compare AI Tools" };

  const title = `${names.join(" vs ")} — Detailed Comparison (2026)`;
  const description = `${names.join(" vs ")}: side-by-side pricing, features, ratings, pros & cons, plus our verdict on which one wins for which use case.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const canonicalPath = getComparisonPath(normalizedSlugs);
  const indexable = shouldIndexComparison(normalizedSlugs);

  return {
    title,
    description,
    openGraph: { title, description, url: canonicalPath },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${siteUrl}${canonicalPath}` },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function ComparePage({ params }: Props) {
  const { slugs } = await params;
  if (!slugs || slugs.length < 2 || slugs.length > 4) notFound();

  if (slugsNeedRedirect(slugs)) {
    permanentRedirect(getComparisonPath(slugs));
  }

  const normalizedSlugs = normalizeComparisonSlugs(slugs);
  const toolResults = await Promise.all(normalizedSlugs.map((s) => getToolBySlug(s)));
  const tools = toolResults.filter((t): t is ToolWithCategory => t !== null);
  if (tools.length < 2) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const canonicalPath = getComparisonPath(normalizedSlugs);
  const names = tools.map((t) => t.name);
  const verdicts = buildVerdict(tools);
  const bestFor = buildBestForCallouts(tools);
  const intro = buildIntroParagraph(tools);
  const faqs = buildFaq(tools);
  const related = getRelatedComparisons(normalizedSlugs, 6);
  const lastUpdated = formatContentLastUpdated(tools);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${names.join(" vs ")} Comparison`,
    url: `${siteUrl}${canonicalPath}`,
    // Mirror the visible "Updated" label: newest updated_at among the compared tools.
    dateModified: maxUpdatedAt(tools).toISOString(),
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "SoftwareApplication", name: t.name, url: `${siteUrl}/tools/${t.slug}` },
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  // Slug → display label helper; used as a fallback whenever a DB name
  // lookup misses, since slugs are human-readable enough to render.
  const titleCase = (s: string) =>
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // Resolve real display names ("GitHub Copilot", not "Github Copilot") for
  // the related-comparison cards. One batched lookup per unique slug; any
  // miss falls back to the title-cased slug.
  const relatedSlugs = Array.from(
    new Set(related.flatMap((p) => p.slugs as string[]))
  ).filter((s) => !normalizedSlugs.includes(s));
  const relatedTools = await Promise.all(
    relatedSlugs.map((s) => getToolBySlug(s))
  );
  const nameBySlug = new Map<string, string>(
    tools.map((t) => [t.slug, t.name] as [string, string])
  );
  relatedTools.forEach((t, i) => {
    if (t) nameBySlug.set(relatedSlugs[i], t.name);
  });
  const relatedName = (s: string) => nameBySlug.get(s) ?? titleCase(s);

  return (
    <>
      <CompareViewTracker slugs={tools.map((tool) => tool.slug)} />
      <JsonLd data={itemListLd} />
      {faqs.length > 0 && <JsonLd data={faqLd} />}

      <PageContainer variant="editorial">
        <FadeIn>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Compare", href: "/compare" },
              { label: names.join(" vs ") },
            ]}
          />
        </FadeIn>

        {/* Hero */}
        <FadeIn>
          <div className="mt-6 sm:mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
              § Comparison · Updated {lastUpdated}
            </p>
            <div className="mt-4 sm:mt-5">
              <RevealText>
                <h1 className="font-serif text-[clamp(1.75rem,5.5vw,3.75rem)] font-normal leading-[0.98] tracking-[-0.035em]">
                  {names.map((n, i) => (
                    <span key={i}>
                      <span className="text-white">{n}</span>
                      {i < names.length - 1 && (
                        <em className="font-serif italic text-white/45"> vs </em>
                      )}
                    </span>
                  ))}
                  <span className="text-white/35">.</span>
                </h1>
              </RevealText>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {intro}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <SaveComparisonButton
                slugs={tools.map((tool) => tool.slug)}
                names={names}
              />
            </div>
          </div>
        </FadeIn>

        {/* Verdict */}
        {verdicts.length > 0 && (
          <FadeIn delay={0.15}>
            <section className={section.gap}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § Verdict
                </h2>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
                {verdicts.map((v, i) => (
                  <div
                    key={i}
                    className="bento-tile flex h-full flex-col p-5 sm:p-6"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-white/60" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                        {v.label}
                      </p>
                    </div>
                    <p className="mt-3 font-serif text-2xl italic leading-tight tracking-[-0.02em]">
                      {v.toolName}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {v.reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Spec table */}
        <FadeIn delay={0.2}>
          <section className={section.gapLoose}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                § Spec sheet
              </h2>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="mt-6">
              <ComparisonTable tools={tools} />
            </div>
          </section>
        </FadeIn>

        {/* Best for */}
        <FadeIn delay={0.2}>
          <section className={section.gapLoose}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                § Best for
              </h2>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-2">
              {bestFor.map((b) => (
                <Link
                  key={b.toolSlug}
                  href={`/tools/${b.toolSlug}`}
                  className="bento-tile group flex h-full flex-col p-5 transition-colors hover:border-white/30 sm:p-6"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-white/60" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                      Pick {b.toolName} for
                    </p>
                  </div>
                  <p className="mt-3 font-serif text-xl italic leading-snug text-white/85 sm:text-[1.4rem]">
                    {b.bestFor}
                  </p>
                  <span className="mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors group-hover:text-white sm:text-[11px]">
                    Read full review →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* FAQ */}
        {faqs.length > 0 && (
          <FadeIn delay={0.2}>
            <section className={section.gapLoose}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § Common questions
                </h2>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-2">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
                  >
                    <h3 className="font-display text-base font-semibold sm:text-lg">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Related comparisons */}
        {related.length > 0 && (
          <FadeIn delay={0.2}>
            <section className={section.divider}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § Related comparisons
                </h2>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slugs.join("-")}
                    href={getComparisonPath(p.slugs)}
                    className="bento-tile group flex items-center justify-between p-4 transition-colors hover:border-white/30 sm:p-5"
                  >
                    <span className="font-serif text-base text-white/85 sm:text-lg">
                      {p.slugs.map((s) => relatedName(s)).join(" vs ")}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white" />
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
                >
                  All comparisons <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </section>
          </FadeIn>
        )}

        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-2 sm:mt-14">
            <Badge variant="outline" className="text-[11px]">
              <Sparkles className="mr-1 h-3 w-3" /> Editorial verdicts, not algorithmic
            </Badge>
            <Link
              href="/contact"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
            >
              Disagree? Tell us →
            </Link>
          </div>
        </FadeIn>
      </PageContainer>
    </>
  );
}
