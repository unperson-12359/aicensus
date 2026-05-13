"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isComparisonSaved, useSavedItems } from "@/lib/saved-items";

interface SaveComparisonButtonProps {
  slugs: string[];
  names: string[];
}

export function SaveComparisonButton({ slugs, names }: SaveComparisonButtonProps) {
  const { hydrated, state, toggleComparison } = useSavedItems();
  const saved = hydrated && isComparisonSaved(state, slugs);
  const label = names.join(" vs ");
  const Icon = saved ? BookmarkCheck : Bookmark;
  const actionLabel = saved ? `Unsave ${label} comparison` : `Save ${label} comparison`;

  return (
    <Button
      type="button"
      variant={saved ? "secondary" : "outline"}
      size="sm"
      onClick={() => toggleComparison(slugs, label)}
      aria-label={actionLabel}
      aria-pressed={saved}
    >
      <Icon className="h-3.5 w-3.5" />
      {saved ? "Saved comparison" : "Save comparison"}
    </Button>
  );
}
