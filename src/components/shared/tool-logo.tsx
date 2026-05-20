import { cn } from "@/lib/utils";

interface ToolLogoProps {
  src?: string | null;
  name: string;
  className?: string;
}

export function ToolLogo({ src, name, className }: ToolLogoProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const safeSrc = src?.replace(/["\\]/g, "\\$&");

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden bg-white/5 font-bold text-white",
        className
      )}
      title={name}
    >
      {src ? (
        <span
          aria-label={`${name} logo`}
          role="img"
          className="block h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${safeSrc}")` }}
        />
      ) : (
        <span>{initial}</span>
      )}
    </span>
  );
}
