"use client";

import { useEffect, useRef } from "react";
import { trackSearchQuery } from "@/lib/analytics";

interface SearchQueryTrackerProps {
  query?: string;
}

export function SearchQueryTracker({ query }: SearchQueryTrackerProps) {
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const trimmed = query?.trim();
    if (!trimmed || trimmed === lastTracked.current) return;
    lastTracked.current = trimmed;
    trackSearchQuery(trimmed);
  }, [query]);

  return null;
}
