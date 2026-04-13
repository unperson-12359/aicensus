import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  size?: "default" | "lg" | "xl";
  gradient?: boolean;
  accent?: boolean;
}

export function SectionHeading({
  title,
  description,
  className,
  size = "default",
  gradient = false,
  accent = false,
}: SectionHeadingProps) {
  const sizeClasses = {
    default: "text-2xl sm:text-3xl md:text-4xl",
    lg: "text-3xl sm:text-4xl md:text-5xl",
    xl: "text-4xl sm:text-5xl md:text-6xl",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {accent && null}
      <h2
        className={cn(
          "font-display font-bold tracking-[-0.03em]",
          sizeClasses[size],
          gradient && "text-gradient-primary"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      )}
    </div>
  );
}
