"use client";

import { useSavedItems } from "@/lib/saved-items";
import { cn } from "@/lib/utils";

export function SavedCountBadge({ active = false }: { active?: boolean }) {
  const { hydrated, total } = useSavedItems();
  if (!hydrated || total === 0) return null;

  return (
    <span
      className={cn(
        "ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-[9px] leading-none",
        active ? "bg-black text-white" : "bg-white text-black"
      )}
    >
      {total > 99 ? "99+" : total}
    </span>
  );
}
