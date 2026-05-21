import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedToolGrid } from "@/components/tools/animated-tool-grid";
import { section } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { ToolWithCategory } from "@/lib/types/database";
import type { ComparisonPair } from "@/lib/popular-comparisons";
import type { BestForPage } from "@/lib/best-for";

interface ToolDiscoverySectionProps {
  toolName: string;
  toolSlug: string;
  alternatives: ToolWithCategory[] | null;
  popularComparisons: ComparisonPair[];
  bestForPages: Pick<BestForPage, "slug" | "title" | "tagline">[];
  formatComparisonLabel: (slugs: string[]) => string;
}

export function ToolDiscoverySection({
  toolName,
  toolSlug,
  alternatives,
  popularComparisons,
  bestForPages,
  formatComparisonLabel,
}: ToolDiscoverySectionProps) {
  const hasAlternatives = alternatives && alternatives.length > 0;
  const hasComparisons = popularComparisons.length > 0;
  const hasBestFor = bestForPages.length > 0;

  if (!hasAlternatives && !hasComparisons && !hasBestFor) return null;

  return (
    <section className={cn(section.divider)}>
      {hasAlternatives && (
        <div>
          <SectionHeading
            title={`Alternatives to ${toolName}`}
            description="Similar tools you might want to consider"
          />
          <div className="mt-6">
            <AnimatedToolGrid tools={alternatives!} />
          </div>
          <div className="mt-4">
            <Link
              href={`/tools/${toolSlug}/alternatives`}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all alternatives →
            </Link>
          </div>
        </div>
      )}

      {hasComparisons && (
        <div className={hasAlternatives ? "mt-10" : ""}>
          <SectionHeading
            title={`Compare ${toolName}`}
            description="Popular head-to-head comparisons"
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {popularComparisons.map((pair) => (
              <Link
                key={pair.slugs.join("-")}
                href={`/compare/${pair.slugs.join("/")}`}
                className="bento-tile group flex items-center justify-between p-4 transition-colors hover:border-white/30"
              >
                <span className="font-serif text-base text-white/85">
                  {formatComparisonLabel(pair.slugs)}
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-white/40 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasBestFor && (
        <div className={hasAlternatives || hasComparisons ? "mt-10" : ""}>
          <SectionHeading
            title="Featured in best-of guides"
            description="Editorial lists that include this tool"
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {bestForPages.map((page) => (
              <Link
                key={page.slug}
                href={`/best/${page.slug}`}
                className="bento-tile group p-4 transition-colors hover:border-white/30 sm:p-5"
              >
                <p className="font-serif text-lg italic text-white/85">{page.title}</p>
                <p className="mt-2 text-sm text-white/65">{page.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
