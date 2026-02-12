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
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  return (
    <p className="text-sm text-muted-foreground">
      Showing {start}&ndash;{end} of {total} {label}
    </p>
  );
}
