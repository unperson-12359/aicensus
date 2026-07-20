import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, PageTransition } from "@/components/motion";
import { JsonLd } from "@/components/shared/json-ld";
import { getAllToolsForIndex } from "@/lib/queries/tools";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All AI Tools, A–Z",
  description:
    "The complete AiCensus directory, A–Z. Every published AI tool as a plain link — no filters, no pagination.",
  alternates: { canonical: "/tools/all" },
};

function groupByLetter(tools: { slug: string; name: string }[]) {
  const groups = new Map<string, { slug: string; name: string }[]>();
  for (const tool of tools) {
    const first = tool.name.trim().charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(first) ? first : "#";
    const list = groups.get(letter);
    if (list) list.push(tool);
    else groups.set(letter, [tool]);
  }
  return Array.from(groups.entries()).sort(([a], [b]) =>
    a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)
  );
}

export default async function AllToolsPage() {
  // DB failures throw to the error boundary rather than rendering an empty index.
  const tools = await getAllToolsForIndex();
  const groups = groupByLetter(tools);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All AI Tools, A–Z",
    url: `${siteUrl}/tools/all`,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.name,
        url: `${siteUrl}/tools/${tool.slug}`,
      },
    })),
  };

  return (
    <PageTransition>
      <JsonLd data={itemListJsonLd} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            The directory
          </p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
            All AI tools, <em className="italic text-white/60">A–Z</em>.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            Every published tool in the directory, alphabetically.{" "}
            {tools.length} tools and counting.
          </p>
        </FadeIn>

        {groups.length > 1 && (
          <FadeIn delay={0.1}>
            <nav
              aria-label="Jump to letter"
              className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5"
            >
              {groups.map(([letter]) => (
                <a
                  key={letter}
                  href={`#letter-${letter === "#" ? "other" : letter}`}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
                >
                  {letter}
                </a>
              ))}
            </nav>
          </FadeIn>
        )}

        <FadeIn delay={0.15}>
          <div className="mt-10 space-y-10">
            {groups.map(([letter, letterTools]) => (
              <section
                key={letter}
                id={`letter-${letter === "#" ? "other" : letter}`}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-4">
                  <h2 className="font-serif text-2xl italic leading-none text-white/80">
                    {letter}
                  </h2>
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                    {letterTools.length}{" "}
                    {letterTools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>
                <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  {letterTools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-sm text-white/75 transition-colors hover:text-white"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
