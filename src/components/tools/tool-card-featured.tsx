"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { SaveToolButton } from "@/components/saved/save-tool-button";
import { getLogoUrl } from "@/lib/utils";
import type { ToolWithCategory } from "@/lib/types/database";

interface ToolCardFeaturedProps {
  tool: ToolWithCategory;
}

export function ToolCardFeatured({ tool }: ToolCardFeaturedProps) {
  const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);

  return (
    <article className="bento-tile group relative flex h-full flex-col overflow-hidden p-6 sm:p-8 hover:border-white/30">
      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`Read ${tool.name} review`}
      />
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 bento-grid-pattern opacity-30 pointer-events-none" />

      <div className="pointer-events-none relative z-10 flex items-start justify-between">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-xl font-bold text-white sm:h-20 sm:w-20 sm:text-2xl">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={tool.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{tool.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white/70">
            <Sparkles className="h-3 w-3" />
            Featured
          </span>
          <span className="pointer-events-auto">
            <SaveToolButton slug={tool.slug} name={tool.name} mode="icon" />
          </span>
          <ArrowUpRight className="h-5 w-5 text-white/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
      </div>

      <div className="pointer-events-none relative z-10 mt-6 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-2xl font-semibold tracking-hero text-foreground sm:text-3xl">
            {tool.name}
          </h3>
          {tool.is_verified && <VerifiedBadge showLabel={false} size="sm" />}
        </div>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground line-clamp-3">
          {tool.tagline}
        </p>
      </div>

      <div className="pointer-events-none relative z-10 mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
        {tool.categories && (
          <span className="tracking-accent text-muted-foreground">
            {tool.categories.name}
          </span>
        )}
        <PricingBadge pricing={tool.pricing_model} />
        <div className="ml-auto">
          <RatingStars rating={tool.editor_rating} />
        </div>
      </div>
    </article>
  );
}
