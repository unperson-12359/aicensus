"use client";

import { ToolCard } from "@/components/tools/tool-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StaggerChildren, StaggerItem } from "@/components/motion";
import type { ToolWithCategory } from "@/lib/types/database";

interface AnimatedToolGridProps {
  tools: ToolWithCategory[];
}

export function AnimatedToolGrid({ tools }: AnimatedToolGridProps) {
  if (tools.length === 0) {
    return <EmptyState />;
  }

  return (
    <StaggerChildren className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {tools.map((tool) => (
        <StaggerItem key={tool.id}>
          <ToolCard tool={tool} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
