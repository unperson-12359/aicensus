import type { Metadata } from "next";
import Link from "next/link";
import { Wand2, ArrowRight } from "lucide-react";
import { FadeIn, RevealText } from "@/components/motion";
import { JsonLd } from "@/components/shared/json-ld";
import { StacksBrowser } from "@/components/stacks/stacks-browser";
import { getToolsBySlugs } from "@/lib/queries/tools";
import { getLogoUrl } from "@/lib/utils";
import { stacks } from "@/lib/stacks";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Stacks — Opinionated AI tool recipes | AiCensus",
  description:
    "15 battle-tested AI tool combos for shipping real things. From SaaS to podcasts — pick a recipe, start building.",
  alternates: { canonical: "/stacks" },
  openGraph: {
    title: "Stacks — Opinionated AI tool recipes",
    description:
      "15 battle-tested AI tool combos for shipping real things. Pick a recipe, start building.",
  },
};

export default async function StacksIndexPage() {
  // Gather every unique tool slug across all stacks for thumbnail fetching.
  const uniqueSlugs = Array.from(
    new Set(stacks.flatMap((s) => s.steps.map((step) => step.toolSlug)))
  );

  let tools: Awaited<ReturnType<typeof getToolsBySlugs>> = [];
  try {
    tools = await getToolsBySlugs(uniqueSlugs);
  } catch {
    // Supabase not configured — browser renders with letter fallbacks.
  }

  // Map slug → { name, logoSrc } for the client filter UI.
  const logoMap: Record<string, { name: string; logoSrc: string | null }> = {};
  for (const t of tools) {
    logoMap[t.slug] = {
      name: t.name,
      logoSrc: getLogoUrl(t.logo_url, t.website_url),
    };
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AI Tool Stacks",
          description:
            "Opinionated, battle-tested AI tool recipes for shipping real projects.",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co"}/stacks`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: stacks.length,
            itemListElement: stacks.map((stack, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "WebPage",
                name: stack.name,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co"}/stacks/${stack.slug}`,
              },
            })),
          },
        }}
      />
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
          § Stacks
        </p>
      </FadeIn>

      <div className="mt-4 sm:mt-5">
        <RevealText>
          <h1 className="font-serif text-[clamp(2rem,6.5vw,4.75rem)] font-normal leading-[0.95] tracking-[-0.035em]">
            Build by{" "}
            <em className="font-serif italic text-white/50">recipe</em>.
          </h1>
        </RevealText>
      </div>

      <FadeIn delay={0.15}>
        <p className="mt-5 max-w-xl font-serif text-base italic leading-relaxed text-white/70 sm:text-lg">
          {stacks.length} opinionated, battle-tested AI tool combos — pick one,
          start building.
        </p>
      </FadeIn>

      {/* Stack builder CTA */}
      <FadeIn delay={0.2}>
        <Link
          href="/stacks/build"
          className="bento-tile group mt-8 flex items-center justify-between gap-4 p-5 transition-colors hover:border-white/30 sm:mt-10 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] sm:h-12 sm:w-12">
              <Wand2 className="h-5 w-5 text-white/75" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                New · Stack builder
              </p>
              <h2 className="mt-1 font-serif text-xl italic leading-tight tracking-[-0.02em] sm:text-2xl">
                Build your own stack interactively.
              </h2>
              <p className="mt-1 font-serif text-sm italic text-white/65">
                Pick capabilities, set constraints, share the result.
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-white/40 transition-colors group-hover:text-white" />
        </Link>
      </FadeIn>

      <StacksBrowser stacks={stacks} logos={logoMap} />
    </div>
    </>
  );
}
