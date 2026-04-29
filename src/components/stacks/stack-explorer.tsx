"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, RotateCw, Share2, X } from "lucide-react";
import { cn, getLogoUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { CAPABILITIES, type CapabilityDef } from "@/lib/stack-explorer";

type PricingModel =
  | "free"
  | "freemium"
  | "paid"
  | "open_source"
  | "enterprise"
  | "contact";

export interface ExplorerTool {
  slug: string;
  name: string;
  tagline: string;
  pricing_model: PricingModel;
  editor_rating: number | null;
  logo_url: string | null;
  website_url: string;
  category_name: string | null;
}

interface Constraints {
  freeOnly: boolean;
  ossOnly: boolean;
  highRated: boolean; // editor_rating >= 4.0
}

function pricingMatches(model: PricingModel, c: Constraints): boolean {
  if (c.ossOnly && model !== "open_source") return false;
  if (
    c.freeOnly &&
    !(model === "free" || model === "freemium" || model === "open_source")
  ) {
    return false;
  }
  return true;
}

function pickBestForCapability(
  cap: CapabilityDef,
  pool: Map<string, ExplorerTool>,
  constraints: Constraints,
  excluded: Set<string>
): ExplorerTool | null {
  for (const slug of cap.toolSlugs) {
    if (excluded.has(slug)) continue;
    const t = pool.get(slug);
    if (!t) continue;
    if (!pricingMatches(t.pricing_model, constraints)) continue;
    if (constraints.highRated && (t.editor_rating ?? 0) < 4.0) continue;
    return t;
  }
  // Fallback: ignore high-rated + try again
  if (constraints.highRated) {
    for (const slug of cap.toolSlugs) {
      if (excluded.has(slug)) continue;
      const t = pool.get(slug);
      if (!t) continue;
      if (!pricingMatches(t.pricing_model, constraints)) continue;
      return t;
    }
  }
  return null;
}

interface StackExplorerProps {
  tools: ExplorerTool[];
}

export function StackExplorer({ tools }: StackExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toolMap = useMemo(() => {
    const m = new Map<string, ExplorerTool>();
    for (const t of tools) m.set(t.slug, t);
    return m;
  }, [tools]);

  // Initial state from URL
  const [activeCaps, setActiveCaps] = useState<Set<string>>(() => {
    const param = searchParams.get("caps");
    if (param) return new Set(param.split(",").filter(Boolean));
    return new Set([
      "thinking-partner",
      "code-editor",
      "ui-scaffolding",
      "research",
      "design",
    ]);
  });
  const [constraints, setConstraints] = useState<Constraints>(() => {
    return {
      freeOnly: searchParams.get("free") === "1",
      ossOnly: searchParams.get("oss") === "1",
      highRated: searchParams.get("hr") === "1",
    };
  });
  const [overrides, setOverrides] = useState<Record<string, string>>(() => {
    const o = searchParams.get("o");
    if (!o) return {};
    return o.split(",").reduce((acc, kv) => {
      const [k, v] = kv.split(":");
      if (k && v) acc[k] = v;
      return acc;
    }, {} as Record<string, string>);
  });
  const [copied, setCopied] = useState(false);

  // Sync state to URL whenever it changes (for shareability)
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCaps.size > 0) {
      params.set("caps", Array.from(activeCaps).join(","));
    }
    if (constraints.freeOnly) params.set("free", "1");
    if (constraints.ossOnly) params.set("oss", "1");
    if (constraints.highRated) params.set("hr", "1");
    const overrideStr = Object.entries(overrides)
      .map(([k, v]) => `${k}:${v}`)
      .join(",");
    if (overrideStr) params.set("o", overrideStr);

    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }, [activeCaps, constraints, overrides, router]);

  const stack = useMemo(() => {
    const result: { capability: CapabilityDef; tool: ExplorerTool | null }[] = [];
    const usedSlugs = new Set<string>();
    const orderedActive = CAPABILITIES.filter((c) => activeCaps.has(c.slug));
    for (const cap of orderedActive) {
      const overrideSlug = overrides[cap.slug];
      let chosen: ExplorerTool | null = null;
      if (overrideSlug && toolMap.has(overrideSlug)) {
        chosen = toolMap.get(overrideSlug)!;
      } else {
        chosen = pickBestForCapability(cap, toolMap, constraints, usedSlugs);
      }
      if (chosen) usedSlugs.add(chosen.slug);
      result.push({ capability: cap, tool: chosen });
    }
    return result;
  }, [activeCaps, constraints, overrides, toolMap]);

  const toggleCap = useCallback((slug: string) => {
    setActiveCaps((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    // Clear override for capability when toggling off
    setOverrides((prev) => {
      if (!prev[slug]) return prev;
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }, []);

  const cycleTool = useCallback(
    (capSlug: string, currentSlug: string) => {
      const cap = CAPABILITIES.find((c) => c.slug === capSlug);
      if (!cap) return;
      const eligible = cap.toolSlugs.filter((s) => {
        const t = toolMap.get(s);
        if (!t) return false;
        if (!pricingMatches(t.pricing_model, constraints)) return false;
        if (constraints.highRated && (t.editor_rating ?? 0) < 4.0) return false;
        return true;
      });
      if (eligible.length < 2) return;
      const idx = eligible.indexOf(currentSlug);
      const next = eligible[(idx + 1) % eligible.length];
      setOverrides((prev) => ({ ...prev, [capSlug]: next }));
    },
    [toolMap, constraints]
  );

  const reset = useCallback(() => {
    setOverrides({});
  }, []);

  const copyShareUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, []);

  const filledCount = stack.filter((s) => s.tool).length;

  return (
    <div className="mt-10 sm:mt-14">
      {/* Constraints */}
      <div className="border-t border-white/10 pt-6 sm:pt-8">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
            Constraints
          </p>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <ConstraintChip
            active={constraints.freeOnly}
            onClick={() =>
              setConstraints((c) => ({ ...c, freeOnly: !c.freeOnly }))
            }
          >
            Free / freemium only
          </ConstraintChip>
          <ConstraintChip
            active={constraints.ossOnly}
            onClick={() =>
              setConstraints((c) => ({ ...c, ossOnly: !c.ossOnly }))
            }
          >
            Open-source only
          </ConstraintChip>
          <ConstraintChip
            active={constraints.highRated}
            onClick={() =>
              setConstraints((c) => ({ ...c, highRated: !c.highRated }))
            }
          >
            Editor rating ≥ 4.0
          </ConstraintChip>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mt-8 border-t border-white/10 pt-6 sm:mt-10 sm:pt-8">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
            Capabilities · {activeCaps.size} selected
          </p>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CAPABILITIES.map((cap) => {
            const active = activeCaps.has(cap.slug);
            return (
              <button
                key={cap.slug}
                type="button"
                onClick={() => toggleCap(cap.slug)}
                className={cn(
                  "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                  active
                    ? "border-white bg-white text-black"
                    : "border-white/15 bg-transparent text-white/65 hover:border-white/40 hover:text-white"
                )}
              >
                {active && <Check className="h-3 w-3" />}
                {cap.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stack output */}
      <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16 sm:pt-10">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
            § Your stack · {filledCount}/{stack.length} filled
          </p>
          <div className="flex items-center gap-2">
            {Object.keys(overrides).length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
              >
                <RotateCw className="h-3 w-3" /> Reset picks
              </button>
            )}
            <Button size="sm" variant="outline" onClick={copyShareUrl}>
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              {copied ? "Copied" : "Share"}
            </Button>
          </div>
        </div>

        {stack.length === 0 ? (
          <div className="mt-6 border border-dashed border-white/15 p-10 text-center">
            <p className="font-serif text-2xl italic text-white/80">
              Pick at least one capability above.
            </p>
          </div>
        ) : (
          <ol className="mt-6 space-y-3 sm:space-y-4">
            {stack.map(({ capability, tool }, i) => {
              const num = String(i + 1).padStart(2, "0");
              if (!tool) {
                return (
                  <li
                    key={capability.slug}
                    className="bento-tile relative flex items-start gap-4 p-5 sm:p-6"
                  >
                    <span className="font-serif text-3xl italic leading-none text-white/25">
                      {num}
                    </span>
                    <div className="flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                        {capability.name}
                      </p>
                      <p className="mt-1 font-serif text-lg italic text-white/55">
                        No tool matches your constraints
                      </p>
                      <p className="mt-1 text-sm text-white/45">
                        Loosen the filters above or remove this capability.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCap(capability.slug)}
                      className="text-white/40 transition-colors hover:text-white"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                );
              }
              const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);
              return (
                <li
                  key={capability.slug}
                  className="bento-tile relative grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-6"
                >
                  <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                    <span className="font-serif text-3xl italic leading-none text-white/30 sm:text-4xl">
                      {num}
                    </span>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={tool.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        tool.name.charAt(0)
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                      {capability.name}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-xl leading-tight tracking-[-0.02em] sm:text-2xl">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="hover:text-white/85"
                        >
                          {tool.name}
                        </Link>
                      </h3>
                      <PricingBadge pricing={tool.pricing_model} />
                      <RatingStars rating={tool.editor_rating} size="sm" />
                    </div>
                    <p className="mt-2 text-sm text-white/65">{tool.tagline}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <button
                      type="button"
                      onClick={() => cycleTool(capability.slug, tool.slug)}
                      className="inline-flex items-center gap-1 rounded border border-white/15 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 transition-colors hover:border-white/40 hover:text-white"
                    >
                      <RotateCw className="h-3 w-3" /> Swap
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCap(capability.slug)}
                      className="text-white/40 transition-colors hover:text-white"
                      aria-label="Remove capability"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {stack.length > 0 && filledCount > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/stacks"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
            >
              Compare with curated stacks <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ConstraintChip({
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
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
        active
          ? "border-white bg-white text-black"
          : "border-white/15 bg-transparent text-white/60 hover:border-white/40 hover:text-white"
      )}
    >
      {active && <Check className="h-3 w-3" />}
      {children}
    </button>
  );
}
