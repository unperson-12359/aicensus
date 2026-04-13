"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { href: "/tools", label: "Browse Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/submit", label: "Submit Tool" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

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
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-tight">
            <span className="text-primary">Ai</span>Census
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors duration-150",
                isActive(link.href)
                  ? "bg-foreground/8 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/tools?q=">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <User className="h-4 w-4" />
              </Button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-popover p-1 shadow-lg">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">
                Sign In
              </Button>
            </Link>
          )}
          <Link href="/submit">
            <Button size="sm">
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
                <div className="mb-3 flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
              <div className="border-t border-border pt-4">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="mb-2 w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full text-destructive"
                      onClick={() => {
                        handleSignOut();
                        setOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="mb-2 w-full">
                      Sign In
                    </Button>
                  </Link>
                )}
                <Link href="/submit" onClick={() => setOpen(false)}>
                  <Button className="w-full">Submit Tool</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
