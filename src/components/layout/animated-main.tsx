"use client";

import { PageTransition } from "@/components/motion";
import { usePathname } from "next/navigation";

export function AnimatedMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <PageTransition key={pathname} className="flex-1">
      {children}
    </PageTransition>
  );
}
