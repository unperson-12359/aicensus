import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How AiCensus uses affiliate links, what we earn, and why it never affects our ratings or rankings.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            Legal
          </p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
            Affiliate <em className="italic text-white/60">disclosure</em>.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: July 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="prose-custom mt-8 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">
                The short version
              </h2>
              <p className="mt-3 leading-relaxed">
                Some outbound links on AiCensus are affiliate links. If you
                click one and later buy a subscription, the vendor pays us a
                commission at no extra cost to you. This is how the site is
                funded. Our ratings, rankings, and reviews are editorial and
                are never influenced by whether a tool has an affiliate
                program.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                1. Where affiliate links appear
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  The <strong className="text-foreground">Visit</strong> button
                  on some tool pages, best-of pages, and alternatives pages.
                </li>
                <li>
                  When a link is an affiliate link, the tool page says so
                  directly beneath the button, and the link is tagged{" "}
                  <code className="text-foreground">rel=&quot;sponsored&quot;</code>{" "}
                  so search engines treat it as a paid link.
                </li>
                <li>
                  Tools without an affiliate program link straight to the
                  vendor&apos;s website with no commission involved. Most of the
                  catalog works this way today.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                2. What it costs you
              </h2>
              <p className="mt-3 leading-relaxed">
                Nothing. Affiliate commissions come out of the vendor&apos;s
                marketing budget, not your pocket. In some cases our links
                include a discount or an extended trial arranged by the vendor,
                so you may pay less than going direct.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                3. How this affects ratings (it doesn&apos;t)
              </h2>
              <p className="mt-3 leading-relaxed">
                Scores are assigned using the published criteria on our{" "}
                <a href="/how-we-rate" className="text-foreground underline decoration-white/20 underline-offset-2">
                  How we rate
                </a>{" "}
                page before — and independently of — any commercial
                relationship. A tool cannot pay for a higher score, a better
                rank, or inclusion in a best-of list. Many highly rated tools
                on AiCensus have no affiliate program at all, and some tools
                with generous programs carry middling scores.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                4. Programs we participate in
              </h2>
              <p className="mt-3 leading-relaxed">
                We work with affiliate programs run directly by vendors and
                through established partner networks (including PartnerStack,
                Impact, Rewardful, FirstPromoter, and Dub). The exact list
                changes as programs open, close, or change terms; the
                disclosure under each affected button is the authoritative
                signal for any given tool.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                5. Questions
              </h2>
              <p className="mt-3 leading-relaxed">
                If something about a link or a recommendation looks off, tell
                us via the{" "}
                <a href="/contact" className="text-foreground underline decoration-white/20 underline-offset-2">
                  contact page
                </a>
                . We would rather lose a commission than your trust.
              </p>
            </section>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
