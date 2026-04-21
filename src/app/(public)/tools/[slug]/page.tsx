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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { AnimatedToolGrid } from "@/components/tools/animated-tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { FadeIn, StaggerChildren, StaggerItem, PageTransition } from "@/components/motion";
import { GeometricDecor, pageHeaderShapes } from "@/components/shared/geometric-decor";
import { getLogoUrl } from "@/lib/utils";
import {
  getToolBySlug,
  getToolAlternatives,
  getAllToolSlugs,
} from "@/lib/queries/tools";

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

  try {
    tool = await getToolBySlug(slug);
  } catch {
    notFound();
  }

  if (!tool) notFound();

  try {
    alternatives = await getToolAlternatives(tool.id);
  } catch {
    alternatives = [];
  }

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
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tool.editor_rating,
        bestRating: 5,
        worstRating: 0,
        ratingCount: 1,
      },
      review: {
        "@type": "Review",
        author: { "@type": "Organization", name: "AiCensus" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: tool.editor_rating,
          bestRating: 5,
        },
      },
    }),
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
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

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />

      <PageTransition>
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <GeometricDecor shapes={pageHeaderShapes} />
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Logo */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-muted text-3xl font-bold text-primary">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={tool.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              tool.name.charAt(0)
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-bold tracking-display sm:text-5xl">{tool.name}</h1>
              {tool.is_verified && <VerifiedBadge size="md" />}
            </div>
            <p className="mt-2 text-lg text-muted-foreground">{tool.tagline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <RatingStars rating={tool.editor_rating} size="md" />
              <PricingBadge pricing={tool.pricing_model} />
              {tool.categories && (
                <Link href={`/categories/${tool.categories.slug}`}>
                  <Badge variant="outline">{tool.categories.name}</Badge>
                </Link>
              )}
            </div>

            <div className="mt-6">
              <a
                href={tool.affiliate_url || tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg">
                  Visit {tool.name} <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/compare">
                <Button variant="outline" size="lg">Compare</Button>
              </Link>
            </div>
          </div>
        </div>
        </FadeIn>

        <Separator className="my-10" />

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            <section>
              <h2 className="font-display text-xl font-semibold">About {tool.name}</h2>
              <div className="mt-4 prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {tool.description}
              </div>
            </section>

            {/* Key Features */}
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

            {/* Pros & Cons */}
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

            {/* Use Cases */}
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

          {/* Sidebar */}
          <StaggerChildren className="space-y-6">
            {/* Pricing Card */}
            <StaggerItem>
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

            {/* Who It's For */}
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

            {/* Tool Info */}
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
        </div>

        {/* Alternatives */}
        {alternatives && alternatives.length > 0 && (
          <FadeIn className="mt-16">
            <SectionHeading
              title={`Alternatives to ${tool.name}`}
              description="Similar tools you might want to consider"
            />
            <div className="mt-8">
              <AnimatedToolGrid tools={alternatives} />
            </div>
            <div className="mt-4">
              <Link href={`/tools/${tool.slug}/alternatives`} className="text-sm font-medium text-primary hover:underline">
                View all alternatives →
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
      </PageTransition>
    </>
  );
}
