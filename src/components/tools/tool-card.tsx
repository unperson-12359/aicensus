import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import type { ToolWithCategory } from "@/lib/types/database";

interface ToolCardProps {
  tool: ToolWithCategory;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="group relative h-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:glow-md hover:-translate-y-1">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          {/* Header: Logo + Name */}
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-bold text-primary">
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className="h-11 w-11 rounded-lg object-cover"
                />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                {tool.is_verified && <VerifiedBadge showLabel={false} size="sm" />}
              </div>
              <p className="truncate text-sm text-muted-foreground">
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
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
