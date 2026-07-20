import Image from "next/image";
import { cn } from "@/lib/utils";

interface ToolLogoProps {
  src?: string | null;
  name: string;
  className?: string;
}

// Hosts whitelisted in next.config.ts images.remotePatterns. DB logo_url
// values may point at arbitrary hosts, so anything outside this list is
// rendered with `unoptimized` (next/image would otherwise throw).
const OPTIMIZED_LOGO_HOSTS = /(^|\.)supabase\.co$|(^|\.)cloudinary\.com$/;
const OPTIMIZED_EXACT_HOSTS = new Set(["www.google.com", "logo.clearbit.com"]);

function isOptimizedHost(src: string): boolean {
  try {
    const hostname = new URL(src).hostname;
    return OPTIMIZED_EXACT_HOSTS.has(hostname) || OPTIMIZED_LOGO_HOSTS.test(hostname);
  } catch {
    return false;
  }
}

export function ToolLogo({ src, name, className }: ToolLogoProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-white/5 font-bold text-white",
        className
      )}
      title={name}
    >
      {src ? (
        <Image
          src={src}
          alt={`${name} logo`}
          fill
          sizes="80px"
          className="object-cover"
          unoptimized={!isOptimizedHost(src)}
        />
      ) : (
        <span>{initial}</span>
      )}
    </span>
  );
}
