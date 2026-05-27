import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { FadeIn, RevealText } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { StackExplorer, type ExplorerTool } from "@/components/stacks/stack-explorer";
import { CAPABILITIES } from "@/lib/stack-explorer";
import { getToolsBySlugs } from "@/lib/queries/tools";

// Disable static prerender — this page uses useSearchParams for shareable
// state, so it must render dynamically.
export const dynamic = "force-dynamic";

const BASE_METADATA: Metadata = {
  title: "AI Stack Builder — Pick Your AI Tools by Capability | AiCensus",
  description:
    "Build your own AI stack interactively. Pick the capabilities you need, set your constraints (free, OSS, high-rated), and get a tool recommendation per capability — shareable as a URL.",
  alternates: { canonical: "/stacks/build" },
  openGraph: {
    title: "AI Stack Builder — AiCensus",
    description:
      "Pick the capabilities you need, set your constraints, and we'll match the best tool to each. Shareable.",
  },
};

interface StackBuildSearchParams {
  caps?: string;
  free?: string;
  oss?: string;
  hr?: string;
  o?: string;
}

function hasStackBuilderParams(params: StackBuildSearchParams): boolean {
  return Boolean(
    params.caps || params.free || params.oss || params.hr || params.o
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<StackBuildSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;

  if (!hasStackBuilderParams(params)) {
    return BASE_METADATA;
  }

  return {
    ...BASE_METADATA,
    robots: { index: false, follow: true },
  };
}

export default async function StackBuildPage() {
  // Pull every tool referenced by the capability catalog so the client has
  // them available without an API round-trip per swap.
  const allReferenced = Array.from(
    new Set(CAPABILITIES.flatMap((c) => c.toolSlugs))
  );

  let tools: ExplorerTool[] = [];
  try {
    const rows = await getToolsBySlugs(allReferenced);
    tools = rows.map((t) => ({
      slug: t.slug,
      name: t.name,
      tagline: t.tagline,
      pricing_model: t.pricing_model,
      editor_rating: t.editor_rating,
      logo_url: t.logo_url,
      website_url: t.website_url,
      category_name: t.categories?.name ?? null,
    }));
  } catch {
    tools = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Stacks", href: "/stacks" },
            { label: "Build" },
          ]}
        />
      </FadeIn>

      {/* Hero */}
      <FadeIn>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
          § Stack builder · {CAPABILITIES.length} capabilities
        </p>
        <div className="mt-4 sm:mt-5">
          <RevealText>
            <h1 className="font-serif text-[clamp(2rem,6.5vw,4.75rem)] font-normal leading-[0.95] tracking-[-0.035em]">
              Build your{" "}
              <em className="font-serif italic text-white/50">stack</em>.
            </h1>
          </RevealText>
        </div>
        <p className="mt-5 max-w-xl font-serif text-base italic leading-relaxed text-white/75 sm:text-lg">
          Pick the capabilities you need, set your constraints, and we&apos;ll
          match the best tool to each one. The URL updates as you go — share
          it with anyone.
        </p>

        <div className="mt-6">
          <Link href="/stacks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              All curated stacks
            </Button>
          </Link>
        </div>
      </FadeIn>

      {tools.length === 0 ? (
        <FadeIn delay={0.15}>
          <div className="mt-14 border border-dashed border-white/15 p-10 text-center">
            <p className="font-serif text-2xl italic text-white/80">
              No tools loaded yet.
            </p>
            <p className="mt-2 text-sm text-white/55">
              Once Supabase is connected and seeded, the Stack Builder will
              light up automatically.
            </p>
            <div className="mt-5">
              <Link href="/tools">
                <Button variant="outline" size="sm">Browse the directory</Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      ) : (
        <Suspense
          fallback={
            <div className="mt-10 text-sm text-white/55">Loading stack builder…</div>
          }
        >
          <StackExplorer tools={tools} />
        </Suspense>
      )}
    </div>
  );
}
