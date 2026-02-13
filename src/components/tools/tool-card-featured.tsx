import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { getLogoUrl } from "@/lib/utils";
import type { ToolWithCategory } from "@/lib/types/database";

interface ToolCardFeaturedProps {
  tool: ToolWithCategory;
}

export function ToolCardFeatured({ tool }: ToolCardFeaturedProps) {
  const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);

  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="group relative h-full overflow-hidden border-border/50 bg-card py-0 gap-0 transition-all duration-300 hover:border-primary/30 hover:glow-md hover:-translate-y-1">
        {/* Bauhaus geometric accent */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border-2 border-primary/[0.06] pointer-events-none" />
        <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full border border-accent/[0.08] pointer-events-none" />

        <CardContent className="relative flex h-full flex-col gap-3 p-4 sm:p-5">
          {/* Header: Logo + Name + Tagline */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-xl font-bold text-primary sm:h-16 sm:w-16 sm:text-2xl">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={tool.name}
                  className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
                />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary transition-colors sm:text-lg">
                  {tool.name}
                </h3>
                {tool.is_verified && <VerifiedBadge showLabel={false} size="sm" />}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Category + Pricing */}
          <div className="flex flex-wrap items-center gap-2">
            {tool.categories && (
              <span className="text-xs text-muted-foreground">
                {tool.categories.name}
              </span>
            )}
            <PricingBadge pricing={tool.pricing_model} />
          </div>

          {/* Rating */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <RatingStars rating={tool.editor_rating} />
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
