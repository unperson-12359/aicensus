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
  title: "Frequently Asked Questions — AiCensus",
  description:
    "Common questions about the AiCensus AI tools directory and featured listings.",
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
          "AiCensus is a curated directory of AI tools. Every tool is reviewed by a human — we compare pricing, use cases, pros and cons, and list the tools that actually deliver.",
      },
      {
        question: "Is AiCensus free to use?",
        answer:
          "Yes. Browsing the directory, comparing tools, and reading reviews are completely free. We offer a paid Featured listing for tool makers who want priority placement.",
      },
      {
        question: "Who is AiCensus for?",
        answer:
          "Anyone looking for the right AI tool for a project — builders, founders, researchers, students — and tool makers who want to be discovered.",
      },
    ],
  },
  {
    title: "The directory",
    items: [
      {
        question: "How are tools reviewed and listed?",
        answer:
          "Every tool on AiCensus is tested by our team. We check that the tool exists, works as described, and provides real value. No scraping, no affiliate-driven ranking.",
      },
      {
        question: "How often is the directory updated?",
        answer:
          "We add new tools weekly and revisit existing listings to refresh pricing and ratings.",
      },
      {
        question: "Do you accept tool submissions?",
        answer:
          "We review new tools on an ongoing basis. Reach out through the contact page if you'd like us to consider yours.",
      },
    ],
  },
  {
    title: "Pricing & featured listings",
    items: [
      {
        question: "What does a Featured listing include?",
        answer:
          "Featured tools get priority placement on the homepage, a featured badge, and higher visibility in search and category pages. Designed for tool makers who want real exposure.",
      },
      {
        question: "How much does a Featured listing cost?",
        answer:
          "Visit the pricing page for current rates. Featured listings are subscription-based and you can cancel anytime.",
      },
      {
        question: "Can I cancel my Featured subscription?",
        answer:
          "Yes. Cancel anytime — your featured placement stays active until the end of your current billing period.",
      },
    ],
  },
  {
    title: "Technical",
    items: [
      {
        question: "I found a bug or have a suggestion. How do I report it?",
        answer:
          "Use the contact page to send us a message — pick 'Bug report' as the subject and describe what happened.",
      },
      {
        question: "Is AiCensus open source?",
        answer:
          "The directory itself isn't open source, but we publish technical posts and reviews on the blog.",
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
            Quick answers about the directory, featured listings, and how the
            platform works.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-8 space-y-8">
            {faqCategories.map((cat) => (
              <div key={cat.title}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                  {cat.title}
                </h2>
                <Accordion type="single" collapsible className="mt-3">
                  {cat.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`${cat.title}-${i}`}
                      className="border-white/10"
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
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
            <p className="font-serif text-lg italic text-white/80 sm:text-xl">
              Still have a question?
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
            >
              Get in touch →
            </Link>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
