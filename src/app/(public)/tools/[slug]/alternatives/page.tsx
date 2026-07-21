import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedToolGrid } from "@/components/tools/animated-tool-grid";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Pagination } from "@/components/shared/pagination";
import { PaginationInfo } from "@/components/shared/pagination-info";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { ToolLogo } from "@/components/shared/tool-logo";
import { FadeIn, RevealText } from "@/components/motion";
import { getLogoUrl } from "@/lib/utils";
import {
  getToolBySlug,
  getToolAlternativesBidirectional,
  getRelatedToolsByCategoryId,
} from "@/lib/queries/tools";
import {
  buildIntroParagraph,
  buildAlternativeBlurb,
  buildFaq,
  buildMethodologyLine,
} from "@/lib/alternatives-content";
import { formatContentLastUpdated } from "@/lib/content-dates";
import { getComparisonPath } from "@/lib/compare-urls";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600;

const ALTERNATIVES_PER_PAGE = 6;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: "Not Found" };

  const title = `Best ${tool.name} Alternatives in 2026 — Reviewed`;
  const description = `The top alternatives to ${tool.name}, compared side-by-side. Pricing, pros & cons, ratings, and the verdict on which one fits your use case.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  // Only curated versions (explicit tool_alternatives rows) stay indexed.
  // The category-fallback version is thin near-duplicate content.
  let curated = false;
  try {
    curated = (await getToolAlternativesBidirectional(tool.id)).length > 0;
  } catch {
    curated = false;
  }

  // Paginated URLs (?page=N, N>1) are self-canonical and noindex,follow.
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const isPaginated = page > 1;
  const canonicalPath = isPaginated
    ? `/tools/${slug}/alternatives?page=${page}`
    : `/tools/${slug}/alternatives`;

  return {
    title,
    description,
    openGraph: { title, description, url: `/tools/${slug}/alternatives` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${siteUrl}${canonicalPath}` },
    ...(!curated || isPaginated
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function AlternativesPage({
  params,
  searchParams,
}: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  // Pull explicit alternatives first; fall back to category-based suggestions
  // so every tool has a useful page even when curation is incomplete.
  let alternatives: ToolWithCategory[] = [];
  let usedFallback = false;
  try {
    alternatives = await getToolAlternativesBidirectional(tool.id);
  } catch {
    alternatives = [];
  }

  if (alternatives.length === 0 && tool.category_id) {
    try {
      alternatives = await getRelatedToolsByCategoryId(tool.category_id, tool.id, 12);
      usedFallback = alternatives.length > 0;
    } catch {
      alternatives = [];
    }
  }

  const currentPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const total = alternatives.length;
  const totalPages = Math.max(1, Math.ceil(total / ALTERNATIVES_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);

  if (currentPage !== clampedPage) {
    const target =
      clampedPage > 1
        ? `/tools/${slug}/alternatives?page=${clampedPage}`
        : `/tools/${slug}/alternatives`;
    redirect(target);
  }

  const offset = (clampedPage - 1) * ALTERNATIVES_PER_PAGE;
  const paged = alternatives.slice(offset, offset + ALTERNATIVES_PER_PAGE);

  const top3 = alternatives.slice(0, 3);
  const tableTools = [tool, ...alternatives.slice(0, 3)];
  const intro = buildIntroParagraph(tool, total);
  const faqs = buildFaq(tool, alternatives);
  const lastUpdated = formatContentLastUpdated([tool, ...alternatives]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Alternatives to ${tool.name}`,
    description: `AI tools similar to ${tool.name}`,
    url: `${siteUrl}/tools/${slug}/alternatives`,
    numberOfItems: total,
    itemListElement: alternatives.map((alt, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: alt.name,
        url: `${siteUrl}/tools/${alt.slug}`,
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${siteUrl}/tools/${slug}` },
      { "@type": "ListItem", position: 4, name: "Alternatives" },
    ],
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

  return (
    <>
      <JsonLd data={itemListLd} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: tool.name, href: `/tools/${slug}` },
              { label: "Alternatives" },
            ]}
          />
        </FadeIn>

        {/* Hero */}
        <FadeIn>
          <div className="mt-6 sm:mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
              § Alternatives · Updated {lastUpdated}
            </p>
            <div className="mt-4 sm:mt-5">
              <RevealText>
                <h1 className="font-serif text-[clamp(1.75rem,5.5vw,3.75rem)] font-normal leading-[0.98] tracking-[-0.035em]">
                  Best alternatives to{" "}
                  <em className="font-serif italic text-white/55">{tool.name}</em>
                  <span className="text-white/35">.</span>
                </h1>
              </RevealText>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {intro}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/tools/${slug}`}>
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back to {tool.name}
                </Link>
              </Button>
              {tool.category_id && tool.categories && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/categories/${tool.categories.slug}`}>
                    All {tool.categories.name}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </FadeIn>

        {total === 0 ? (
          <FadeIn delay={0.2}>
            <div className="mt-16 border border-white/10 bg-white/[0.02] p-10 text-center">
              <p className="font-serif text-2xl italic text-white/80">
                We&apos;re still curating alternatives.
              </p>
              <p className="mt-2 max-w-md mx-auto text-sm text-white/55">
                {tool.name} sits in a category we haven&apos;t finished mapping.
                Check back soon, or browse the full directory.
              </p>
              <div className="mt-5">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/tools">Browse all tools</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        ) : (
          <>
            {/* Top picks with editorial blurbs */}
            {top3.length > 0 && (
              <FadeIn delay={0.15}>
                <section className="mt-14 sm:mt-20">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                      § Top picks
                    </p>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-3">
                    {top3.map((alt, i) => {
                      const num = String(i + 1).padStart(2, "0");
                      const logoSrc = getLogoUrl(alt.logo_url, alt.website_url);
                      const blurb = buildAlternativeBlurb(tool, alt);
                      return (
                        <article
                          key={alt.id}
                          className="bento-tile group relative flex h-full flex-col p-5 sm:p-6"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-serif text-3xl italic leading-none text-white/30">
                              {num}
                            </span>
                            <ToolLogo
                              src={logoSrc}
                              name={alt.name}
                              className="h-10 w-10 rounded-xl border border-white/10 text-sm"
                            />
                          </div>
                          <div className="mt-4">
                            <h2 className="font-serif text-2xl leading-tight tracking-[-0.02em]">
                              <Link
                                href={`/tools/${alt.slug}`}
                                className="hover:text-white/80"
                              >
                                {alt.name}
                              </Link>
                            </h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <PricingBadge pricing={alt.pricing_model} />
                              <RatingStars rating={alt.editor_rating} size="sm" />
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-white/70">
                              {blurb}
                            </p>
                          </div>
                          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                            <Link
                              href={getComparisonPath([tool.slug, alt.slug])}
                              className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
                            >
                              vs {tool.name} →
                            </Link>
                            <a
                              href={alt.affiliate_url || alt.website_url}
                              target="_blank"
                              rel={
                                alt.affiliate_url
                                  ? "noopener noreferrer sponsored nofollow"
                                  : "noopener noreferrer"
                              }
                              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
                            >
                              Visit <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </FadeIn>
            )}

            {/* Side-by-side spec table */}
            {tableTools.length >= 2 && (
              <FadeIn delay={0.2}>
                <section className="mt-16 sm:mt-24">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                      § At a glance
                    </p>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <h2 className="mt-4 font-serif text-2xl italic leading-tight tracking-[-0.02em] text-white/85 sm:text-3xl">
                    {tool.name} vs the top alternatives.
                  </h2>
                  <div className="mt-6">
                    <ComparisonTable tools={tableTools} />
                  </div>
                </section>
              </FadeIn>
            )}

            {/* Full grid */}
            <FadeIn delay={0.2}>
              <section id="results" className="mt-16 scroll-mt-24 sm:mt-24">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                    § Full list · {total} {total === 1 ? "alternative" : "alternatives"}
                    {usedFallback && tool.categories && (
                      <span className="ml-2 normal-case tracking-normal text-white/40">
                        (from {tool.categories.name})
                      </span>
                    )}
                  </p>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="mt-6">
                  <AnimatedToolGrid tools={paged} />
                </div>

                {totalPages > 1 ? (
                  <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
                    <PaginationInfo
                      currentPage={clampedPage}
                      perPage={ALTERNATIVES_PER_PAGE}
                      total={total}
                      label="alternatives"
                    />
                    <Pagination
                      currentPage={clampedPage}
                      totalPages={totalPages}
                      basePath={`/tools/${slug}/alternatives`}
                      anchor="results"
                    />
                  </div>
                ) : (
                  <div className="mt-8 flex justify-center">
                    <PaginationInfo
                      currentPage={clampedPage}
                      perPage={ALTERNATIVES_PER_PAGE}
                      total={total}
                      label="alternatives"
                    />
                  </div>
                )}
              </section>
            </FadeIn>

            {/* FAQ */}
            {faqs.length > 0 && (
              <FadeIn delay={0.2}>
                <section className="mt-20 sm:mt-28">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                      § Common questions
                    </p>
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

            {/* Methodology */}
            <FadeIn delay={0.2}>
              <section className="mt-20 border-t border-white/10 pt-10 sm:mt-28">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
                      Methodology
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">
                      {buildMethodologyLine(tool)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <Badge variant="outline" className="text-[11px]">
                      <Sparkles className="mr-1 h-3 w-3" /> Curated, not algorithmic
                    </Badge>
                    <Link
                      href="/contact"
                      className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
                    >
                      Suggest an alternative <ArrowRight className="ml-1 inline h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </section>
            </FadeIn>
          </>
        )}
      </div>
    </>
  );
}
