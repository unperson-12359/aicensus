"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  GitCompare,
  Layers3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { ToolCard } from "@/components/tools/tool-card";
import {
  comparisonKey,
  useSavedItems,
  type SavedComparison,
  type SavedStack,
  type SavedTool,
} from "@/lib/saved-items";
import { getComparisonPath } from "@/lib/compare-urls";
import type { ToolWithCategory } from "@/lib/types/database";

const SITE_ORIGIN = "https://aicensus.co";

function formatSavedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved recently";
  return `Saved ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function comparisonLabel(comparison: SavedComparison): string {
  return comparison.label || comparison.slugs.map(titleCase).join(" vs ");
}

function stackSummary(stack: SavedStack): string {
  try {
    const url = new URL(stack.url, SITE_ORIGIN);
    const caps = url.searchParams.get("caps")?.split(",").filter(Boolean) || [];
    return caps.length > 0 ? `${caps.length} selected capabilities` : "Custom stack builder state";
  } catch {
    return "Custom stack builder state";
  }
}

function EmptySavedSection({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <EmptyState title={title} description={description}>
      <Link href={href}>
        <Button variant="outline" size="sm">
          {cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </EmptyState>
  );
}

function ClearAllButton({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white sm:text-[11px]"
    >
      <Trash2 className="h-3 w-3" />
      Clear {label}
    </button>
  );
}

function ComparisonCard({
  comparison,
  onRemove,
}: {
  comparison: SavedComparison;
  onRemove: () => void;
}) {
  const label = comparisonLabel(comparison);

  return (
    <article className="bento-tile flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            <GitCompare className="h-3.5 w-3.5" />
            Comparison
          </div>
          <h2 className="mt-3 font-serif text-xl leading-tight tracking-[-0.02em] text-white sm:text-2xl">
            {label}
          </h2>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="rounded-full border border-white/15 p-2 text-white/45 transition-colors hover:border-white/40 hover:text-white"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {comparison.slugs.map((slug) => (
          <Badge key={slug} variant="outline" className="text-[10px] text-white/65">
            {titleCase(slug)}
          </Badge>
        ))}
      </div>
      <p className="mt-4 text-xs text-white/45">{formatSavedAt(comparison.savedAt)}</p>
      <div className="mt-auto pt-5">
        <Link
          href={getComparisonPath(comparison.slugs)}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-white sm:text-[11px]"
        >
          Open comparison <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

function StackCard({ stack, onRemove }: { stack: SavedStack; onRemove: () => void }) {
  const label = stack.title || "Saved AI stack";

  return (
    <article className="bento-tile flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            <Layers3 className="h-3.5 w-3.5" />
            Stack
          </div>
          <h2 className="mt-3 font-serif text-xl leading-tight tracking-[-0.02em] text-white sm:text-2xl">
            {label}
          </h2>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="rounded-full border border-white/15 p-2 text-white/45 transition-colors hover:border-white/40 hover:text-white"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-4 text-sm text-white/65">{stackSummary(stack)}</p>
      <p className="mt-4 text-xs text-white/45">{formatSavedAt(stack.savedAt)}</p>
      <div className="mt-auto pt-5">
        <Link
          href={stack.url}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-white sm:text-[11px]"
        >
          Open stack <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

export function SavedWorkspace() {
  const { hydrated, state, removeTool, removeComparison, removeStack } = useSavedItems();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toolResult, setToolResult] = useState<{
    key: string;
    tools: ToolWithCategory[];
  }>({ key: "", tools: [] });

  useEffect(() => setMounted(true), []);

  const toolSlugs = useMemo(() => state.tools.map((tool) => tool.slug), [state.tools]);
  const toolSlugKey = toolSlugs.join(",");

  useEffect(() => {
    if (!hydrated || !toolSlugKey) return;

    const controller = new AbortController();
    fetch(`/api/tools/by-slugs?slugs=${encodeURIComponent(toolSlugKey)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : { tools: [] }))
      .then((data: { tools?: ToolWithCategory[] }) => {
        if (!controller.signal.aborted) {
          setToolResult({ key: toolSlugKey, tools: data.tools || [] });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setToolResult({ key: toolSlugKey, tools: [] });
        }
      });

    return () => controller.abort();
  }, [hydrated, toolSlugKey]);

  const tools = toolResult.key === toolSlugKey ? toolResult.tools : [];
  const loadingTools = Boolean(toolSlugKey) && toolResult.key !== toolSlugKey;

  const liveSlugs = useMemo(() => new Set(tools.map((tool) => tool.slug)), [tools]);
  const missingTools: SavedTool[] = useMemo(
    () =>
      loadingTools ? [] : state.tools.filter((tool) => !liveSlugs.has(tool.slug)),
    [loadingTools, liveSlugs, state.tools]
  );

  const totalCount = state.tools.length + state.comparisons.length + state.stacks.length;

  function clearTools() {
    if (state.tools.length === 0) return;
    if (window.confirm(`Remove all ${state.tools.length} saved tools? This cannot be undone.`)) {
      state.tools.forEach((tool) => removeTool(tool.slug));
    }
  }

  function clearComparisons() {
    if (state.comparisons.length === 0) return;
    if (
      window.confirm(
        `Remove all ${state.comparisons.length} saved comparisons? This cannot be undone.`
      )
    ) {
      state.comparisons.forEach((comparison) => removeComparison(comparison.slugs));
    }
  }

  function clearStacks() {
    if (state.stacks.length === 0) return;
    if (window.confirm(`Remove all ${state.stacks.length} saved stacks? This cannot be undone.`)) {
      state.stacks.forEach((stack) => removeStack(stack.url));
    }
  }

  async function copyShortlist() {
    const lines: string[] = ["# My AiCensus shortlist", ""];
    if (state.tools.length > 0) {
      lines.push("## Tools");
      state.tools.forEach((saved) => {
        const live = tools.find((tool) => tool.slug === saved.slug);
        const name = live?.name ?? `${titleCase(saved.slug)} (no longer published)`;
        lines.push(`- [${name}](${SITE_ORIGIN}/tools/${saved.slug})`);
      });
      lines.push("");
    }
    if (state.comparisons.length > 0) {
      lines.push("## Comparisons");
      state.comparisons.forEach((comparison) => {
        lines.push(
          `- [${comparisonLabel(comparison)}](${SITE_ORIGIN}${getComparisonPath(comparison.slugs)})`
        );
      });
      lines.push("");
    }
    if (state.stacks.length > 0) {
      lines.push("## Stacks");
      state.stacks.forEach((stack) => {
        lines.push(`- [${stack.title || "Saved AI stack"}](${SITE_ORIGIN}${stack.url})`);
      });
      lines.push("");
    }
    const text = lines.join("\n").trim();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (!hydrated || !mounted) {
    return (
      <div className="mt-10 border border-white/10 bg-white/[0.02] p-8 text-sm text-white/55">
        Loading your saved workspace...
      </div>
    );
  }

  return (
    <Tabs defaultValue="tools" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList className="justify-start overflow-x-auto bg-white/[0.04]">
          <TabsTrigger value="tools">
            Tools
            <Badge variant="outline" className="ml-1 border-white/15 text-[10px]">
              {state.tools.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="comparisons">
            Comparisons
            <Badge variant="outline" className="ml-1 border-white/15 text-[10px]">
              {state.comparisons.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="stacks">
            Stacks
            <Badge variant="outline" className="ml-1 border-white/15 text-[10px]">
              {state.stacks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        {totalCount > 0 && (
          <button
            type="button"
            onClick={copyShortlist}
            aria-live="polite"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" /> Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy shortlist
              </>
            )}
          </button>
        )}
      </div>

      <TabsContent value="tools" className="mt-8">
        {state.tools.length === 0 ? (
          <EmptySavedSection
            title="No saved tools yet"
            description="Save tools while browsing to build a shortlist you can revisit later."
            href="/tools"
            cta="Browse tools"
          />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/60">
                {loadingTools ? "Hydrating saved tools..." : `${tools.length} saved tools ready`}
                {missingTools.length > 0 ? `, ${missingTools.length} no longer published` : ""}
              </p>
              <ClearAllButton label="tools" onClear={clearTools} />
            </div>
            {tools.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="relative">
                    <ToolCard tool={tool} />
                    <button
                      type="button"
                      onClick={() => removeTool(tool.slug)}
                      aria-label={`Remove ${tool.name}`}
                      className="absolute bottom-3 right-3 z-30 rounded-full border border-white/15 bg-black/80 p-2 text-white/45 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {missingTools.length > 0 && (
              <div className="mt-6 border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
                  No longer published
                </p>
                <p className="mt-2 text-sm text-white/55">
                  These saved tools are not in the live catalog right now. Keep them in case they
                  return, or remove them to tidy your shortlist.
                </p>
                <ul className="mt-3 divide-y divide-white/5">
                  {missingTools.map((saved) => (
                    <li key={saved.slug} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white/75">{titleCase(saved.slug)}</p>
                        <p className="font-mono text-[10px] text-white/35">
                          /tools/{saved.slug} · {formatSavedAt(saved.savedAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTool(saved.slug)}
                        aria-label={`Remove ${titleCase(saved.slug)} from saved tools`}
                        className="shrink-0 rounded-full border border-white/15 p-2 text-white/45 transition-colors hover:border-white/40 hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="comparisons" className="mt-8">
        {state.comparisons.length === 0 ? (
          <EmptySavedSection
            title="No saved comparisons yet"
            description="Compare tools side by side, then save the comparison for later."
            href="/compare"
            cta="Build a comparison"
          />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/60">
                {state.comparisons.length} saved comparisons
              </p>
              <ClearAllButton label="comparisons" onClear={clearComparisons} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {state.comparisons.map((comparison) => (
                <ComparisonCard
                  key={comparisonKey(comparison.slugs)}
                  comparison={comparison}
                  onRemove={() => removeComparison(comparison.slugs)}
                />
              ))}
            </div>
          </>
        )}
      </TabsContent>

      <TabsContent value="stacks" className="mt-8">
        {state.stacks.length === 0 ? (
          <EmptySavedSection
            title="No saved stacks yet"
            description="Use the stack builder, tune the recommendations, and save the result."
            href="/stacks/build"
            cta="Build a stack"
          />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/60">{state.stacks.length} saved stacks</p>
              <ClearAllButton label="stacks" onClear={clearStacks} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {state.stacks.map((stack) => (
                <StackCard
                  key={stack.url}
                  stack={stack}
                  onRemove={() => removeStack(stack.url)}
                />
              ))}
            </div>
          </>
        )}
      </TabsContent>

      {totalCount > 0 && (
        <div className="mt-10 border-t border-white/10 pt-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
          >
            Keep exploring <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </Tabs>
  );
}
