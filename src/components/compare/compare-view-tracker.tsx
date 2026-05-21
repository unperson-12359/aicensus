"use client";

import { useEffect, useRef } from "react";
import { trackComparisonViewed } from "@/lib/analytics";

interface CompareViewTrackerProps {
  slugs: string[];
}

export function CompareViewTracker({ slugs }: CompareViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || slugs.length < 2) return;
    tracked.current = true;
    trackComparisonViewed(slugs);
  }, [slugs]);

  return null;
}
