import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { CategoryCard } from "@/components/categories/category-card";
import { getCategoriesWithToolCount, type CategoryWithCount } from "@/lib/queries/categories";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "AI Tool Categories — Browse by Use Case",
  description:
    "Browse AI tools by category. Find the best AI tools for writing, coding, image generation, data analysis, and more.",
};

export default async function CategoriesPage() {
  let categories: CategoryWithCount[] = [];

  try {
    categories = await getCategoriesWithToolCount();
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        title="Categories"
        description="Browse AI tools by category and find the perfect tool for your needs"
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {categories.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">
          Categories will appear here once the database is configured.
        </p>
      )}
    </div>
  );
}
