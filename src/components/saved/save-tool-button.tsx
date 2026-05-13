"use client";

import type { MouseEvent } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isToolSaved, useSavedItems } from "@/lib/saved-items";

interface SaveToolButtonProps {
  slug: string;
  name: string;
  mode?: "button" | "icon";
  className?: string;
}

export function SaveToolButton({
  slug,
  name,
  mode = "button",
  className,
}: SaveToolButtonProps) {
  const { hydrated, state, toggleTool } = useSavedItems();
  const saved = hydrated && isToolSaved(state, slug);
  const label = saved ? `Unsave ${name}` : `Save ${name}`;
  const Icon = saved ? BookmarkCheck : Bookmark;

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleTool(slug);
  }

  if (mode === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/65 shadow-sm backdrop-blur transition-colors hover:border-white/40 hover:text-white",
          saved && "border-white/35 bg-white text-black hover:text-black",
          className
        )}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={saved ? "secondary" : "outline"}
      size="default"
      onClick={onClick}
      aria-label={label}
      aria-pressed={saved}
      className={className}
    >
      <Icon className="h-4 w-4" />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
