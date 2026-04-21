import { cn } from "@/lib/utils";

interface ChapterHeadingProps {
  num: string;
  label: string;
  className?: string;
}

export function ChapterHeading({ num, label, className }: ChapterHeadingProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55",
        className
      )}
    >
      <span aria-hidden>§</span>
      <span>{num}</span>
      <span className="text-white/25">·</span>
      <span className="text-white/80">{label}</span>
      <span className="ml-2 h-px flex-1 bg-white/10" />
    </div>
  );
}
