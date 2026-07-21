import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FadeIn, RevealText } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { SavedWorkspace } from "@/components/saved/saved-workspace";

export const metadata: Metadata = {
  title: "Saved AI Tools, Comparisons, and Stacks",
  description:
    "Your private AiCensus shortlist for saved AI tools, comparisons, and stack-builder results.",
  alternates: { canonical: "/saved" },
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeIn>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Saved" },
          ]}
        />
      </FadeIn>

      <FadeIn>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
          Private to this browser
        </p>
        <div className="mt-4 sm:mt-5">
          <RevealText>
            <h1 className="font-serif text-[clamp(2rem,6.5vw,4.75rem)] font-normal leading-[0.95] tracking-[-0.035em]">
              Your AI{" "}
              <em className="font-serif italic text-white/50">shortlist</em>.
            </h1>
          </RevealText>
        </div>
        <p className="mt-5 max-w-2xl font-serif text-base italic leading-relaxed text-white/70 sm:text-lg">
          Save tools, comparisons, and stack-builder results as you explore.
          No account required; your shortlist stays on this device.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="/tools">
              Browse tools
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/stacks/build">
              Build a stack
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </FadeIn>

      <SavedWorkspace />
    </div>
  );
}
