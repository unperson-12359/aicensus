import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  size?: "default" | "lg" | "xl";
  gradient?: boolean;
}

export function SectionHeading({
  title,
  description,
  className,
  size = "default",
  gradient = false,
}: SectionHeadingProps) {
  const sizeClasses = {
    default: "text-3xl sm:text-4xl",
    lg: "text-4xl sm:text-5xl",
    xl: "text-5xl sm:text-6xl lg:text-7xl",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <h2
        className={cn(
          "font-display font-bold tracking-display",
          sizeClasses[size],
          gradient && "text-gradient-primary"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
