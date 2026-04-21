"use client";

import { useRouter } from "next/navigation";
import {
  ScalableTagFilter,
  type TagItem,
} from "@/components/filters/scalable-tag-filter";
import { CollapsibleFilterPanel } from "@/components/filters/collapsible-filter-panel";

type Props = {
  tags: TagItem[];
  activeTag?: string;
};

export function BlogTagFilter({ tags, activeTag }: Props) {
  const router = useRouter();
  const selected = activeTag ? [activeTag] : [];

  function handleToggle(value: string) {
    if (value === activeTag) {
      router.push("/blog");
    } else {
      router.push(`/blog?tag=${encodeURIComponent(value)}`);
    }
  }

  function handleClearAll() {
    router.push("/blog");
  }

  return (
    <CollapsibleFilterPanel
      label={activeTag ? `Topic: ${activeTag}` : "Filter by topic"}
      activeCount={selected.length}
      defaultOpen={!!activeTag}
    >
      <ScalableTagFilter
        label="Topics"
        tags={tags}
        selected={selected}
        onToggle={handleToggle}
        onClearAll={handleClearAll}
        allLabel="All"
        inlineLimit={8}
        singleSelect
        iconPerChip
        searchPlaceholder="Search topics..."
      />
    </CollapsibleFilterPanel>
  );
}
