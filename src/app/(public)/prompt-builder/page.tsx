import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { PromptBuilder } from "@/components/prompt-builder/prompt-builder";

export const metadata: Metadata = {
  title: "AI Prompt Builder — Free Structured Prompt Generator",
  description:
    "Build structured prompts for research, coding, writing, data analysis, agents, extraction, support, visual generation, and workflow tasks. Free prompt generator with modes, patterns, guardrails, schemas, and separate system/user output.",
  alternates: { canonical: "/prompt-builder" },
  openGraph: {
    title: "AI Prompt Builder — AiCensus",
    description:
      "Turn rough intent into a reusable, structured prompt. Modes, patterns, guardrails, schemas, and separate system/user output for ChatGPT, Claude, Gemini, and agents.",
  },
};

const howItWorks = [
  {
    step: "01",
    title: "Pick a mode",
    body: "Choose the job — research, coding, writing, data, agents, extraction, support, visual, and more. Each mode loads sensible defaults for pattern, tone, source policy, and guardrails.",
  },
  {
    step: "02",
    title: "Add your material",
    body: "Fill in the task, audience, context, and any source input or examples. The coverage checklist shows which parts of a strong prompt you still have missing.",
  },
  {
    step: "03",
    title: "Set the guardrails",
    body: "Toggle behavior rules like no invented facts, uncertainty flagging, and safe tool use. Add must-includes, things to avoid, schemas, and eval cases for reusable prompts.",
  },
  {
    step: "04",
    title: "Copy and ship it",
    body: "Copy the full prompt, or just the system or user half, into ChatGPT, Claude, Gemini, Cursor, or your own agent stack. Download it as a text file to keep it in your prompt library.",
  },
];

const faqs = [
  {
    question: "What makes a good AI prompt?",
    answer:
      "A good prompt is specific about four things: who the model should be, what you want done, what material it is working with, and what a good answer looks like. Vague prompts produce generic answers; the builder forces the specifics that change output quality.",
  },
  {
    question: "Does this work with ChatGPT, Claude, and Gemini?",
    answer:
      "Yes. The generated prompt is plain text with labeled sections, which every major chat model and coding assistant understands. Use the Full output for chat apps, or the separate System and User outputs when wiring prompts into an API or agent framework.",
  },
  {
    question: "What is a prompt pattern?",
    answer:
      "A pattern is a reusable instruction style, such as few-shot (learn from examples), plan-then-answer (reason privately, show a short rationale), critique-and-refine, rubric scoring, extraction, or grounded research. Patterns shape how the model approaches the task, not just what it produces.",
  },
  {
    question: "When should I use an output schema?",
    answer:
      "Use a schema whenever the answer feeds another system — JSON for APIs, pipelines, and extraction tasks. The builder flags schema as missing whenever you pick a JSON output format or the extraction mode, so parseable output is never an afterthought.",
  },
  {
    question: "Is the prompt builder free?",
    answer:
      "Yes. Everything runs in your browser, nothing is uploaded, and there is no account or usage limit. Build as many prompts as you want and keep them in your own library.",
  },
];

const relatedGuides = [
  {
    href: "/blog/how-to-write-better-ai-prompts",
    title: "How to Write Better AI Prompts",
    note: "The practical guide — no prompt-engineering jargon.",
  },
  {
    href: "/blog/understanding-ai-hallucinations",
    title: "Understanding AI Hallucinations",
    note: "Why models invent facts, and which guardrails actually help.",
  },
  {
    href: "/blog/ai-agents-explained",
    title: "AI Agents, Explained",
    note: "What agent prompts need: tools, permissions, stop conditions.",
  },
];

export default function PromptBuilderPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Prompt Builder",
        item: `${siteUrl}/prompt-builder`,
      },
    ],
  };

  const webAppLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AiCensus Prompt Builder",
    url: `${siteUrl}/prompt-builder`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "Free structured prompt generator with modes, patterns, guardrails, schemas, and separate system/user output for chat models, coding assistants, and agents.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webAppLd} />
      <JsonLd data={faqLd} />
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
              Build a prompt for almost any AI task.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Turn rough intent into a reusable prompt with modes, patterns,
              guardrails, schemas, source rules, examples, variables, and separate
              system/user output. Free, runs in your browser, nothing uploaded.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <PromptBuilder />
        </FadeIn>

        {/* How it works */}
        <FadeIn delay={0.15}>
          <section className="mt-16 sm:mt-20">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-lg italic leading-tight tracking-[-0.02em] text-white/85 sm:text-xl">
                How the builder works
              </h2>
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                4 steps
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item) => (
                <div key={item.step} className="bento-tile p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                    {item.step}
                  </p>
                  <h3 className="mt-2 font-serif text-base italic leading-tight text-white/85">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* FAQ */}
        <FadeIn delay={0.2}>
          <section className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-lg italic leading-tight tracking-[-0.02em] text-white/85 sm:text-xl">
                Prompt builder FAQ
              </h2>
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                {faqs.length} answers
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.question} className="bento-tile p-5">
                  <h3 className="text-sm font-medium text-white/90">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Related guides */}
        <FadeIn delay={0.25}>
          <section className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-lg italic leading-tight tracking-[-0.02em] text-white/85 sm:text-xl">
                Keep reading
              </h2>
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                From the journal
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="bento-tile group flex h-full flex-col p-5 transition-colors hover:border-white/30"
                >
                  <BookOpen className="h-4 w-4 text-white/40" />
                  <h3 className="mt-3 font-serif text-base italic leading-tight text-white/85">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {guide.note}
                  </p>
                  <span className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors group-hover:text-white">
                    Read the guide
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6">
              <Link
                href="/tools"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
              >
                Browse AI tools →
              </Link>
              <Link
                href="/mcps"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
              >
                MCP servers for agent prompts →
              </Link>
              <Link
                href="/blog"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
              >
                All guides →
              </Link>
            </div>
          </section>
        </FadeIn>
      </div>
    </>
  );
}
