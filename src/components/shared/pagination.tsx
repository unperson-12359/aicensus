import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  /**
   * Optional hash appended to every page link so the browser scrolls to the
   * list container on navigation (e.g. `#results`). Leave undefined to scroll
   * to the top of the page.
   */
  anchor?: string;
}

function buildUrl(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>,
  anchor?: string
) {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") {
        params.set(key, value);
      }
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const qs = params.toString();
  const hash = anchor ? `#${anchor}` : "";
  return qs ? `${basePath}?${qs}${hash}` : `${basePath}${hash}`;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);
  return pages;
}

const cell =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
  anchor,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const prevHref = buildUrl(basePath, currentPage - 1, searchParams, anchor);
  const nextHref = buildUrl(basePath, currentPage + 1, searchParams, anchor);

  return (
    <nav
      aria-label="Pagination"
      className="flex w-full flex-col items-center gap-3 sm:gap-4"
    >
      {/* Desktop: full controls */}
      <ul className="hidden items-center gap-1 sm:flex">
        <li>
          {currentPage > 1 ? (
            <Link
              href={prevHref}
              className={cn(
                cell,
                "gap-1.5 text-white/65 hover:bg-white/5 hover:text-white"
              )}
              aria-label="Previous page"
              rel="prev"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className={cn(cell, "gap-1.5 text-white/20")}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </span>
          )}
        </li>

        {pages.map((page, i) =>
          page === "..." ? (
            <li
              key={`ellipsis-${i}`}
              aria-hidden="true"
              className={cn(cell, "text-white/30")}
            >
              &hellip;
            </li>
          ) : (
            <li key={page}>
              <Link
                href={buildUrl(basePath, page, searchParams, anchor)}
                className={cn(
                  cell,
                  page === currentPage
                    ? "border border-white/60 bg-white text-black"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                )}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={
                  page === currentPage
                    ? `Page ${page}, current page`
                    : `Page ${page}`
                }
              >
                {page}
              </Link>
            </li>
          )
        )}

        <li>
          {currentPage < totalPages ? (
            <Link
              href={nextHref}
              className={cn(
                cell,
                "gap-1.5 text-white/65 hover:bg-white/5 hover:text-white"
              )}
              aria-label="Next page"
              rel="next"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className={cn(cell, "gap-1.5 text-white/20")}
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          )}
        </li>
      </ul>

      {/* Mobile: compact Prev / Page X of Y / Next */}
      <div className="flex w-full items-center justify-between gap-2 sm:hidden">
        {currentPage > 1 ? (
          <Link
            href={prevHref}
            className={cn(
              cell,
              "flex-1 gap-1.5 border border-white/15 text-white/75 hover:border-white/30 hover:text-white"
            )}
            aria-label="Previous page"
            rel="prev"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </Link>
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              cell,
              "flex-1 gap-1.5 border border-white/5 text-white/20"
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </span>
        )}
        <span
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55"
          aria-live="polite"
        >
          {currentPage} / {totalPages}
        </span>
        {currentPage < totalPages ? (
          <Link
            href={nextHref}
            className={cn(
              cell,
              "flex-1 gap-1.5 border border-white/15 text-white/75 hover:border-white/30 hover:text-white"
            )}
            aria-label="Next page"
            rel="next"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              cell,
              "flex-1 gap-1.5 border border-white/5 text-white/20"
            )}
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </nav>
  );
}
