interface TopTickerProps {
  items: string[];
}

export function TopTicker({ items }: TopTickerProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-white/10 bg-black"
      aria-hidden
    >
      <div className="flex w-max animate-ticker items-center gap-6 py-2 text-[10px] font-medium tracking-[0.2em] text-white/55 uppercase sm:gap-10 sm:py-2.5 sm:text-[11px] sm:tracking-[0.22em]">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 whitespace-nowrap sm:gap-10">
            <span>{item}</span>
            <span className="text-white/25">◆</span>
          </span>
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black to-transparent sm:w-16" />
    </div>
  );
}
