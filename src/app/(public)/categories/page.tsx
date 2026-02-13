import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { CategoryCard } from "@/components/categories/category-card";
import { JsonLd } from "@/components/shared/json-ld";
import { PageTransition, StaggerChildren, StaggerItem } from "@/components/motion";
import { GeometricDecor, pageHeaderShapes } from "@/components/shared/geometric-decor";
import { getCategoriesWithToolCount, type CategoryWithCount } from "@/lib/queries/categories";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "AI Tool Categories — Browse by Use Case",
  description:
    "Browse AI tools by category. Find the best AI tools for writing, coding, image generation, data analysis, and more.",
  openGraph: {
    title: "AI Tool Categories — Browse by Use Case",
    description:
      "Browse AI tools by category. Find the best AI tools for writing, coding, image generation, data analysis, and more.",
    url: "/categories",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Categories — Browse by Use Case",
    description:
      "Browse AI tools by category. Find the best tools for writing, coding, image generation, and more.",
  },
  alternates: {
    canonical: "/categories",
  },
};

export default async function CategoriesPage() {
  let categories: CategoryWithCount[] = [];

  try {
    categories = await getCategoriesWithToolCount();
  } catch {
    // Supabase not configured yet
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Tool Categories",
    description: "Browse AI tools by category and find the perfect tool for your needs.",
    url: `${siteUrl}/categories`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categories.length,
      itemListElement: categories.map((cat, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Thing",
          name: cat.name,
          url: `${siteUrl}/categories/${cat.slug}`,
        },
      })),
    },
  };

  return (
    <>
    <JsonLd data={collectionJsonLd} />
    <PageTransition>
    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <GeometricDecor shapes={pageHeaderShapes} />
      <SectionHeading
        title="Categories"
        description="Browse AI tools by category and find the perfect tool for your needs"
        accent
      />

      <StaggerChildren className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {categories.map((category, index) => (
          <StaggerItem
            key={category.id}
            className={
              index === 0
                ? "col-span-2"
                : index === 1
                  ? "xl:col-span-2"
                  : undefined
            }
          >
            <CategoryCard category={category} />
          </StaggerItem>
        ))}
      </StaggerChildren>

      {categories.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">
          Categories will appear here once the database is configured.
        </p>
      )}
    </div>
    </PageTransition>
    </>
  );
}
