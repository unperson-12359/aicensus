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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
