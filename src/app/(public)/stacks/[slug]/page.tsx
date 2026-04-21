import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn, RevealText } from "@/components/motion";
import { ToolCard } from "@/components/tools/tool-card";
import { JsonLd } from "@/components/shared/json-ld";
import {
  stacks,
  getStackBySlug,
  getAllStackSlugs,
  CONSTRAINT_LABELS,
  type Stack,
} from "@/lib/stacks";
import { getToolsBySlugs } from "@/lib/queries/tools";
import type { ToolWithCategory } from "@/lib/types/database";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllStackSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stack = getStackBySlug(slug);

  if (!stack) {
    return { title: "Stack not found — AiCensus" };
  }

  return {
    title: `${stack.name} — Stack | AiCensus`,
    description: `${stack.tagline} ${stack.heroTakeaway}`.slice(0, 300),
    alternates: { canonical: `/stacks/${stack.slug}` },
    openGraph: {
      title: `${stack.name} — AI tool recipe`,
      description: stack.tagline,
      url: `/stacks/${stack.slug}`,
    },
  };
}

function splitNameForEmphasis(name: string) {
  const words = name.split(" ");
  const prefix = words.slice(0, -1).join(" ");
  const emphasis = words[words.length - 1];
  return { prefix, emphasis };
}

function getNextStack(current: Stack): Stack {
  const idx = stacks.findIndex((s) => s.slug === current.slug);
  const next = stacks[(idx + 1) % stacks.length];
  return next;
}

export default async function StackDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const stack = getStackBySlug(slug);

  if (!stack) notFound();

  const slugs = stack.steps.map((s) => s.toolSlug);

  let tools: ToolWithCategory[] = [];
  try {
    tools = await getToolsBySlugs(slugs);
  } catch {
    tools = [];
  }

  const toolMap = new Map<string, ToolWithCategory>();
  for (const t of tools) toolMap.set(t.slug, t);

  const nextStack = getNextStack(stack);
  const { prefix, emphasis } = splitNameForEmphasis(stack.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: stack.name,
    description: stack.heroTakeaway,
    step: stack.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.role,
      text: step.why,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <FadeIn>
        <Link
          href="/stacks"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
        >
          <ArrowLeft className="h-3 w-3" />
          Stacks
        </Link>
      </FadeIn>

      {/* Hero */}
      <div className="mt-8 sm:mt-10">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
            § Recipe
          </p>
        </FadeIn>

        <div className="mt-4 sm:mt-5">
          <RevealText>
            <h1 className="font-serif text-[clamp(2rem,6.5vw,4.75rem)] font-normal leading-[0.95] tracking-[-0.035em]">
              {prefix && <span className="text-white">{prefix} </span>}
              <em className="font-serif italic text-white/50">{emphasis}</em>
              <span className="text-white/35">.</span>
            </h1>
          </RevealText>
        </div>

        <FadeIn delay={0.15}>
          <p className="mt-5 max-w-[650px] font-serif text-base italic leading-relaxed text-white/75 sm:text-lg">
            {stack.heroTakeaway}
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {stack.constraints.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/65"
              >
                {CONSTRAINT_LABELS[c]}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Main content: sidebar + steps */}
      <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-12 lg:items-start lg:gap-10">
        {/* Sidebar TOC */}
        <aside className="hidden lg:col-span-3 lg:sticky lg:top-20 lg:block lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
            Steps
          </p>
          <ol className="mt-4 space-y-3 border-l border-white/10 pl-5">
            {stack.steps.map((step, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <li key={step.toolSlug}>
                  <a
                    href={`#step-${num}`}
                    className="group flex items-baseline gap-3 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 group-hover:text-white/70">
                      {num}
                    </span>
                    <span className="font-serif italic">{step.role}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Steps */}
        <div className="lg:col-span-9">
          <ol className="space-y-14 sm:space-y-20">
            {stack.steps.map((step, i) => {
              const num = String(i + 1).padStart(2, "0");
              const tool = toolMap.get(step.toolSlug);
              return (
                <li
                  key={step.toolSlug}
                  id={`step-${num}`}
                  className="scroll-mt-24"
                >
                  <FadeIn>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                      {step.role}
                    </p>
                    <div className="mt-2 flex items-baseline gap-4">
                      <span className="font-serif text-5xl italic leading-none text-white/25 sm:text-6xl">
                        {num}
                      </span>
                      <span className="h-px flex-1 translate-y-[-0.2em] bg-white/10" />
                    </div>
                  </FadeIn>

                  <div className="mt-6">
                    {tool ? (
                      <ToolCard tool={tool} />
                    ) : (
                      <StepPlaceholder slug={step.toolSlug} role={step.role} />
                    )}
                  </div>

                  <FadeIn delay={0.1}>
                    <p className="mt-5 max-w-[640px] font-serif text-base italic leading-relaxed text-white/75">
                      {step.why}
                    </p>
                  </FadeIn>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Next recipe */}
      <div className="mt-20 border-t border-white/10 pt-10 sm:mt-28">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
          Next recipe
        </p>
        <Link
          href={`/stacks/${nextStack.slug}`}
          className="bento-tile group mt-4 flex flex-col gap-4 p-6 hover:border-white/30 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <h2 className="font-serif text-2xl font-normal leading-tight tracking-[-0.02em] sm:text-3xl">
              <NextStackName name={nextStack.name} />
            </h2>
            <p className="mt-2 font-serif text-sm italic leading-relaxed text-white/65 sm:text-base">
              {nextStack.tagline}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 transition-colors group-hover:text-white sm:text-[11px]">
            Open
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function NextStackName({ name }: { name: string }) {
  const { prefix, emphasis } = splitNameForEmphasis(name);
  return (
    <>
      {prefix && <span className="text-white">{prefix} </span>}
      <em className="italic text-white/55">{emphasis}</em>
      <span className="text-white/35">.</span>
    </>
  );
}

function StepPlaceholder({ slug, role }: { slug: string; role: string }) {
  return (
    <div className="bento-tile flex items-start gap-4 p-5 sm:p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/5 text-base font-bold text-white/60">
        {slug.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
          Unlisted · {role}
        </p>
        <p className="mt-1 font-serif text-lg italic text-white/80">{slug}</p>
        <p className="mt-1 text-sm text-white/50">
          This tool isn&apos;t in the directory yet.
        </p>
      </div>
    </div>
  );
}
