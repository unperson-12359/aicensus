import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({ size = "sm", showLabel = true, className }: VerifiedBadgeProps) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={cn("flex items-center gap-1 text-accent", className)}>
      <BadgeCheck className={iconSize} />
      {showLabel && (
        <span className={cn("font-medium", size === "sm" ? "text-xs" : "text-sm")}>
          Verified
        </span>
      )}
    </div>
  );
}
