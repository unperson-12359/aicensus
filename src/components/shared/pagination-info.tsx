interface PaginationInfoProps {
  currentPage: number;
  perPage: number;
  total: number;
  label?: string;
}

export function PaginationInfo({
  currentPage,
  perPage,
  total,
  label = "tools",
}: PaginationInfoProps) {
  if (total === 0) return null;

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  return (
    <p
      className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]"
      aria-live="polite"
    >
      {start}&ndash;{end} of {total} {label}
    </p>
  );
}
