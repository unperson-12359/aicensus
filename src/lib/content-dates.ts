import type { ToolWithCategory } from "@/lib/types/database";

/**
 * Format a "last updated" label from the newest updated_at among tools.
 */
export function formatContentLastUpdated(
  tools: Pick<ToolWithCategory, "updated_at">[]
): string {
  if (tools.length === 0) {
    return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  const latest = tools.reduce((max, tool) => {
    const time = new Date(tool.updated_at).getTime();
    return Number.isNaN(time) ? max : Math.max(max, time);
  }, 0);

  const date = latest > 0 ? new Date(latest) : new Date();
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function maxUpdatedAt(
  tools: Pick<ToolWithCategory, "updated_at">[]
): Date {
  if (tools.length === 0) return new Date();

  const latest = tools.reduce((max, tool) => {
    const time = new Date(tool.updated_at).getTime();
    return Number.isNaN(time) ? max : Math.max(max, time);
  }, 0);

  return latest > 0 ? new Date(latest) : new Date();
}
