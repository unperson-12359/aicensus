"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { num: "01", href: "/tools", label: "Tools" },
  { num: "02", href: "/categories", label: "Categories" },
  { num: "03", href: "/blog", label: "Blog" },
  { num: "04", href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-black transition-colors duration-200",
        scrolled ? "border-white/10" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2" aria-label="AiCensus home">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-white transition-transform group-hover:scale-125"
          />
          <span className="font-display text-[15px] font-bold tracking-tight text-white">
            AiCensus<span className="text-white/40">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium tracking-tight transition-colors duration-150",
                isActive(link.href)
                  ? "bg-white text-black"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums",
                  isActive(link.href) ? "text-black/50" : "text-white/40"
                )}
              >
                {link.num}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/tools">
            <Button size="sm">Browse tools</Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 border-white/10 bg-black">
            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-white text-black"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="font-mono text-xs text-current/50">{link.num}</span>
                  {link.label}
                </Link>
              ))}
              <div className="mt-6 border-t border-white/10 pt-6">
                <Link href="/tools" onClick={() => setOpen(false)}>
                  <Button className="w-full">Browse tools</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
