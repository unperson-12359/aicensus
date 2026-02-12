import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToolGrid } from "@/components/tools/tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { getToolsByCategory } from "@/lib/queries/tools";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/queries/categories";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllCategorySlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} AI Tools — Best ${category.name} Apps & Agents`,
    description:
      category.meta_description ||
      `Discover the best ${category.name.toLowerCase()} AI tools. Curated and verified reviews with pricing, pros & cons.`,
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let category;
  let result: Awaited<ReturnType<typeof getToolsByCategory>> = { tools: [], count: 0 };

  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  if (!category) notFound();

  try {
    result = await getToolsByCategory(slug);
  } catch {
    // Supabase error
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} AI Tools`,
    description: category.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: result.tools.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: tool.name,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/tools/${tool.slug}`,
          image: tool.logo_url,
        },
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/categories"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All categories
        </Link>

        <SectionHeading
          title={`${category.name} Tools`}
          description={
            category.description ||
            `${result.count} AI tools in ${category.name}`
          }
        />

        <div className="mt-8">
          <ToolGrid tools={result.tools} />
        </div>
      </div>
    </>
  );
}
