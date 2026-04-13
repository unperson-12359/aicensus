import Link from "next/link";

const footerLinks = {
  Product: [
    { href: "/tools", label: "Browse Tools" },
    { href: "/categories", label: "Categories" },
    { href: "/portfolio", label: "Portfolios" },
    { href: "/submit", label: "Submit a Tool" },
    { href: "/get-featured", label: "Get Featured" },
    { href: "/pricing", label: "Pricing" },
  ],
  Resources: [
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/changelog", label: "What's New" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight">
                <span className="text-primary">Ai</span>Census
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The trusted directory of AI tools and a free portfolio for builders.
              Discover tools, showcase your work, and connect with the community.
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-4 space-y-4">
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

        {/* Bottom bar */}
        <div className="mt-12 pt-8">
          <div className="mb-8 h-px bg-border/50" />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AiCensus. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
