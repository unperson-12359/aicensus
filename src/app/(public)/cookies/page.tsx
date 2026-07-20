import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn which cookies and browser storage AiCensus uses, why, and the choices you have.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            Legal
          </p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
            Cookie <em className="italic text-white/60">policy</em>.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: July 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="prose-custom mt-8 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">
                1. What This Covers
              </h2>
              <p className="mt-3 leading-relaxed">
                This policy explains how AiCensus uses cookies and similar
                browser technologies (like local storage) when you visit the
                site. AiCensus is a read-only directory for most visitors — no
                account is required — so the amount of storage we use is
                deliberately small.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                2. Analytics Cookies
              </h2>
              <p className="mt-3 leading-relaxed">
                We use Google Analytics to understand overall traffic patterns:
                which pages are visited, how people move through the directory,
                and rough device/browser details. Google Analytics sets cookies
                (such as <strong className="text-foreground">_ga</strong> and
                related identifiers) to distinguish visits over time. These
                cookies are used in aggregate to improve the site, not to build
                individual advertising profiles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                3. Local Saved Items
              </h2>
              <p className="mt-3 leading-relaxed">
                Features like saved tools, comparison shortlists, and
                stack-builder state are stored in your browser&apos;s local
                storage on your own device. This data never leaves your browser
                and is not sent to our servers. Clearing your browser storage
                removes it permanently.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                4. Affiliate Outbound Tracking
              </h2>
              <p className="mt-3 leading-relaxed">
                Some links to tool websites are affiliate links. When you click
                one, the destination site or its affiliate network may set its
                own cookies to attribute the referral. These are third-party
                cookies governed by the destination&apos;s own policies —
                AiCensus does not control or read them. See our{" "}
                <a
                  href="/affiliate-disclosure"
                  className="text-primary hover:underline"
                >
                  affiliate disclosure
                </a>{" "}
                for details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                5. Your Choices
              </h2>
              <p className="mt-3 leading-relaxed">
                You have full control over cookies and storage:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">Browser settings</strong>{" "}
                  - every major browser lets you block or delete cookies, either
                  for all sites or per-site.
                </li>
                <li>
                  <strong className="text-foreground">Analytics opt-out</strong>{" "}
                  - you can install the Google Analytics opt-out browser add-on,
                  or block analytics cookies, without affecting how the site
                  works.
                </li>
                <li>
                  <strong className="text-foreground">
                    Clear saved items
                  </strong>{" "}
                  - clearing your browser&apos;s local storage for this site
                  removes your saved tools and stack state.
                </li>
              </ul>
              <p className="mt-3 leading-relaxed">
                Blocking cookies will not break the directory — browsing,
                search, and comparisons all work without them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                6. Changes to This Policy
              </h2>
              <p className="mt-3 leading-relaxed">
                We may update this cookie policy from time to time as the site
                evolves. The &quot;last updated&quot; date above reflects the
                most recent revision.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                7. Contact
              </h2>
              <p className="mt-3 leading-relaxed">
                Questions about cookies or storage on AiCensus? Reach out
                through our{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contact page
                </a>
                .
              </p>
            </section>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
