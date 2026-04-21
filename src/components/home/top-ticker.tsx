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
      <div className="flex w-max animate-ticker items-center gap-10 py-2.5 text-[11px] font-medium tracking-[0.22em] text-white/55 uppercase">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span>{item}</span>
            <span className="text-white/25">◆</span>
          </span>
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}
