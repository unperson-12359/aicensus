import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number | null;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function RatingStars({ rating, size = "sm", showValue = true }: RatingStarsProps) {
  if (rating === null) return null;

  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= Math.round(rating)
                ? "fill-foreground text-foreground"
                : "fill-white/10 text-white/10"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="ml-1 text-xs font-mono text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
