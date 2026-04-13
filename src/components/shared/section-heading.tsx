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
    default: "text-xl sm:text-2xl md:text-3xl",
    lg: "text-2xl sm:text-3xl md:text-4xl",
    xl: "text-3xl sm:text-4xl md:text-5xl",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {accent && (
        <div className="mb-1">
          <div className="h-px w-8 bg-primary" />
        </div>
      )}
      <h2
        className={cn(
          "font-display font-semibold tracking-display",
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
