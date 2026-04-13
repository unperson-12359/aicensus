import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { getLogoUrl } from "@/lib/utils";
import type { ToolWithCategory } from "@/lib/types/database";

interface ToolCardProps {
  tool: ToolWithCategory;
}

export function ToolCard({ tool }: ToolCardProps) {
  const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);

  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="group relative h-full overflow-hidden border-border/50 bg-card py-0 gap-0 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="flex h-full flex-col gap-2 p-3 sm:gap-3 sm:p-4">
          {/* Header: Logo + Name */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-base font-bold text-primary sm:h-11 sm:w-11 sm:text-lg">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={tool.name}
                  className="h-9 w-9 rounded-lg object-cover sm:h-11 sm:w-11"
                />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors sm:text-base">
                  {tool.name}
                </h3>
                {tool.is_verified && <VerifiedBadge showLabel={false} size="sm" />}
              </div>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Category + Pricing */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {tool.categories && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {tool.categories.name}
              </span>
            )}
            <PricingBadge pricing={tool.pricing_model} />
          </div>

          {/* Rating */}
          <div className="mt-auto flex items-center justify-between pt-1 sm:pt-2">
            <RatingStars rating={tool.editor_rating} />
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
