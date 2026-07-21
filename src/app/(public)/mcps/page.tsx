import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Github, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FadeIn, RevealText } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import {
  MCP_SERVERS,
  MCP_CATEGORY_LABELS,
  MCP_CATEGORIES_IN_USE,
  type McpCategory,
} from "@/lib/mcp-servers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "MCP Server Directory — Index of Model Context Protocol Servers",
  description:
    "Curated directory of MCP (Model Context Protocol) servers — the open standard for connecting AI agents to filesystems, databases, search, GitHub, Slack, and more. Maintained, ranked, and reviewed.",
  alternates: { canonical: "/mcps" },
  openGraph: {
    title: "MCP Server Directory — AiCensus",
    description:
      "The places to find MCP servers worth running. Filesystem, Git, GitHub, Postgres, Slack, Notion, and more — with install commands and use cases.",
  },
};

function groupByCategory() {
  const groups = new Map<McpCategory, typeof MCP_SERVERS>();
  for (const cat of MCP_CATEGORIES_IN_USE) {
    groups.set(cat, MCP_SERVERS.filter((s) => s.category === cat));
  }
  return groups;
}

export default function McpsIndex() {
  const groups = groupByCategory();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MCP Server Directory",
    description:
      "Index of Model Context Protocol servers for connecting AI agents to external systems",
    url: `${siteUrl}/mcps`,
    numberOfItems: MCP_SERVERS.length,
    itemListElement: MCP_SERVERS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: s.name,
        codeRepository: s.repoUrl,
        description: s.tagline,
        url: `${siteUrl}/mcps/${s.slug}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemListLd} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "MCP Servers" }]}
          />
        </FadeIn>

        <FadeIn>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
            § MCP Servers · {MCP_SERVERS.length} indexed
          </p>
          <div className="mt-4 sm:mt-5">
            <RevealText>
              <h1 className="font-serif text-[clamp(2rem,6.5vw,4.75rem)] font-normal leading-[0.95] tracking-[-0.035em]">
                Model{" "}
                <em className="font-serif italic text-white/50">Context</em>{" "}
                Protocol<span className="text-white/35">.</span>
              </h1>
            </RevealText>
          </div>
          <p className="mt-5 max-w-2xl font-serif text-base italic leading-relaxed text-white/75 sm:text-lg">
            The open standard for connecting AI agents to the outside world.
            Pick a server, run it locally or remotely, and your agent gains
            real tools — files, databases, GitHub, Slack, the lot.
          </p>
        </FadeIn>

        {/* What is MCP? */}
        <FadeIn delay={0.15}>
          <section className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-3">
            <div className="bento-tile p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                What it is
              </p>
              <p className="mt-3 font-serif text-base italic leading-relaxed text-white/80">
                An open protocol from Anthropic that lets any AI client talk to
                any tool server through a uniform interface.
              </p>
            </div>
            <div className="bento-tile p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                Why it matters
              </p>
              <p className="mt-3 font-serif text-base italic leading-relaxed text-white/80">
                Build a server once, use it from Claude Desktop, Cursor,
                Cline, ChatGPT, and dozens of agent frameworks. No more
                rewriting integrations per host.
              </p>
            </div>
            <div className="bento-tile p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                Who uses it
              </p>
              <p className="mt-3 font-serif text-base italic leading-relaxed text-white/80">
                Anthropic, GitHub, Notion, Linear, Stripe, Vercel, Cloudflare,
                Sentry, and a fast-growing community. The list of first-party
                MCP servers is now the integration surface to watch.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Servers grouped by category */}
        <div className="mt-14 space-y-12 sm:mt-20 sm:space-y-16">
          {Array.from(groups.entries()).map(([category, servers]) => (
            <FadeIn key={category} delay={0.1}>
              <section>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-serif text-lg italic leading-tight tracking-[-0.02em] text-white/85 sm:text-xl">
                    {MCP_CATEGORY_LABELS[category]}
                  </h2>
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                    {servers.length} {servers.length === 1 ? "server" : "servers"}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {servers.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/mcps/${s.slug}`}
                      className="bento-tile group relative flex h-full flex-col p-5 transition-colors hover:border-white/30 sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-serif text-xl leading-tight tracking-[-0.02em] sm:text-2xl">
                            <span className="text-white">{s.name}</span>
                            <span className="text-white/35">.</span>
                          </h3>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                            by {s.maintainer}
                          </p>
                        </div>
                        {s.official && (
                          <ShieldCheck
                            className="h-4 w-4 shrink-0 text-white/55"
                            role="img"
                            aria-label="Official"
                          />
                        )}
                      </div>
                      <p className="mt-3 font-serif text-sm italic leading-relaxed text-white/65">
                        {s.tagline}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                          {s.toolCount ? `${s.toolCount} tools` : "MCP server"}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </FadeIn>
          ))}
        </div>

        {/* Footer */}
        <FadeIn delay={0.2}>
          <section className="mt-20 flex flex-wrap items-center gap-3 border-t border-white/10 pt-10 sm:mt-28">
            <Badge variant="outline" className="text-[11px]">
              <Github className="mr-1.5 h-3 w-3" /> Open standard
            </Badge>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
              Runs in
            </span>
            {[
              { href: "/tools/claude", label: "Claude" },
              { href: "/tools/cursor", label: "Cursor" },
              { href: "/tools/chatgpt", label: "ChatGPT" },
              { href: "/tools/windsurf", label: "Windsurf" },
            ].map((host) => (
              <Link
                key={host.href}
                href={host.href}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
              >
                {host.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
            >
              Suggest an MCP server →
            </Link>
          </section>
        </FadeIn>
      </div>
    </>
  );
}
