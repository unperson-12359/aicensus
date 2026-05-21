import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Users,
  DollarSign,
  Sparkles,
  Target,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PrevNextNav } from "@/components/shared/prev-next-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { SaveToolButton } from "@/components/saved/save-tool-button";
import { ToolOutboundLink } from "@/components/tools/tool-outbound-link";
import { ToolQuickFacts } from "@/components/tools/tool-quick-facts";
import { ToolDiscoverySection } from "@/components/tools/tool-discovery-section";
import { PageContainer } from "@/components/shared/page-container";
import { section } from "@/lib/layout";
import { JsonLd } from "@/components/shared/json-ld";
import { ToolLogo } from "@/components/shared/tool-logo";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";
import { getLogoUrl } from "@/lib/utils";
import {
  getToolBySlug,
  getToolAlternatives,
  getAdjacentTools,
  getToolsBySlugs,
} from "@/lib/queries/tools";
import { getComparisonsForTool } from "@/lib/popular-comparisons";
import { getBestForPagesForTool } from "@/lib/best-for";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  const description = `${tool.tagline}. Read our review of ${tool.name}: pricing, pros & cons, use cases, and alternatives.`;

  return {
    title: `${tool.name} — AI Tool Review & Pricing`,
    description,
    openGraph: {
      title: `${tool.name} — Review & Pricing | AiCensus`,
      description: tool.tagline,
      url: `/tools/${tool.slug}`,
      images: tool.screenshot_url
        ? [{ url: tool.screenshot_url }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} — AI Tool Review & Pricing`,
      description: tool.tagline,
    },
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let tool: Awaited<ReturnType<typeof getToolBySlug>>;
  let alternatives: Awaited<ReturnType<typeof getToolAlternatives>> = [];
  let adjacent: Awaited<ReturnType<typeof getAdjacentTools>> = {
    prev: null,
    next: null,
  };

  try {
    tool = await getToolBySlug(slug);
  } catch {
    notFound();
  }

  if (!tool) notFound();

  try {
    [alternatives, adjacent] = await Promise.all([
      getToolAlternatives(tool.id),
      getAdjacentTools(tool.name, tool.category_id),
    ]);
  } catch {
    alternatives = [];
    adjacent = { prev: null, next: null };
  }

  const popularComparisons = getComparisonsForTool(tool.slug).slice(0, 4);
  const bestForPages = getBestForPagesForTool(tool.slug, 2);
  const comparisonNameSlugs = Array.from(
    new Set(popularComparisons.flatMap((pair) => pair.slugs))
  );
  let comparisonNameBySlug = new Map<string, string>([[tool.slug, tool.name]]);
  try {
    const comparisonTools = await getToolsBySlugs(comparisonNameSlugs);
    comparisonNameBySlug = new Map(
      comparisonTools.map((entry) => [entry.slug, entry.name])
    );
    comparisonNameBySlug.set(tool.slug, tool.name);
  } catch {
    // Fall back to slug-based labels below
  }

  const formatComparisonLabel = (slugs: string[]) =>
    slugs
      .map(
        (entry) =>
          comparisonNameBySlug.get(entry) ??
          entry
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
      )
      .join(" vs ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.website_url,
    image: tool.logo_url,
    applicationCategory: "Artificial Intelligence",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      ...(tool.pricing_model === "free" || tool.pricing_model === "open_source"
        ? { price: "0", priceCurrency: "USD" }
        : {}),
      description: tool.pricing_details || `${tool.pricing_model} pricing`,
    },
    ...(tool.editor_rating && {
      review: {
        "@type": "Review",
        author: { "@type": "Organization", name: "AiCensus" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: tool.editor_rating,
          bestRating: 5,
        },
        reviewBody: `Editor rating: ${tool.editor_rating.toFixed(1)}/5 based on AiCensus editorial review.`,
      },
    }),
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      ...(tool.categories
        ? [{ "@type": "ListItem", position: 2, name: tool.categories.name, item: `${siteUrl}/categories/${tool.categories.slug}` }]
        : [{ "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` }]),
      { "@type": "ListItem", position: 3, name: tool.name },
    ],
  };

  const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);
  const outboundHref = tool.affiliate_url || tool.website_url;

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />

      <PageContainer variant="listing">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(tool.categories
              ? [{ label: tool.categories.name, href: `/categories/${tool.categories.slug}` }]
              : [{ label: "Tools", href: "/tools" }]),
            { label: tool.name },
          ]}
        />

        {/* Header */}
        <FadeIn>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* Logo */}
          <ToolLogo
            src={logoSrc}
            name={tool.name}
            className="h-14 w-14 rounded-xl border border-white/10 text-xl text-foreground sm:h-16 sm:w-16 sm:text-2xl"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
                {tool.name}
              </h1>
              {tool.is_verified && <VerifiedBadge size="sm" />}
            </div>
            <p className="mt-1.5 text-base text-muted-foreground sm:text-lg">
              {tool.tagline}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <RatingStars rating={tool.editor_rating} size="sm" />
              <PricingBadge pricing={tool.pricing_model} />
              {tool.categories && (
                <Link href={`/categories/${tool.categories.slug}`}>
                  <Badge variant="outline">{tool.categories.name}</Badge>
                </Link>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <ToolOutboundLink
                href={outboundHref}
                toolSlug={tool.slug}
                toolName={tool.name}
              >
                <Button>
                  Visit {tool.name} <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </ToolOutboundLink>
              <SaveToolButton slug={tool.slug} name={tool.name} />
              {popularComparisons[0] ? (
                <Link href={`/compare/${popularComparisons[0].slugs.join("/")}`}>
                  <Button variant="outline">Compare</Button>
                </Link>
              ) : (
                <Link href="/compare">
                  <Button variant="outline">Compare</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        </FadeIn>

        <Separator className="my-5 sm:my-6" />

        <ToolQuickFacts tool={tool} />

        {/* Content Grid */}
        <div className="mt-5 grid gap-6 lg:grid-cols-3 lg:gap-8 sm:mt-6">
          <StaggerChildren className="order-first space-y-4 lg:order-none lg:col-span-1 lg:space-y-6">
            <StaggerItem className="hidden lg:block">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2 text-base">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PricingBadge pricing={tool.pricing_model} />
                  {tool.pricing_details && (
                    <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">
                      {tool.pricing_details}
                    </p>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>

            {tool.who_its_for.length > 0 && (
              <StaggerItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2 text-base">
                      <Users className="h-4 w-4 text-primary" />
                      Who It&apos;s For
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tool.who_its_for.map((who, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {who}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            )}

            <StaggerItem>
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {tool.company_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company</span>
                      <span>{tool.company_name}</span>
                    </div>
                  )}
                  {tool.founded_year && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Founded</span>
                      <span>{tool.founded_year}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Website</span>
                    <a
                      href={tool.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerChildren>

          <div className="order-last space-y-6 lg:order-none lg:col-span-2 lg:space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold">About {tool.name}</h2>
              <div className="mt-4 prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {tool.description}
              </div>
            </section>

            {tool.key_features.length > 0 && (
              <section>
                <h2 className="font-display flex items-center gap-2 text-xl font-semibold">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Key Features
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {tool.key_features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 rounded-lg bg-card p-3 text-sm"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(tool.pros.length > 0 || tool.cons.length > 0) && (
              <section>
                <h2 className="font-display text-xl font-semibold">Pros & Cons</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {tool.pros.length > 0 && (
                    <Card className="border-white/15 bg-white/[0.03]">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          Pros
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {tool.pros.map((pro, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            + {pro}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  {tool.cons.length > 0 && (
                    <Card className="border-destructive/25 bg-destructive/[0.04]">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-destructive">
                          <ThumbsDown className="h-4 w-4" />
                          Cons
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {tool.cons.map((con, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            - {con}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>
            )}

            {tool.use_cases.length > 0 && (
              <section>
                <h2 className="font-display flex items-center gap-2 text-xl font-semibold">
                  <Target className="h-5 w-5 text-primary" />
                  Use Cases
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.use_cases.map((uc, i) => (
                    <Badge key={i} variant="secondary" className="text-sm">
                      {uc}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <ToolDiscoverySection
          toolName={tool.name}
          toolSlug={tool.slug}
          alternatives={alternatives}
          popularComparisons={popularComparisons}
          bestForPages={bestForPages}
          formatComparisonLabel={formatComparisonLabel}
        />

        {(adjacent.prev || adjacent.next) && (
          <FadeIn className={section.divider}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
              {tool.categories ? `More in ${tool.categories.name}` : "More tools"}
            </p>
            <div className="mt-4">
              <PrevNextNav
                prev={
                  adjacent.prev
                    ? {
                        href: `/tools/${adjacent.prev.slug}`,
                        label: adjacent.prev.name,
                      }
                    : null
                }
                next={
                  adjacent.next
                    ? {
                        href: `/tools/${adjacent.next.slug}`,
                        label: adjacent.next.name,
                      }
                    : null
                }
                prevLabel="Previous tool"
                nextLabel="Next tool"
              />
            </div>
          </FadeIn>
        )}
      </PageContainer>
    </>
  );
}
