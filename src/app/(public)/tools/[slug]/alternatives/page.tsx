import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedToolGrid } from "@/components/tools/animated-tool-grid";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Pagination } from "@/components/shared/pagination";
import { PaginationInfo } from "@/components/shared/pagination-info";
import { FadeIn } from "@/components/motion";
import {
  getToolBySlug,
  getToolAlternativesBidirectional,
} from "@/lib/queries/tools";

export const revalidate = 3600;

const ALTERNATIVES_PER_PAGE = 6;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: "Not Found" };

  const title = `Best Alternatives to ${tool.name} (2026) | AiCensus`;
  const description = `Compare the best alternatives to ${tool.name}. Find similar AI tools with honest reviews, pricing, and pros & cons.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";

  return {
    title,
    description,
    openGraph: { title, description, url: `/tools/${slug}/alternatives` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${siteUrl}/tools/${slug}/alternatives` },
  };
}

export default async function AlternativesPage({
  params,
  searchParams,
}: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  let alternatives: Awaited<ReturnType<typeof getToolAlternativesBidirectional>> = [];
  try {
    alternatives = await getToolAlternativesBidirectional(tool.id);
  } catch {
    alternatives = [];
  }

  const currentPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const total = alternatives.length;
  const totalPages = Math.max(1, Math.ceil(total / ALTERNATIVES_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);
  const offset = (clampedPage - 1) * ALTERNATIVES_PER_PAGE;
  const paged = alternatives.slice(offset, offset + ALTERNATIVES_PER_PAGE);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";
  const jsonLd = {
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

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
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

        <FadeIn>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Alternatives to {tool.name}
            </h1>
            {tool.tagline && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {tool.name}: {tool.tagline}. Here are the best similar tools.
              </p>
            )}
            <div className="mt-4">
              <Link href={`/tools/${slug}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back to {tool.name}
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {total > 0 ? (
          <>
            <FadeIn delay={0.2}>
              <div id="results" className="scroll-mt-24">
                <AnimatedToolGrid tools={paged} />
              </div>
            </FadeIn>

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
          </>
        ) : (
          <FadeIn delay={0.2}>
            <div className="py-16 text-center">
              <p className="text-lg font-medium">No alternatives found yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We haven&apos;t added alternatives for {tool.name} yet. Check back soon.
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </>
  );
}
