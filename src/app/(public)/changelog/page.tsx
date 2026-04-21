import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "What's New — AiCensus",
  description:
    "See what's new on AiCensus. Latest features, improvements, and updates to the AI tools directory and portfolio platform.",
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
    date: "February 2026",
    title: "Portfolio Feature Launch",
    description:
      "Create a free portfolio page to showcase your AI-built projects. Add a bio, social links, and unlimited projects with live previews. Visitors can message you directly through your profile.",
    type: "feature",
  },
  {
    date: "February 2026",
    title: "Featured Listings",
    description:
      "Tool makers can now get priority homepage placement with a Featured subscription. Includes a featured badge, higher search ranking, and category prominence.",
    type: "feature",
  },
  {
    date: "February 2026",
    title: "AI Tools Directory Goes Live",
    description:
      "Browse 150+ AI tools across 20+ categories. Filter by pricing, category, and verified status. Every tool reviewed by our team with honest descriptions and comparisons.",
    type: "feature",
  },
  {
    date: "February 2026",
    title: "Contact Page & FAQ",
    description:
      "New dedicated contact page for reaching out to the team, and a comprehensive FAQ covering all aspects of the platform.",
    type: "improvement",
  },
  {
    date: "February 2026",
    title: "Dashboard Improvements",
    description:
      "Your dashboard now shows account info, profile completeness with tips, and inline profile creation. The sidebar displays your avatar and email.",
    type: "improvement",
  },
  {
    date: "February 2026",
    title: "SEO & Performance Optimization",
    description:
      "Improved page load times with static generation for tool pages. Added comprehensive meta tags, JSON-LD structured data, and sitemap for better search engine visibility.",
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
            {/* Timeline */}
            <div className="relative space-y-0">
              {entries.map((entry, index) => {
                const style = typeStyles[entry.type];
                const isLast = index === entries.length - 1;
                return (
                  <div key={`${entry.title}-${index}`} className="relative flex gap-6 pb-10">
                    {/* Timeline line */}
                    {!isLast && (
                      <div className="absolute left-[7px] top-3 h-full w-px bg-border/50" />
                    )}
                    {/* Dot */}
                    <div className="relative mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-border bg-background" />
                    {/* Content */}
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
