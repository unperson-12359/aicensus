"use client";

import { ToolCard } from "@/components/tools/tool-card";
import { ToolCardFeatured } from "@/components/tools/tool-card-featured";
import { EmptyState } from "@/components/shared/empty-state";
import { StaggerChildren, StaggerItem } from "@/components/motion";
import type { ToolWithCategory } from "@/lib/types/database";

interface BentoToolGridProps {
  tools: ToolWithCategory[];
  featuredCount?: number;
}

export function BentoToolGrid({ tools, featuredCount = 2 }: BentoToolGridProps) {
  if (tools.length === 0) {
    return <EmptyState />;
  }

  const actualFeatured = Math.min(featuredCount, tools.length);
  const featured = tools.slice(0, actualFeatured);
  const standard = tools.slice(actualFeatured);

  return (
    <StaggerChildren className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {featured.map((tool) => (
        <StaggerItem key={tool.id} className="col-span-2">
          <ToolCardFeatured tool={tool} />
        </StaggerItem>
      ))}
      {standard.map((tool) => (
        <StaggerItem key={tool.id}>
          <ToolCard tool={tool} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
