import type { Metadata } from "next";
import { FadeIn, RevealText } from "@/components/motion";
import { StacksBrowser } from "@/components/stacks/stacks-browser";
import { getToolsBySlugs } from "@/lib/queries/tools";
import { getLogoUrl } from "@/lib/utils";
import { stacks, getAllUseCases } from "@/lib/stacks";

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

  const useCases = getAllUseCases();

  return (
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

      <StacksBrowser
        stacks={stacks}
        logos={logoMap}
        allUseCases={useCases}
      />
    </div>
  );
}
