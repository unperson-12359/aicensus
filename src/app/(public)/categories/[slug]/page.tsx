import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolGrid } from "@/components/tools/tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Pagination } from "@/components/shared/pagination";
import { PaginationInfo } from "@/components/shared/pagination-info";
import { PageTransition } from "@/components/motion";
import { GeometricDecor, pageHeaderShapes } from "@/components/shared/geometric-decor";
import { getToolsByCategory } from "@/lib/queries/tools";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

const TOOLS_PER_PAGE = 12;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
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

  const description =
    category.meta_description ||
    `Discover the best ${category.name.toLowerCase()} AI tools. Curated and verified reviews with pricing, pros & cons.`;

  return {
    title: `${category.name} AI Tools — Best ${category.name} Apps & Agents`,
    description,
    openGraph: {
      title: `${category.name} AI Tools — Best ${category.name} Apps & Agents`,
      description,
      url: `/categories/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} AI Tools | AiCensus`,
      description,
    },
    alternates: {
      canonical: `/categories/${slug}`,
    },
  };
}

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const currentPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const offset = (currentPage - 1) * TOOLS_PER_PAGE;

  let category;
  let result: Awaited<ReturnType<typeof getToolsByCategory>> = { tools: [], count: 0 };

  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  if (!category) notFound();

  try {
    result = await getToolsByCategory(slug, {
      limit: TOOLS_PER_PAGE,
      offset,
    });
  } catch {
    // Supabase error
  }

  const totalPages = Math.ceil(result.count / TOOLS_PER_PAGE);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} AI Tools`,
    description: category.description,
    url: `${siteUrl}/categories/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: result.count,
      itemListElement: result.tools.map((tool, i) => ({
        "@type": "ListItem",
        position: offset + i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: tool.name,
          url: `${siteUrl}/tools/${tool.slug}`,
          image: tool.logo_url,
        },
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${siteUrl}/categories` },
      { "@type": "ListItem", position: 3, name: category.name },
    ],
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <PageTransition>
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GeometricDecor shapes={pageHeaderShapes} />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />

        <SectionHeading
          title={`${category.name} Tools`}
          description={
            category.description ||
            `${result.count} AI tools in ${category.name}`
          }
        />

        <div id="results" className="mt-8 scroll-mt-24">
          <ToolGrid tools={result.tools} />
        </div>

        {result.count > 0 && totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
            <PaginationInfo
              currentPage={currentPage}
              perPage={TOOLS_PER_PAGE}
              total={result.count}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/categories/${slug}`}
              anchor="results"
            />
          </div>
        )}
        {result.count > 0 && totalPages <= 1 && (
          <div className="mt-8 flex justify-center">
            <PaginationInfo
              currentPage={currentPage}
              perPage={TOOLS_PER_PAGE}
              total={result.count}
            />
          </div>
        )}
      </div>
      </PageTransition>
    </>
  );
}
