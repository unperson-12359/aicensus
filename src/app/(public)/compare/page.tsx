import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { getTools } from "@/lib/queries/tools";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compare AI Tools Side by Side | AiCensus",
  description: "Compare AI tools head-to-head. See pricing, features, pros & cons, and ratings side by side.",
};

export default async function CompareIndexPage() {
  let topTools: { tools: { name: string; slug: string }[] } = { tools: [] };
  try {
    topTools = await getTools({ sort: "rating", limit: 12 });
  } catch {
    // DB not configured
  }

  const tools = topTools.tools;
  const pairs: { a: { name: string; slug: string }; b: { name: string; slug: string } }[] = [];
  for (let i = 0; i < Math.min(tools.length, 6); i++) {
    for (let j = i + 1; j < Math.min(tools.length, 6); j++) {
      if (pairs.length >= 12) break;
      pairs.push({ a: tools[i], b: tools[j] });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <h1 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          Compare AI Tools
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Pick any two tools to see a detailed side-by-side comparison of pricing, features, pros & cons, and more.
        </p>
      </FadeIn>

      {pairs.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Popular Comparisons</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {pairs.map((pair) => (
                <Link
                  key={`${pair.a.slug}-${pair.b.slug}`}
                  href={`/compare/${pair.a.slug}/${pair.b.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border/40 bg-card p-3 text-sm transition-colors duration-150 hover:border-border"
                >
                  <span className="font-medium">{pair.a.name} vs {pair.b.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
