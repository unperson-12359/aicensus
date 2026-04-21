import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  size?: "default" | "lg" | "xl";
  /** @deprecated No-op in B&W theme */
  gradient?: boolean;
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
    default: "text-2xl sm:text-3xl md:text-[2.25rem]",
    lg: "text-3xl sm:text-4xl md:text-5xl",
    xl: "text-4xl sm:text-5xl md:text-6xl",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {(eyebrow || accent) && (
        <p className="tracking-accent text-white/50">
          {eyebrow ?? "Section"}
        </p>
      )}
      <h2
        className={cn(
          "font-display font-bold tracking-hero leading-[1]",
          sizeClasses[size]
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
