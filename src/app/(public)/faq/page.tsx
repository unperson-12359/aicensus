import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, PageTransition } from "@/components/motion";
import { JsonLd } from "@/components/shared/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - AiCensus",
  description: "Common questions about the AiCensus AI tools directory.",
  alternates: { canonical: "/faq" },
};

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    title: "General",
    items: [
      {
        question: "What is AiCensus?",
        answer:
          "AiCensus is a curated directory of AI tools. Every tool is reviewed by a human - we compare pricing, use cases, pros and cons, and list the tools that actually deliver.",
      },
      {
        question: "Is AiCensus free to use?",
        answer:
          "Yes - browsing the directory, comparing tools, using the prompt builder, and browsing stack recipes are all free. No account required.",
      },
      {
        question: "Who is AiCensus for?",
        answer:
          "Anyone looking for the right AI tool for a workflow - builders, founders, researchers, students, teams, and anyone curious about the AI ecosystem.",
      },
    ],
  },
  {
    title: "The directory",
    items: [
      {
        question: "How are tools reviewed and listed?",
        answer:
          "Every tool on AiCensus is reviewed by our team. We check that the tool exists, works as described, and provides real value. No scraping, no affiliate-driven ranking.",
      },
      {
        question: "How often is the directory updated?",
        answer:
          "We add new tools regularly and revisit existing listings to refresh pricing, links, ratings, and descriptions.",
      },
      {
        question: "Can I suggest a tool or correction?",
        answer:
          "Yes. We do not run a public submission portal right now, but you can send suggestions, corrections, and missing-tool notes through the contact page.",
      },
    ],
  },
  {
    title: "Technical",
    items: [
      {
        question: "I found a bug or have a suggestion. How do I report it?",
        answer:
          "Use the contact page to send us a message - pick 'Bug report' as the subject and describe what happened.",
      },
      {
        question: "Is AiCensus open source?",
        answer:
          "The directory itself is not open source, but we publish technical posts and reviews on the blog.",
      },
    ],
  },
];

const allFaqItems = faqCategories.flatMap((cat) => cat.items);

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <PageTransition>
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            FAQ
          </p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
            Frequently asked <em className="italic text-white/60">questions</em>.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            Quick answers about the directory and how AiCensus works.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-8 space-y-8">
            {faqCategories.map((category) => (
              <section key={category.title}>
                <h2 className="mb-3 font-display text-lg font-semibold">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.items.map((item, index) => (
                    <AccordionItem
                      key={item.question}
                      value={`${category.title}-${index}`}
                      className="bento-tile border-white/10 px-4"
                    >
                      <AccordionTrigger className="text-left text-sm font-medium hover:no-underline sm:text-base">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center">
            <h2 className="font-display text-xl font-semibold">
              Still have questions?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send us a note and we&apos;ll get back to you.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Contact us
            </Link>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
