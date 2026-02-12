"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/tools", label: "Browse Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/submit", label: "Submit Tool" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300",
        scrolled
          ? "border-border/50 bg-background/95 shadow-sm"
          : "border-transparent bg-background/80"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Ai<span className="text-primary">Census</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-primary after:transition-transform after:duration-300",
                isActive(link.href)
                  ? "text-foreground after:scale-x-100"
                  : "text-muted-foreground hover:text-foreground after:scale-x-0 hover:after:scale-x-100 after:origin-left"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/tools?q=">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/submit">
            <Button size="sm" className="glow-sm">
              Submit Tool
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-3 text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 border-t border-border pt-4">
                <Link href="/submit" onClick={() => setOpen(false)}>
                  <Button className="w-full glow-sm">Submit Tool</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
