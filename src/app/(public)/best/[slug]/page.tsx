import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, RevealText } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { getLogoUrl } from "@/lib/utils";
import { getToolsBySlugs } from "@/lib/queries/tools";
import {
  getBestForBySlug,
  getAllBestForSlugs,
  BEST_FOR_PAGES,
} from "@/lib/best-for";
import { getStackBySlug } from "@/lib/stacks";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBestForSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getBestForBySlug(slug);
  if (!page) return { title: "Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const description = `${page.tagline} ${page.intro}`.slice(0, 300);

  return {
    title: `${page.title} | AiCensus`,
    description,
    openGraph: { title: page.title, description, url: `/best/${slug}` },
    twitter: { card: "summary_large_image", title: page.title, description },
    alternates: { canonical: `${siteUrl}/best/${slug}` },
  };
}

function formatLastUpdated(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function BestForPage({ params }: Props) {
  const { slug } = await params;
  const page = getBestForBySlug(slug);
  if (!page) notFound();

  const slugs = page.picks.map((p) => p.slug);
  let tools: ToolWithCategory[] = [];
  try {
    tools = await getToolsBySlugs(slugs);
  } catch {
    tools = [];
  }
  const toolMap = new Map<string, ToolWithCategory>();
  for (const t of tools) toolMap.set(t.slug, t);

  const stack = page.relatedStack ? getStackBySlug(page.relatedStack) : undefined;

  const otherPages = BEST_FOR_PAGES.filter((p) => p.slug !== slug).slice(0, 6);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const lastUpdated = formatLastUpdated();

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.title,
    description: page.intro,
    url: `${siteUrl}/best/${slug}`,
    numberOfItems: page.picks.length,
    itemListElement: page.picks.map((pick, i) => {
      const t = toolMap.get(pick.slug);
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: t?.name ?? pick.slug,
          url: `${siteUrl}/tools/${pick.slug}`,
          description: pick.pitch,
        },
      };
    }),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Best of", item: `${siteUrl}/best` },
      { "@type": "ListItem", position: 3, name: page.title },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({
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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Best of", href: "/best" },
              { label: page.tagline },
            ]}
          />
        </FadeIn>

        {/* Hero */}
        <FadeIn>
          <div className="mt-6 sm:mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
              § Best of · Updated {lastUpdated}
            </p>
            <div className="mt-4 sm:mt-5">
              <RevealText>
                <h1 className="font-serif text-[clamp(1.75rem,5.5vw,3.75rem)] font-normal leading-[0.98] tracking-[-0.035em]">
                  {page.title.split(" ").slice(0, -1).join(" ")}{" "}
                  <em className="font-serif italic text-white/55">
                    {page.title.split(" ").slice(-1)}
                  </em>
                  <span className="text-white/35">.</span>
                </h1>
              </RevealText>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {page.intro}
            </p>
          </div>
        </FadeIn>

        {/* Picks */}
        <FadeIn delay={0.15}>
          <section className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                § The picks
              </p>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <ol className="mt-6 space-y-4 sm:space-y-5">
              {page.picks.map((pick, i) => {
                const tool = toolMap.get(pick.slug);
                const num = String(i + 1).padStart(2, "0");
                const logoSrc = tool
                  ? getLogoUrl(tool.logo_url, tool.website_url)
                  : null;
                return (
                  <li
                    key={pick.slug}
                    className="bento-tile group relative grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-6 sm:p-6"
                  >
                    {/* Rank + logo */}
                    <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                      <span className="font-serif text-3xl italic leading-none text-white/30 sm:text-4xl">
                        {num}
                      </span>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={tool?.name ?? pick.slug}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (tool?.name ?? pick.slug).charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-xl leading-tight tracking-[-0.02em] sm:text-2xl">
                          <Link
                            href={`/tools/${pick.slug}`}
                            className="hover:text-white/85"
                          >
                            {tool?.name ?? pick.slug}
                          </Link>
                        </h2>
                        {tool && (
                          <>
                            <PricingBadge pricing={tool.pricing_model} />
                            <RatingStars rating={tool.editor_rating} size="sm" />
                          </>
                        )}
                      </div>
                      {tool?.tagline && (
                        <p className="mt-1 text-sm text-white/55">
                          {tool.tagline}
                        </p>
                      )}
                      <p className="mt-3 font-serif text-base italic leading-relaxed text-white/80">
                        {pick.pitch}
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                      {tool && (
                        <a
                          href={tool.affiliate_url || tool.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm">
                            Visit
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                          </Button>
                        </a>
                      )}
                      <Link href={`/tools/${pick.slug}`}>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </FadeIn>

        {/* Related stack */}
        {stack && (
          <FadeIn delay={0.2}>
            <section className="mt-16 sm:mt-20">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § Related recipe
                </p>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <Link
                href={`/stacks/${stack.slug}`}
                className="bento-tile group mt-6 flex flex-col gap-3 p-5 transition-colors hover:border-white/30 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div>
                  <h3 className="font-serif text-2xl italic leading-tight tracking-[-0.02em]">
                    {stack.name}
                  </h3>
                  <p className="mt-2 font-serif text-sm italic text-white/65">
                    {stack.tagline}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-white/40 transition-colors group-hover:text-white" />
              </Link>
            </section>
          </FadeIn>
        )}

        {/* FAQ */}
        {page.faq.length > 0 && (
          <FadeIn delay={0.2}>
            <section className="mt-16 sm:mt-24">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § Common questions
                </p>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-2">
                {page.faq.map((faq, i) => (
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

        {/* Other Best-of pages */}
        {otherPages.length > 0 && (
          <FadeIn delay={0.2}>
            <section className="mt-20 border-t border-white/10 pt-10 sm:mt-28">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § More best-of lists
                </p>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {otherPages.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/best/${p.slug}`}
                    className="bento-tile group flex items-center justify-between p-4 transition-colors hover:border-white/30 sm:p-5"
                  >
                    <span className="font-serif text-base text-white/85 sm:text-lg">
                      {p.title.replace(/^Best /, "").replace(/in 2026.*/, "")}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white" />
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/best"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
                >
                  All best-of lists <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </section>
          </FadeIn>
        )}

        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-2 sm:mt-14">
            <Badge variant="outline" className="text-[11px]">
              <Sparkles className="mr-1 h-3 w-3" /> Curated, not algorithmic
            </Badge>
            <Link
              href="/contact"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
            >
              Suggest an addition →
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
