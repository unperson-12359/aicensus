"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Stack,
  type StackConstraint,
  ALL_CONSTRAINTS,
  CONSTRAINT_LABELS,
} from "@/lib/stacks";
import { ScalableTagFilter } from "@/components/filters/scalable-tag-filter";
import { CollapsibleFilterPanel } from "@/components/filters/collapsible-filter-panel";
import { ToolLogo } from "@/components/shared/tool-logo";

interface StackLogoMap {
  [slug: string]: {
    name: string;
    logoSrc: string | null;
  };
}

interface StacksBrowserProps {
  stacks: Stack[];
  logos: StackLogoMap;
}

// Build use-case tag items sorted by frequency across stacks.
function buildUseCaseItems(stacks: Stack[]) {
  const counts: Record<string, number> = {};
  for (const s of stacks) {
    for (const u of s.useCases) counts[u] = (counts[u] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([value, count]) => ({
      value,
      label: humanUseCase(value),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

// Human-friendly labels for use-case chips
const USE_CASE_LABELS: Record<string, string> = {
  saas: "SaaS",
  "web-app": "Web app",
  "landing-page": "Landing page",
  marketing: "Marketing",
  "ai-agents": "AI agents",
  automation: "Automation",
  writing: "Writing",
  book: "Book",
  coding: "Coding",
  music: "Music",
  creative: "Creative",
  video: "Video",
  content: "Content",
  design: "Design",
  branding: "Branding",
  mobile: "Mobile",
  audio: "Audio",
  data: "Data",
  analytics: "Analytics",
  research: "Research",
  academic: "Academic",
  games: "Games",
};

function humanUseCase(key: string): string {
  return USE_CASE_LABELS[key] ?? key.replace(/-/g, " ");
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
        active
          ? "border-white bg-white text-black"
          : "border-white/15 bg-transparent text-white/60 hover:border-white/40 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export function StacksBrowser({
  stacks,
  logos,
}: StacksBrowserProps) {
  const [activeConstraints, setActiveConstraints] = useState<
    Set<StackConstraint>
  >(new Set());
  const [activeUseCases, setActiveUseCases] = useState<Set<string>>(new Set());

  const useCaseItems = useMemo(() => buildUseCaseItems(stacks), [stacks]);

  const filtered = useMemo(() => {
    return stacks.filter((s) => {
      // OR within constraints axis
      if (activeConstraints.size > 0) {
        const matches = s.constraints.some((c) => activeConstraints.has(c));
        if (!matches) return false;
      }
      // OR within use-cases axis
      if (activeUseCases.size > 0) {
        const matches = s.useCases.some((u) => activeUseCases.has(u));
        if (!matches) return false;
      }
      return true;
    });
  }, [stacks, activeConstraints, activeUseCases]);

  function toggleConstraint(c: StackConstraint) {
    setActiveConstraints((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function toggleUseCase(u: string) {
    setActiveUseCases((prev) => {
      const next = new Set(prev);
      if (next.has(u)) next.delete(u);
      else next.add(u);
      return next;
    });
  }

  function clearAll() {
    setActiveConstraints(new Set());
    setActiveUseCases(new Set());
  }

  const hasFilters = activeConstraints.size > 0 || activeUseCases.size > 0;

  return (
    <>
      {/* Filter panel */}
      <div className="mt-10 border-t border-white/10 pt-6 sm:mt-12 sm:pt-8">
        <div className="flex items-center justify-between gap-4">
          <CollapsibleFilterPanel
            label="Filters"
            activeCount={activeConstraints.size + activeUseCases.size}
            defaultOpen={hasFilters}
          >
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                    Constraints
                  </p>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ALL_CONSTRAINTS.map((c) => (
                    <Chip
                      key={c}
                      active={activeConstraints.has(c)}
                      onClick={() => toggleConstraint(c)}
                    >
                      {CONSTRAINT_LABELS[c]}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                    Use case
                  </p>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="mt-3">
                  <ScalableTagFilter
                    label="Use cases"
                    tags={useCaseItems}
                    selected={Array.from(activeUseCases)}
                    onToggle={toggleUseCase}
                    onClearAll={() => setActiveUseCases(new Set())}
                    inlineLimit={8}
                    variant="mono"
                    searchPlaceholder="Search use cases..."
                  />
                </div>
              </div>

              {hasFilters && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline sm:text-[11px]"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </CollapsibleFilterPanel>

          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
            {filtered.length} {filtered.length === 1 ? "stack" : "stacks"}
          </p>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((stack) => (
            <StackCard key={stack.slug} stack={stack} logos={logos} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center border border-dashed border-white/15 p-10 text-center">
          <p className="font-serif text-2xl italic text-white/80">
            No stacks match.
          </p>
          <p className="mt-2 font-serif text-sm italic text-white/55">
            Try fewer filters.
          </p>
        </div>
      )}
    </>
  );
}

function StackCard({
  stack,
  logos,
}: {
  stack: Stack;
  logos: StackLogoMap;
}) {
  // Split the name so the last word gets italic emphasis.
  // e.g. "Build a SaaS" => "Build a " + "SaaS"
  const words = stack.name.split(" ");
  const prefix = words.slice(0, -1).join(" ");
  const emphasis = words[words.length - 1];

  const logoSlugs = stack.steps.slice(0, 4).map((s) => s.toolSlug);

  return (
    <Link
      href={`/stacks/${stack.slug}`}
      className="bento-tile group relative flex h-full flex-col p-5 hover:border-white/30"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-2xl font-normal leading-tight tracking-[-0.02em] sm:text-[1.65rem]">
          {prefix && <span className="text-white">{prefix} </span>}
          <em className="italic text-white/60">{emphasis}</em>
          <span className="text-white/35">.</span>
        </h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>

      <p className="mt-3 font-serif text-sm italic leading-relaxed text-white/65">
        {stack.tagline}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {stack.constraints.map((c) => (
          <span
            key={c}
            className="inline-flex items-center rounded-full border border-white/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/60"
          >
            {CONSTRAINT_LABELS[c]}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex -space-x-2">
            {logoSlugs.map((slug) => {
              const entry = logos[slug];
              return (
                <ToolLogo
                  key={slug}
                  src={entry?.logoSrc}
                  name={entry?.name || slug}
                  className="relative h-8 w-8 rounded-full border border-white/15 text-[11px] text-white/80 ring-2 ring-black"
                />
              );
            })}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors group-hover:text-white">
            View recipe →
          </span>
        </div>
      </div>
    </Link>
  );
}
