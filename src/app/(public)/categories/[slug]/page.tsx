import type { Metadata } from "next";
import Link from "next/link";
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
import { getCategoryIntro } from "@/lib/category-intros";
import { BEST_FOR_PAGES } from "@/lib/best-for";
import { getPostBySlug } from "@/lib/blog";

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

  // Editorial intro / FAQ / cross-links (page 1 only — paginated variants are
  // noindex and shouldn't duplicate the copy). Falls back gracefully for
  // slugs missing from the map.
  const isFirstPage = clampedPage === 1;
  const categoryIntro = isFirstPage ? getCategoryIntro(slug) : undefined;
  const introParagraphs = categoryIntro?.intro.split(/\n\n+/) ?? [];
  const bestPage = categoryIntro?.bestSlug
    ? BEST_FOR_PAGES.find((p) => p.slug === categoryIntro.bestSlug)
    : undefined;
  const blogPosts = (categoryIntro?.blogSlugs ?? [])
    .map((s) => getPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const faqJsonLd =
    categoryIntro?.faqs && categoryIntro.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: categoryIntro.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

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

        {categoryIntro && (
          <section className="mt-8 max-w-3xl">
            <div className="space-y-4">
              {introParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {(bestPage || blogPosts.length > 0) && (
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border border-white/10 bg-white/[0.02] px-4 py-3 text-sm">
                {bestPage && (
                  <Link
                    href={`/best/${bestPage.slug}`}
                    className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    {bestPage.title}
                  </Link>
                )}
                {blogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

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

        {categoryIntro?.faqs && categoryIntro.faqs.length > 0 && (
          <section className="mt-14 sm:mt-16">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                § Common questions
              </p>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-2">
              {categoryIntro.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
                >
                  <h3 className="font-display text-base font-semibold sm:text-lg">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      </PageTransition>
    </>
  );
}
