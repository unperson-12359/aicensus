import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolGrid } from "@/components/tools/tool-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Pagination } from "@/components/shared/pagination";
import { PaginationInfo } from "@/components/shared/pagination-info";
import { PageTransition } from "@/components/motion";
import { getToolsByCategory } from "@/lib/queries/tools";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/queries/categories";

export const revalidate = 1800;

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

  return {
    title: `${category.name} AI Tools — Best ${category.name} Apps & Agents`,
    description:
      category.meta_description ||
      `Discover the best ${category.name.toLowerCase()} AI tools. Curated and verified reviews with pricing, pros & cons.`,
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
    <PageTransition>
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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

        <div className="mt-8">
          <ToolGrid tools={result.tools} />
        </div>

        {result.count > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <PaginationInfo
              currentPage={currentPage}
              perPage={TOOLS_PER_PAGE}
              total={result.count}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/categories/${slug}`}
            />
          </div>
        )}
      </div>
    </PageTransition>
  );
}
