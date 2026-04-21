"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/submit", label: "Submit" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
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
      setScrolled(window.scrollY > 8);
    }
    onScroll();
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
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-white/10 bg-black"
          : "border-transparent bg-black"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2" aria-label="AiCensus home">
          <span className="font-display text-lg font-bold tracking-tight text-white">
            AiCensus<span className="text-white/40">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-150",
                isActive(link.href)
                  ? "bg-white text-black"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/10"
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
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-white/10 bg-popover p-1 shadow-2xl">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/5"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/5">
                Sign in
              </Button>
            </Link>
          )}
          <Link href="/submit">
            <Button size="sm">Submit tool</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
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
                    "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-white text-black"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6 border-t border-white/10 pt-6">
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
                      className="w-full text-white/80"
                      onClick={() => {
                        handleSignOut();
                        setOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="mb-2 w-full">
                      Sign in
                    </Button>
                  </Link>
                )}
                <Link href="/submit" onClick={() => setOpen(false)}>
                  <Button className="w-full">Submit tool</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
