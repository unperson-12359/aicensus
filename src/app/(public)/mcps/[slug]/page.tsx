import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  Github,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, RevealText } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getMcpBySlug,
  getAllMcpSlugs,
  getMcpClientConfig,
  MCP_SERVERS,
  MCP_CATEGORY_LABELS,
  MCP_TRANSPORT_LABELS,
} from "@/lib/mcp-servers";
import { InstallCommand } from "@/components/mcps/install-command";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllMcpSlugs().map((slug) => ({ slug }));
}

/** Tagline plus the first sentence of the description, truncated on a word
 *  boundary to stay within SERP display limits (~160 chars). */
function metaDescription(server: NonNullable<ReturnType<typeof getMcpBySlug>>): string {
  const firstSentence = server.description.match(/^[^.]+\./)?.[0] ?? server.description;
  const candidate = `${server.tagline} ${firstSentence}`.trim();
  const text = candidate.length <= 160 ? candidate : server.tagline;
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function McpHostLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const server = getMcpBySlug(slug);
  if (!server) return { title: "Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const description = metaDescription(server);

  return {
    title: `${server.name} MCP Server — Setup, Tools, Use Cases`,
    description,
    openGraph: {
      title: `${server.name} MCP Server`,
      description: server.tagline,
      url: `/mcps/${slug}`,
    },
    twitter: { card: "summary_large_image", title: `${server.name} MCP Server`, description },
    alternates: { canonical: `${siteUrl}/mcps/${slug}` },
  };
}

export default async function McpDetailPage({ params }: Props) {
  const { slug } = await params;
  const server = getMcpBySlug(slug);
  if (!server) notFound();

  const related = MCP_SERVERS.filter(
    (s) => s.slug !== server.slug && s.category === server.category
  ).slice(0, 4);
  if (related.length < 4) {
    const more = MCP_SERVERS.filter(
      (s) => s.slug !== server.slug && s.category !== server.category
    ).slice(0, 4 - related.length);
    related.push(...more);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const clientConfig = getMcpClientConfig(server);

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: `${server.name} MCP Server`,
    codeRepository: server.repoUrl,
    description: server.description,
    author: { "@type": "Organization", name: server.maintainer },
    url: `${siteUrl}/mcps/${slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "MCP Servers", item: `${siteUrl}/mcps` },
      { "@type": "ListItem", position: 3, name: server.name },
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "MCP Servers", href: "/mcps" },
              { label: server.name },
            ]}
          />
        </FadeIn>

        {/* Hero */}
        <FadeIn>
          <div className="mt-6 sm:mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                § MCP Server · {MCP_CATEGORY_LABELS[server.category]}
              </p>
              {server.official && (
                <Badge variant="outline" className="text-[10px]">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Official
                </Badge>
              )}
            </div>
            <div className="mt-4 sm:mt-5">
              <RevealText>
                <h1 className="font-serif text-[clamp(2rem,6vw,4rem)] font-normal leading-[0.98] tracking-[-0.035em]">
                  {server.name}
                  <span className="text-white/35">.</span>
                </h1>
              </RevealText>
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
              by {server.maintainer}
            </p>
            <p className="mt-5 max-w-2xl font-serif text-base italic leading-relaxed text-white/80 sm:text-lg">
              {server.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <a href={server.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-1.5 h-4 w-4" />
                  Repository
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </a>
              </Button>
              {server.docsUrl && server.docsUrl !== server.repoUrl && (
                <Button variant="outline" asChild>
                  <a href={server.docsUrl} target="_blank" rel="noopener noreferrer">
                    Docs
                    <ExternalLink className="ml-1.5 h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
              Runs in{" "}
              <McpHostLink href="/tools/claude">Claude</McpHostLink>
              {" · "}
              <McpHostLink href="/tools/cursor">Cursor</McpHostLink>
              {" · "}
              <McpHostLink href="/tools/chatgpt">ChatGPT</McpHostLink>
              {" · "}
              <McpHostLink href="/tools/windsurf">Windsurf</McpHostLink>
              {" "}— any MCP-compatible client
            </p>
          </div>
        </FadeIn>

        {/* Install + transports */}
        <FadeIn delay={0.15}>
          <section className="mt-12 grid gap-3 sm:gap-4 lg:grid-cols-3">
            <div className="bento-tile p-5 sm:p-6 lg:col-span-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-white/60" />
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                  Install
                </p>
              </div>
              <InstallCommand command={server.installCommand} />
            </div>
            <div className="bento-tile p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                Transports
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {server.transports.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70"
                  >
                    {MCP_TRANSPORT_LABELS[t]}
                  </span>
                ))}
              </div>
              {server.toolCount && (
                <>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                    Tools exposed
                  </p>
                  <p className="mt-2 font-serif text-2xl italic text-white/85">
                    {server.toolCount}
                  </p>
                </>
              )}
            </div>
          </section>
        </FadeIn>

        {/* Add to your AI client */}
        <FadeIn delay={0.2}>
          <section className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                § Add to your AI client
              </p>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            {clientConfig ? (
              <>
                <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
                  Drop this into your client&apos;s MCP config —{" "}
                  <code className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[0.85em] text-white/85">
                    claude_desktop_config.json
                  </code>{" "}
                  for Claude Desktop, or{" "}
                  <code className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[0.85em] text-white/85">
                    .cursor/mcp.json
                  </code>{" "}
                  for Cursor — then restart the app. Replace placeholder paths
                  and credentials with your own.
                </p>
                <pre className="mt-4 max-w-3xl overflow-x-auto rounded-lg border border-white/10 bg-black p-4 text-xs leading-relaxed text-white/85 sm:text-sm">
                  <code>{clientConfig}</code>
                </pre>
              </>
            ) : (
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
                {server.name} runs as a hosted remote MCP server — nothing to
                install locally. Connect it from your client&apos;s MCP
                settings using your {server.maintainer} credentials.{" "}
                {server.docsUrl && (
                  <a
                    href={server.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
                  >
                    Setup guide <ExternalLink className="inline h-3 w-3" />
                  </a>
                )}
              </p>
            )}
          </section>
        </FadeIn>

        {/* Description */}
        <FadeIn delay={0.2}>
          <section className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                § About
              </p>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
              {server.description}
            </p>
          </section>
        </FadeIn>

        {/* Features */}
        {server.features.length > 0 && (
          <FadeIn delay={0.2}>
            <section className="mt-14 sm:mt-20">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § Features
                </p>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {server.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm text-white/85"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                    {feat}
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
        )}

        {/* Use cases */}
        {server.useCases.length > 0 && (
          <FadeIn delay={0.2}>
            <section className="mt-14 sm:mt-20">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § Use cases
                </p>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {server.useCases.map((uc, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-sm text-white/75"
                  >
                    {uc}
                  </span>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Related MCP servers */}
        {related.length > 0 && (
          <FadeIn delay={0.2}>
            <section className="mt-20 border-t border-white/10 pt-10 sm:mt-28">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                  § Related MCP servers
                </p>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/mcps/${s.slug}`}
                    className="bento-tile group flex flex-col gap-2 p-4 transition-colors hover:border-white/30 sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-serif text-base text-white/85 sm:text-lg">
                        {s.name}
                      </p>
                      <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white" />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                      by {s.maintainer}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/mcps"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
                >
                  All {MCP_SERVERS.length} MCP servers <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </section>
          </FadeIn>
        )}

        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-2 sm:mt-14">
            <Badge variant="outline" className="text-[11px]">
              <Sparkles className="mr-1 h-3 w-3" /> Open standard
            </Badge>
            <Link
              href="/contact"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
            >
              Submit a server →
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
