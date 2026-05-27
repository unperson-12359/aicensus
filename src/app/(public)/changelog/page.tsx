import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "What's New - AiCensus",
  description:
    "See what's new on AiCensus. Latest features, improvements, and updates to the AI tools directory.",
  alternates: { canonical: "/changelog" },
};

type EntryType = "feature" | "improvement" | "fix";

interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  type: EntryType;
}

const typeStyles: Record<EntryType, { label: string; className: string }> = {
  feature: {
    label: "New",
    className: "bg-white text-black border-white",
  },
  improvement: {
    label: "Improved",
    className: "bg-white/10 text-white border-white/20",
  },
  fix: {
    label: "Fixed",
    className: "bg-white/5 text-white/60 border-white/10",
  },
};

const entries: ChangelogEntry[] = [
  {
    date: "May 2026",
    title: "6 New SEO Blog Posts",
    description:
      "Published GSC-informed guides on Claude Code vs Gemini CLI, ElevenLabs vs Higgsfield, LMArena alternatives, llama.cpp alternatives, free AI tools, and voice/audio tools.",
    type: "feature",
  },
  {
    date: "May 2026",
    title: "Q2 2026 Catalog Expansion",
    description:
      "Added 30 new tools including Venice AI, Warp, Hex, and Browserbase — plus a fact-check refresh updating pricing and archiving discontinued products.",
    type: "feature",
  },
  {
    date: "May 2026",
    title: "New Best-Of Guides",
    description:
      "Published private AI tools and data analyst guides, with curated comparisons for Venice AI, Warp, Roo Code, and DeepInfra.",
    type: "improvement",
  },
  {
    date: "May 2026",
    title: "Catalog Growth Refresh",
    description:
      "Expanded the directory to 200+ published tools and refreshed homepage counts so the site reflects live catalog data.",
    type: "improvement",
  },
  {
    date: "May 2026",
    title: "Prompt Builder",
    description:
      "Added a practical prompt builder for turning rough tasks into clearer, more useful prompts.",
    type: "feature",
  },
  {
    date: "May 2026",
    title: "New Evergreen Guides",
    description:
      "Published new beginner-friendly guides covering AI agents, meeting notes tools, prompt writing, privacy, and tool selection.",
    type: "improvement",
  },
  {
    date: "February 2026",
    title: "AI Tools Directory Goes Live",
    description:
      "Launched the curated AI tools directory with category filters, pricing filters, ratings, pros and cons, and reviewed tool pages.",
    type: "feature",
  },
  {
    date: "February 2026",
    title: "Comparisons and Stack Recipes",
    description:
      "Added side-by-side comparisons and curated stack recipes so readers can understand how tools fit together in real workflows.",
    type: "feature",
  },
  {
    date: "February 2026",
    title: "Contact Page and FAQ",
    description:
      "Added a contact page for corrections, bug reports, and suggestions, plus a concise FAQ explaining how the directory works.",
    type: "improvement",
  },
  {
    date: "February 2026",
    title: "SEO and Performance Optimization",
    description:
      "Improved page load times, metadata, JSON-LD structured data, and sitemap generation for better search visibility.",
    type: "improvement",
  },
];

export default function ChangelogPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <p className="tracking-accent text-white/50">Changelog</p>
            <h1 className="mt-3 font-display text-5xl font-bold tracking-hero sm:text-6xl">
              What&apos;s new
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              The latest features, improvements, and fixes on AiCensus.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-14">
            <div className="relative space-y-0">
              {entries.map((entry, index) => {
                const style = typeStyles[entry.type];
                const isLast = index === entries.length - 1;
                return (
                  <div key={`${entry.title}-${index}`} className="relative flex gap-6 pb-10">
                    {!isLast && (
                      <div className="absolute left-[7px] top-3 h-full w-px bg-border/50" />
                    )}
                    <div className="relative mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-border bg-background" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {entry.date}
                        </p>
                        <Badge
                          variant="secondary"
                          className={style.className}
                        >
                          {style.label}
                        </Badge>
                      </div>
                      <h3 className="mt-2 font-display text-base font-semibold">
                        {entry.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
