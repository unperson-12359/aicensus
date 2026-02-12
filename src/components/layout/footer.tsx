import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Directory: [
    { href: "/tools", label: "Browse All Tools" },
    { href: "/categories", label: "Categories" },
    { href: "/submit", label: "Submit a Tool" },
  ],
  Company: [
    { href: "/about", label: "About AiCensus" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-shadow duration-300 group-hover:glow-sm">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Ai<span className="text-primary">Census</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The trusted directory of AI tools. Discover, compare, and choose
              the right AI tools for your workflow.
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AiCensus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
