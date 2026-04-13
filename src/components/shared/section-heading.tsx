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
    xl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {accent && (
        <div className="flex items-center gap-2 mb-1">
          <div className="h-0.5 w-12 rounded-full bg-primary" />
          <div className="h-0.5 w-5 rounded-full bg-accent" />
        </div>
      )}
      <h2
        className={cn(
          "font-display font-normal tracking-display",
          sizeClasses[size],
          gradient && "text-gradient-primary"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}
