"use client";

import { CollapsibleFilterPanel } from "@/components/filters/collapsible-filter-panel";
import { FilterBarSelects } from "@/components/filters/filter-bar-selects";
import type { Category } from "@/lib/types/database";

interface ToolsFilterPanelProps {
  categories: Category[];
  hasActiveFilters: boolean;
  activeCount: number;
}

export function ToolsFilterPanel({
  categories,
  hasActiveFilters,
  activeCount,
}: ToolsFilterPanelProps) {
  return (
    <CollapsibleFilterPanel
      label="Filter tools"
      activeCount={activeCount}
      defaultOpen={hasActiveFilters}
    >
      <FilterBarSelects categories={categories} />
    </CollapsibleFilterPanel>
  );
}
