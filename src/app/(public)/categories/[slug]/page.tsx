import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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

export const revalidate = 3600;

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

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const description =
    category.meta_description ||
    `Discover the best ${category.name.toLowerCase()} AI tools. Curated and verified reviews with pricing, pros & cons.`;

  const title = `${category.name} AI Tools — Best ${category.name} Apps & Agents`;

  // Paginated URLs (?page=N, N>1) are self-canonical and noindex,follow —
  // one unified param policy instead of canonicalizing everything to page 1.
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const isPaginated = page > 1;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/categories/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} AI Tools`,
      description,
    },
    alternates: {
      canonical: isPaginated
        ? `/categories/${slug}?page=${page}`
        : `/categories/${slug}`,
    },
    ...(isPaginated ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const currentPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const offset = (currentPage - 1) * TOOLS_PER_PAGE;

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  if (!category) notFound();

  // DB failures throw to the error boundary (500) instead of rendering a
  // silent empty 200 that reads as a soft 404.
  const result = await getToolsByCategory(slug, {
    limit: TOOLS_PER_PAGE,
    offset,
  });

  // A real category with zero tools is a thin page — treat it as not found.
  if (result.count === 0) notFound();

  const totalPages = Math.max(1, Math.ceil(result.count / TOOLS_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);

  if (currentPage !== clampedPage) {
    const target =
      clampedPage > 1
        ? `/categories/${slug}?page=${clampedPage}`
        : `/categories/${slug}`;
    redirect(target);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

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
          as="h1"
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
              currentPage={clampedPage}
              perPage={TOOLS_PER_PAGE}
              total={result.count}
            />
            <Pagination
              currentPage={clampedPage}
              totalPages={totalPages}
              basePath={`/categories/${slug}`}
              anchor="results"
            />
          </div>
        )}
        {result.count > 0 && totalPages <= 1 && (
          <div className="mt-8 flex justify-center">
            <PaginationInfo
              currentPage={clampedPage}
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
