import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, RevealText } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { BEST_FOR_PAGES } from "@/lib/best-for";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best AI Tools by Use Case | AiCensus",
  description:
    "Curated picks of the best AI tools for every persona and job — solo founders, PMs, marketers, designers, students, podcasters, researchers, and more.",
  alternates: { canonical: "/best" },
};

export default function BestForIndex() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best AI Tools by Use Case",
    description:
      "Curated picks of the best AI tools for every persona and job — solo founders, PMs, marketers, designers, students, and more.",
    url: `${siteUrl}/best`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: BEST_FOR_PAGES.length,
      itemListElement: BEST_FOR_PAGES.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebPage",
          name: page.title,
          url: `${siteUrl}/best/${page.slug}`,
        },
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionLd} />
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Best of" },
          ]}
        />
      </FadeIn>

      <FadeIn>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
          § Best of · {BEST_FOR_PAGES.length} curated lists
        </p>
        <div className="mt-4 sm:mt-5">
          <RevealText>
            <h1 className="font-serif text-[clamp(2rem,6.5vw,4.75rem)] font-normal leading-[0.95] tracking-[-0.035em]">
              Pick by{" "}
              <em className="font-serif italic text-white/50">job</em>.
            </h1>
          </RevealText>
        </div>
        <p className="mt-5 max-w-xl font-serif text-base italic leading-relaxed text-white/70 sm:text-lg">
          Curated picks of the best AI tools for every persona and use case —
          ranked, opinionated, refreshed quarterly.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {BEST_FOR_PAGES.map((page) => {
            const lastWord = page.title.split(" ").pop() ?? page.title;
            const prefix = page.title
              .replace(/^Best /, "")
              .split(" ")
              .slice(0, -1)
              .join(" ");
            return (
              <Link
                key={page.slug}
                href={`/best/${page.slug}`}
                className="bento-tile group relative flex h-full flex-col p-5 transition-colors hover:border-white/30 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-xl font-normal leading-tight tracking-[-0.02em] sm:text-2xl">
                    <span className="text-white">{prefix} </span>
                    <em className="italic text-white/55">{lastWord}</em>
                    <span className="text-white/35">.</span>
                  </h2>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
                <p className="mt-3 font-serif text-sm italic leading-relaxed text-white/65">
                  {page.tagline}
                </p>
                <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
                    {page.picks.length} picks
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors group-hover:text-white sm:text-[11px]">
                    Read →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </FadeIn>
    </div>
    </>
  );
}
