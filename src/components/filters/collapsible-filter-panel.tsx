"use client";

import * as React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Button label when collapsed. */
  label: string;
  /** Optional count badge (e.g. # of active filters). Hidden when 0. */
  activeCount?: number;
  /** Initial open state. */
  defaultOpen?: boolean;
  /** Filter rows go here. */
  children: React.ReactNode;
};

/**
 * A lightweight disclosure wrapper for filter panels. The whole filter
 * area collapses to a single "Filters" button so the page stays clean
 * when there's no active filtering, and expands on demand with a smooth
 * grid-rows height animation.
 */
export function CollapsibleFilterPanel({
  label,
  activeCount = 0,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-transparent px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
      >
        <SlidersHorizontal className="h-3 w-3" />
        <span>{label}</span>
        {activeCount > 0 && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 font-mono text-[9px] tracking-normal text-black">
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,margin-top] duration-200 ease-out",
          open ? "mt-4 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
