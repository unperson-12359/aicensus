"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolCardFeatured } from "@/components/tools/tool-card-featured";
import {
  StaggerChildren,
  StaggerItem,
  RevealText,
} from "@/components/motion";
import type { ToolWithCategory } from "@/lib/types/database";

type Tab = "featured" | "newest";

interface HomeToolsSectionProps {
  featuredTools: ToolWithCategory[];
  recentTools: ToolWithCategory[];
}

export function HomeToolsSection({
  featuredTools,
  recentTools,
}: HomeToolsSectionProps) {
  const [tab, setTab] = useState<Tab>("featured");

  const heroFeature = featuredTools[0];
  const secondaryFeatures = featuredTools.slice(1, 5);
  const hasFeatured = featuredTools.length > 0;
  const hasRecent = recentTools.length > 0;

  if (!hasFeatured && !hasRecent) return null;

  const viewAllHref = tab === "newest" ? "/tools?sort=newest" : "/tools";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <RevealText>
          <h2 className="font-serif text-[clamp(1.75rem,4.5vw,3.25rem)] font-normal leading-[1] tracking-[-0.03em]">
            {tab === "featured" ? (
              <>
                Featured <em className="italic text-white/50">now</em>.
              </>
            ) : (
              <>
                New tools <em className="italic text-white/50">to track</em>.
              </>
            )}
          </h2>
        </RevealText>
        <div className="flex flex-wrap items-center gap-3">
          {hasFeatured && hasRecent && (
            <div className="inline-flex rounded-full border border-white/15 p-0.5">
              <button
                type="button"
                onClick={() => setTab("featured")}
                aria-pressed={tab === "featured"}
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors sm:text-[11px]",
                  tab === "featured"
                    ? "bg-white text-black"
                    : "text-white/55 hover:text-white"
                )}
              >
                Featured
              </button>
              <button
                type="button"
                onClick={() => setTab("newest")}
                aria-pressed={tab === "newest"}
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors sm:text-[11px]",
                  tab === "newest"
                    ? "bg-white text-black"
                    : "text-white/55 hover:text-white"
                )}
              >
                Newest
              </button>
            </div>
          )}
          <Link
            href={viewAllHref}
            className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white sm:text-[11px]"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {tab === "featured" && hasFeatured && (
        <StaggerChildren className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[1fr] lg:mt-8">
          {heroFeature && (
            <StaggerItem className="lg:col-span-6 lg:row-span-2">
              <ToolCardFeatured tool={heroFeature} />
            </StaggerItem>
          )}
          {secondaryFeatures.map((tool) => (
            <StaggerItem key={tool.id} className="lg:col-span-3">
              <ToolCard tool={tool} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      )}

      {tab === "newest" && hasRecent && (
        <StaggerChildren className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 lg:mt-8">
          {recentTools.map((tool) => (
            <StaggerItem key={tool.id}>
              <ToolCard tool={tool} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      )}
    </>
  );
}
