import type { Metadata } from "next";
import { FadeIn } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PromptBuilder } from "@/components/prompt-builder/prompt-builder";

export const metadata: Metadata = {
  title: "AI Prompt Builder | AiCensus",
  description:
    "Build structured prompts for research, comparison, coding, content, and workflow tasks. Choose the goal, audience, model style, tone, constraints, format, context, and examples.",
  alternates: { canonical: "/prompt-builder" },
};

export default function PromptBuilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Prompt Builder" },
          ]}
        />
      </FadeIn>

      <FadeIn>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
          Prompt workspace
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Build a sharper AI prompt.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Turn a loose request into a structured prompt with the right goal,
            audience, model style, tone, constraints, output format, context,
            and examples.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <PromptBuilder />
      </FadeIn>
    </div>
  );
}
