"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { SaveToolButton } from "@/components/saved/save-tool-button";
import { getLogoUrl } from "@/lib/utils";
import type { ToolWithCategory } from "@/lib/types/database";

interface ToolCardProps {
  tool: ToolWithCategory;
}

export function ToolCard({ tool }: ToolCardProps) {
  const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);

  return (
    <article className="bento-tile group relative flex h-full flex-col p-5 sm:p-6 hover:border-white/30">
      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`Read ${tool.name} review`}
      />
      {/* Top row: logo + external arrow */}
      <div className="pointer-events-none relative z-10 flex items-start justify-between">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-base font-bold text-white">
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
        <div className="pointer-events-auto flex items-center gap-2">
          <SaveToolButton slug={tool.slug} name={tool.name} mode="icon" />
          <ArrowUpRight className="h-4 w-4 text-white/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
      </div>

      {/* Middle: name + tagline */}
      <div className="pointer-events-none relative z-10 mt-5 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {tool.name}
          </h3>
          {tool.is_verified && <VerifiedBadge showLabel={false} size="sm" />}
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tool.tagline}
        </p>
      </div>

      {/* Bottom: meta row */}
      <div className="pointer-events-none relative z-10 mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          {tool.categories && (
            <span className="tracking-accent text-muted-foreground">
              {tool.categories.name}
            </span>
          )}
        </div>
        <PricingBadge pricing={tool.pricing_model} />
      </div>

      <div className="pointer-events-none relative z-10 mt-3 flex items-center justify-between">
        <RatingStars rating={tool.editor_rating} />
      </div>
    </article>
  );
}
