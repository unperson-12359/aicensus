import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  size?: "default" | "lg" | "xl";
  /**
   * @deprecated B&W theme has no gradient. Kept for API compatibility.
   */
  gradient?: boolean;
  /** Renders an uppercase eyebrow above the heading */
  accent?: boolean;
  eyebrow?: string;
}

export function SectionHeading({
  title,
  description,
  className,
  size = "default",
  accent = false,
  eyebrow,
}: SectionHeadingProps) {
  const sizeClasses = {
    default: "text-3xl sm:text-4xl md:text-5xl",
    lg: "text-4xl sm:text-5xl md:text-6xl",
    xl: "text-5xl sm:text-6xl md:text-7xl",
  };

  return (
    <div className={cn("space-y-3", className)}>
      {(eyebrow || accent) && (
        <p className="tracking-accent text-white/50">{eyebrow ?? "Section"}</p>
      )}
      <h2
        className={cn(
          "font-display font-bold tracking-hero leading-[0.95]",
          sizeClasses[size]
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
