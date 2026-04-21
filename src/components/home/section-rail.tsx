"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SectionRailProps {
  sections: { id: string; label: string }[];
}

export function SectionRail({ sections }: SectionRailProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Section progress"
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {sections.map((s, i) => {
        const isActive = active === i;
        return (
          <Link
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center justify-end gap-3"
          >
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300",
                isActive
                  ? "text-white opacity-100"
                  : "text-white/30 opacity-0 group-hover:opacity-100 group-hover:text-white/70"
              )}
            >
              {String(i).padStart(2, "0")} · {s.label}
            </span>
            <span
              className={cn(
                "relative flex h-2.5 w-2.5 items-center justify-center rounded-full border transition-all duration-300",
                isActive
                  ? "border-white bg-white"
                  : "border-white/30 bg-transparent group-hover:border-white/70"
              )}
            >
              {isActive && (
                <span className="absolute -inset-1 rounded-full border border-white/30 animate-ping-slow" />
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
