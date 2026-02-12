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
import { ToolGrid } from "@/components/tools/tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getToolBySlug,
  getToolAlternatives,
  getAllToolSlugs,
} from "@/lib/queries/tools";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllToolSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  return {
    title: `${tool.name} — AI Tool Review & Pricing`,
    description: `${tool.tagline}. Read our review of ${tool.name}: pricing, pros & cons, use cases, and alternatives.`,
    openGraph: {
      title: `${tool.name} — Review & Pricing | AiCensus`,
      description: tool.tagline,
      url: `/tools/${tool.slug}`,
      images: tool.screenshot_url
        ? [{ url: tool.screenshot_url }]
        : [{ url: "/og-default.png" }],
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
      price: tool.pricing_model === "free" ? "0" : undefined,
      priceCurrency: "USD",
      description: tool.pricing_details,
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

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Logo */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-muted text-3xl font-bold text-primary">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              tool.name.charAt(0)
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
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
                <Button size="lg" className="glow-sm">
                  Visit {tool.name} <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold">About {tool.name}</h2>
              <div className="mt-4 prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {tool.description}
              </div>
            </section>

            {/* Key Features */}
            {tool.key_features.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
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
                <h2 className="text-xl font-semibold">Pros & Cons</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {tool.pros.length > 0 && (
                    <Card className="border-green-500/20 bg-green-500/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-green-400">
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
                    <Card className="border-red-500/20 bg-red-500/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-red-400">
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
                <h2 className="flex items-center gap-2 text-xl font-semibold">
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
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
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

            {/* Who It's For */}
            {tool.who_its_for.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
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
            )}

            {/* Tool Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
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
          </div>
        </div>

        {/* Alternatives */}
        {alternatives && alternatives.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              title={`Alternatives to ${tool.name}`}
              description="Similar tools you might want to consider"
            />
            <div className="mt-8">
              <ToolGrid tools={alternatives} />
            </div>
          </section>
        )}
      </div>
    </>
  );
}
