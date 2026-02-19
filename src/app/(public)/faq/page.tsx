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
    "Find answers to common questions about AiCensus, our AI tools directory, free portfolio feature, and featured listings.",
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
          "AiCensus is a platform with two sides: a curated directory of AI tools (so you can discover and compare what's out there) and a free portfolio feature for builders (so you can showcase projects you've built with AI tools like Cursor, Bolt, Lovable, and more).",
      },
      {
        question: "Is AiCensus free to use?",
        answer:
          "Yes. Browsing the directory, creating an account, setting up your portfolio, and adding projects are all completely free. We offer a paid Featured listing for tool makers who want priority placement.",
      },
      {
        question: "Who is AiCensus for?",
        answer:
          "Anyone interested in AI tools — whether you're looking for the right tool for a project, you're a builder who wants to showcase your work, or you're a tool maker who wants more visibility.",
      },
    ],
  },
  {
    title: "Portfolio",
    items: [
      {
        question: "What is the portfolio feature?",
        answer:
          "It's a free public profile page at aicensus.xyz/portfolio/your-username where you can showcase the projects you've built with AI tools. Add a bio, links, and as many projects as you want. Visitors can see live previews and contact you directly.",
      },
      {
        question: "Do I need a domain or hosting?",
        answer:
          "No. Your portfolio is hosted on AiCensus for free. You don't need to buy a domain, set up hosting, or configure anything. Just sign up and start adding projects.",
      },
      {
        question: "Can people contact me through my portfolio?",
        answer:
          "Yes. Each portfolio has a built-in contact form. Visitors can send you messages without seeing your email address. You'll find messages in your dashboard.",
      },
      {
        question: "What kind of projects can I showcase?",
        answer:
          "Anything you've built — websites, apps, tools, experiments. It doesn't matter which AI tool you used (Cursor, Bolt, Lovable, Base44, v0, Replit, or anything else). If you built it, it belongs here.",
      },
      {
        question: "Can I make my portfolio private?",
        answer:
          "Yes. You can toggle your profile between public and private in your dashboard settings. Private profiles won't appear in the gallery or search results.",
      },
    ],
  },
  {
    title: "Directory",
    items: [
      {
        question: "How do I submit an AI tool to the directory?",
        answer:
          "Go to the Submit page, fill out the form with your tool's details (name, website, description, pricing), and submit it. Our team reviews every submission before it goes live.",
      },
      {
        question: "How are tools reviewed and listed?",
        answer:
          "Every submission is reviewed by our team. We check that the tool exists, works as described, and provides real value. Approved tools go into the directory with honest descriptions and comparisons.",
      },
      {
        question: "Can I edit my tool listing after it's published?",
        answer:
          "If you need to update your listing, contact us through the contact page and we'll make the changes.",
      },
    ],
  },
  {
    title: "Pricing & Featured Listings",
    items: [
      {
        question: "What does a Featured listing include?",
        answer:
          "Featured tools get priority placement on the homepage, a featured badge, and higher visibility in search results and category pages. It's designed for tool makers who want more exposure.",
      },
      {
        question: "How much does a Featured listing cost?",
        answer:
          "Visit our pricing page for current rates. Featured listings are subscription-based — you can cancel anytime.",
      },
      {
        question: "Can I cancel my Featured subscription?",
        answer:
          "Yes. You can cancel anytime. Your featured placement will remain active until the end of your current billing period.",
      },
    ],
  },
  {
    title: "Account & Technical",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Click Sign Up in the top navigation, enter your email, and verify it. Then set up your username and display name in your dashboard settings.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes. Contact us through the contact page and we'll remove your account and all associated data.",
      },
      {
        question: "I found a bug or have a suggestion. How do I report it?",
        answer:
          "Use the contact page to send us a message. Select 'Bug Report' as the subject and describe what happened. We appreciate all feedback.",
      },
    ],
  },
];

// Flatten all FAQ items for JSON-LD
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
    <>
      <JsonLd data={faqJsonLd} />
      <PageTransition>
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Support
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Can&apos;t find what you&apos;re looking for?{" "}
                <Link
                  href="/contact"
                  className="text-primary hover:underline"
                >
                  Contact us
                </Link>{" "}
                and we&apos;ll get back to you.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-12 space-y-10">
              {faqCategories.map((category) => (
                <div key={category.title}>
                  <h2 className="mb-4 font-display text-lg font-semibold text-primary">
                    {category.title}
                  </h2>
                  <Accordion type="multiple" className="space-y-2">
                    {category.items.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.title}-${index}`}
                        className="rounded-lg border border-border/50 bg-card px-4"
                      >
                        <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
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

          {/* Bottom CTA */}
          <FadeIn delay={0.3}>
            <div className="mt-16 rounded-xl border border-border/50 bg-card p-8 text-center">
              <h3 className="font-display text-xl font-semibold">
                Still have questions?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;re happy to help. Reach out and we&apos;ll get back to you
                as soon as we can.
              </p>
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </PageTransition>
    </>
  );
}
