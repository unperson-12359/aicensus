"use client";

import * as React from "react";
import { ChevronDown, Tag as TagIcon, Check } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type TagItem = {
  value: string;
  label?: string;
  count?: number;
};

type Variant = "default" | "mono";

type Props = {
  /** Used for dialog title + aria labels. Not rendered as a section header. */
  label: string;
  tags: TagItem[];
  selected: string[];
  onToggle: (value: string) => void;
  onClearAll?: () => void;
  /** If provided, renders a leading "All" chip that calls onClearAll. */
  allLabel?: string;
  /** Max chips shown inline before the "+N more" button. */
  inlineLimit?: number;
  /** If true, dialog closes after a select (single-select UX). */
  singleSelect?: boolean;
  searchPlaceholder?: string;
  variant?: Variant;
  iconPerChip?: boolean;
};

const CHIP_BASE: Record<Variant, string> = {
  default:
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap",
  mono:
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors whitespace-nowrap",
};

const CHIP_ACTIVE = "border-white bg-white text-black";
const CHIP_INACTIVE =
  "border-white/15 text-white/60 hover:border-white/40 hover:text-white";

export function ScalableTagFilter({
  label,
  tags,
  selected,
  onToggle,
  onClearAll,
  allLabel,
  inlineLimit = 8,
  singleSelect = false,
  searchPlaceholder,
  variant = "default",
  iconPerChip = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  // Pin selected tags to the front so they're always visible inline.
  const inlineTags = React.useMemo(() => {
    const sel = tags.filter((t) => selectedSet.has(t.value));
    const unsel = tags.filter((t) => !selectedSet.has(t.value));
    return [...sel, ...unsel].slice(0, inlineLimit);
  }, [tags, selectedSet, inlineLimit]);

  const overflowCount = Math.max(0, tags.length - inlineTags.length);
  const hiddenSelectedCount = selected.filter(
    (s) => !inlineTags.some((t) => t.value === s)
  ).length;

  function handleSelect(value: string) {
    onToggle(value);
    if (singleSelect) setOpen(false);
  }

  const chipBase = CHIP_BASE[variant];
  const iconSize = variant === "mono" ? "h-2.5 w-2.5" : "h-3 w-3";

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {allLabel && (
          <button
            type="button"
            onClick={onClearAll}
            className={cn(
              chipBase,
              selected.length === 0 ? CHIP_ACTIVE : CHIP_INACTIVE
            )}
            aria-pressed={selected.length === 0}
          >
            {allLabel}
          </button>
        )}

        {inlineTags.map((tag) => {
          const isActive = selectedSet.has(tag.value);
          return (
            <button
              key={tag.value}
              type="button"
              onClick={() => handleSelect(tag.value)}
              className={cn(chipBase, isActive ? CHIP_ACTIVE : CHIP_INACTIVE)}
              aria-pressed={isActive}
            >
              {iconPerChip && (
                <TagIcon className={cn(iconSize, "opacity-60")} />
              )}
              <span>{tag.label ?? tag.value}</span>
            </button>
          );
        })}

        {overflowCount > 0 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(chipBase, CHIP_INACTIVE)}
            aria-label={`Browse all ${tags.length} ${label.toLowerCase()}`}
          >
            <span>
              +{overflowCount} more
              {hiddenSelectedCount > 0 && ` · ${hiddenSelectedCount} picked`}
            </span>
            <ChevronDown className={iconSize} />
          </button>
        )}
      </div>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={`Browse ${label.toLowerCase()}`}
        description={`Search and filter by ${label.toLowerCase()}.`}
      >
        <CommandInput
          placeholder={searchPlaceholder ?? `Search ${label.toLowerCase()}...`}
        />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>No matches.</CommandEmpty>
          <CommandGroup heading={`${tags.length} ${label.toLowerCase()}`}>
            {tags.map((tag) => {
              const isActive = selectedSet.has(tag.value);
              return (
                <CommandItem
                  key={tag.value}
                  value={tag.label ?? tag.value}
                  onSelect={() => handleSelect(tag.value)}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      isActive
                        ? "border-white bg-white text-black"
                        : "border-white/25"
                    )}
                  >
                    {isActive && <Check className="h-3 w-3" />}
                  </div>
                  <span className="flex-1">{tag.label ?? tag.value}</span>
                  {typeof tag.count === "number" && (
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                      {tag.count}
                    </span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
          {onClearAll && selected.length > 0 && (
            <div className="border-t border-white/10 p-2">
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  if (singleSelect) setOpen(false);
                }}
                className="w-full rounded-sm px-2 py-2 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                Clear {selected.length} selected
              </button>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
