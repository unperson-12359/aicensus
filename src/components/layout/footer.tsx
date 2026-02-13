import Link from "next/link";

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
              <svg className="h-8 w-8 text-primary transition-shadow duration-300 group-hover:drop-shadow-[0_0_8px_oklch(0.65_0.2_250)]" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9.5" y="9.5" width="13" height="13" rx="1" transform="rotate(45 16 16)" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="2.5" fill="currentColor" />
              </svg>
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

        <div className="mt-12 pt-8">
          {/* Bauhaus geometric divider */}
          <div className="geo-divider mb-8">
            <span className="geo-divider-line" />
            <span className="geo-divider-dot" />
            <span className="geo-divider-dot" style={{ background: "oklch(0.55 0.2 290 / 30%)" }} />
            <span className="geo-divider-dot" />
            <span className="geo-divider-line" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AiCensus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
