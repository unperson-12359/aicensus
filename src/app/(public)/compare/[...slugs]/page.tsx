import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { JsonLd } from "@/components/shared/json-ld";
import { FadeIn } from "@/components/motion";
import { getToolBySlug } from "@/lib/queries/tools";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slugs: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  if (!slugs || slugs.length < 2 || slugs.length > 4) {
    return { title: "Compare AI Tools | AiCensus" };
  }

  const tools = await Promise.all(slugs.map((s) => getToolBySlug(s)));
  const names = tools.filter(Boolean).map((t) => t!.name);
  const title = `${names.join(" vs ")} — Compare AI Tools | AiCensus`;
  const description = `Side-by-side comparison of ${names.join(", ")}. Compare pricing, features, pros & cons, and more.`;

  return { title, description, openGraph: { title, description }, twitter: { card: "summary_large_image", title, description } };
}

export default async function ComparePage({ params }: Props) {
  const { slugs } = await params;
  if (!slugs || slugs.length < 2 || slugs.length > 4) notFound();

  const toolResults = await Promise.all(slugs.map((s) => getToolBySlug(s)));
  const tools = toolResults.filter((t): t is ToolWithCategory => t !== null);
  if (tools.length < 2) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";
  const names = tools.map((t) => t.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${names.join(" vs ")} Comparison`,
    url: `${siteUrl}/compare/${slugs.join("/")}`,
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "SoftwareApplication", name: t.name, url: `${siteUrl}/tools/${t.slug}` },
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
            <span className="text-foreground">Compare</span>
          </nav>
        </FadeIn>

        <FadeIn>
          <h1 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            {names.join(" vs ")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Side-by-side comparison of {names.length} AI tools — pricing, features, pros & cons.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-8">
            <ComparisonTable tools={tools} />
          </div>
        </FadeIn>
      </div>
    </>
  );
}
