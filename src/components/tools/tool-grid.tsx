import { ToolCard } from "@/components/tools/tool-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ToolWithCategory } from "@/lib/types/database";

interface ToolGridProps {
  tools: ToolWithCategory[];
}

export function ToolGrid({ tools }: ToolGridProps) {
  if (tools.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
