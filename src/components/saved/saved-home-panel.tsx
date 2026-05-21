"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, GitCompare, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSavedItems } from "@/lib/saved-items";
import type { ToolWithCategory } from "@/lib/types/database";

export function SavedHomePanel() {
  const { hydrated, state, total } = useSavedItems();
  const [toolResult, setToolResult] = useState<{
    key: string;
    tools: ToolWithCategory[];
  }>({ key: "", tools: [] });

  const recentToolSlugs = useMemo(
    () => state.tools.slice(0, 3).map((tool) => tool.slug),
    [state.tools]
  );
  const recentToolKey = recentToolSlugs.join(",");

  useEffect(() => {
    if (!hydrated || !recentToolKey) return;

    const controller = new AbortController();
    fetch(`/api/tools/by-slugs?slugs=${encodeURIComponent(recentToolKey)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : { tools: [] }))
      .then((data: { tools?: ToolWithCategory[] }) => {
        if (!controller.signal.aborted) {
          setToolResult({ key: recentToolKey, tools: data.tools || [] });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setToolResult({ key: recentToolKey, tools: [] });
        }
      });

    return () => controller.abort();
  }, [hydrated, recentToolKey]);

  const tools = toolResult.key === recentToolKey ? toolResult.tools : [];

  return (
    <section className="border-t border-white/10 py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
              Your AI shortlist
            </p>
            <h2 className="mt-2 font-serif text-2xl font-normal leading-tight tracking-[-0.03em] sm:text-3xl">
              {hydrated && total > 0 ? "Pick up where you left off." : "Start a shortlist."}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
              {hydrated && total > 0
                ? "Your saved tools, comparisons, and stack-builder results stay private in this browser."
                : "Save the tools and comparisons you want to revisit. No account required."}
            </p>
          </div>

          <div className="lg:col-span-7">
            {hydrated && total > 0 ? (
              <div className="grid gap-3 md:grid-cols-[1fr_1.35fr]">
                <div className="grid grid-cols-3 gap-2">
                  <div className="border border-white/10 bg-white/[0.02] p-3">
                    <Bookmark className="h-4 w-4 text-white/50" />
                    <p className="mt-2 font-serif text-2xl italic">{state.tools.length}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
                      Tools
                    </p>
                  </div>
                  <div className="border border-white/10 bg-white/[0.02] p-3">
                    <GitCompare className="h-4 w-4 text-white/50" />
                    <p className="mt-2 font-serif text-2xl italic">{state.comparisons.length}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
                      Comps
                    </p>
                  </div>
                  <div className="border border-white/10 bg-white/[0.02] p-3">
                    <Layers3 className="h-4 w-4 text-white/50" />
                    <p className="mt-2 font-serif text-2xl italic">{state.stacks.length}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
                      Stacks
                    </p>
                  </div>
                </div>

                <div className="border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                      Recent saved tools
                    </p>
                    <Link href="/saved" className="text-xs text-white/55 hover:text-white">
                      Open all
                    </Link>
                  </div>
                  {tools.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tools.map((tool) => (
                        <Link key={tool.id} href={`/tools/${tool.slug}`}>
                          <Badge variant="outline" className="border-white/15 text-white/70">
                            {tool.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-white/50">
                      Saved comparisons and stacks are ready. Save a tool to see it here.
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href="/saved">
                      <Button size="sm">
                        Open shortlist <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href="/tools">
                      <Button size="sm" variant="outline">
                        Keep browsing
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-3">
                <Link href="/tools" className="border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/30">
                  <Bookmark className="h-4 w-4 text-white/55" />
                  <p className="mt-3 text-sm font-medium text-white">Save tools</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">Build a shortlist as you browse.</p>
                </Link>
                <Link href="/compare" className="border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/30">
                  <GitCompare className="h-4 w-4 text-white/55" />
                  <p className="mt-3 text-sm font-medium text-white">Save comparisons</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">Keep side-by-side research handy.</p>
                </Link>
                <Link href="/stacks/build" className="border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/30">
                  <Layers3 className="h-4 w-4 text-white/55" />
                  <p className="mt-3 text-sm font-medium text-white">Save stacks</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">Return to your exact builder state.</p>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
