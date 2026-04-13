import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedToolGrid } from "@/components/tools/animated-tool-grid";
import { JsonLd } from "@/components/shared/json-ld";
import { FadeIn } from "@/components/motion";
import { getToolBySlug, getToolAlternativesBidirectional, getAllToolSlugs } from "@/lib/queries/tools";

export const revalidate = 3600;

interface Props {
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

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  let alternatives: Awaited<ReturnType<typeof getToolAlternativesBidirectional>> = [];
  try {
    alternatives = await getToolAlternativesBidirectional(tool.id);
  } catch {
    alternatives = [];
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Alternatives to ${tool.name}`,
    description: `AI tools similar to ${tool.name}`,
    url: `${siteUrl}/tools/${slug}/alternatives`,
    numberOfItems: alternatives.length,
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

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <span>/</span>
            <Link href={`/tools/${slug}`} className="hover:text-foreground transition-colors">{tool.name}</Link>
            <span>/</span>
            <span className="text-foreground">Alternatives</span>
          </nav>
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

        {alternatives.length > 0 ? (
          <FadeIn delay={0.2}>
            <AnimatedToolGrid tools={alternatives} />
          </FadeIn>
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
