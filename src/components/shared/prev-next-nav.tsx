import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrevNextItem {
  href: string;
  label: string;
  sublabel?: string;
}

interface PrevNextNavProps {
  prev?: PrevNextItem | null;
  next?: PrevNextItem | null;
  /**
   * Rendered as the mono eyebrow above each tile ("Previous" / "Next").
   * Defaults fit blog/article navigation; pass custom labels for other sections.
   */
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function PrevNextNav({
  prev,
  next,
  prevLabel = "Previous",
  nextLabel = "Next",
  className,
}: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Previous and next"
      className={cn(
        "grid gap-3 sm:gap-4",
        prev && next ? "sm:grid-cols-2" : "sm:grid-cols-1",
        className
      )}
    >
      {prev ? (
        <Link
          href={prev.href}
          rel="prev"
          className="bento-tile group flex items-start gap-4 p-5 transition-colors hover:border-white/30 sm:p-6"
        >
          <ArrowLeft className="mt-1 h-4 w-4 shrink-0 text-white/50 transition-transform group-hover:-translate-x-0.5 group-hover:text-white" />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
              {prevLabel}
            </p>
            <p className="mt-1.5 truncate font-serif text-base text-white sm:text-lg">
              {prev.label}
            </p>
            {prev.sublabel && (
              <p className="mt-0.5 truncate text-xs text-white/55">
                {prev.sublabel}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div aria-hidden className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={next.href}
          rel="next"
          className="bento-tile group flex items-start justify-end gap-4 p-5 text-right transition-colors hover:border-white/30 sm:p-6"
        >
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
              {nextLabel}
            </p>
            <p className="mt-1.5 truncate font-serif text-base text-white sm:text-lg">
              {next.label}
            </p>
            {next.sublabel && (
              <p className="mt-0.5 truncate text-xs text-white/55">
                {next.sublabel}
              </p>
            )}
          </div>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
        </Link>
      ) : (
        <div aria-hidden className="hidden sm:block" />
      )}
    </nav>
  );
}
