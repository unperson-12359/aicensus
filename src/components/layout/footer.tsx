import Link from "next/link";

const footerLinks = {
  Product: [
    { href: "/tools", label: "Browse tools" },
    { href: "/stacks", label: "Stacks" },
    { href: "/ask", label: "Ask AiCensus" },
    { href: "/categories", label: "Categories" },
    { href: "/get-featured", label: "Get featured" },
    { href: "/pricing", label: "Pricing" },
  ],
  Resources: [
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/changelog", label: "What's new" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 rounded-full bg-white" />
              <span className="font-display text-xl font-bold tracking-tight">
                AiCensus<span className="text-white/40">.</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The curated directory of AI tools. Handpicked, reviewed, priced —
              no noise.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="tracking-accent text-white/60">{title}</h3>
              <ul className="mt-4 space-y-2.5">
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

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} AiCensus. All rights reserved.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              est. 2026 · built in the open
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
