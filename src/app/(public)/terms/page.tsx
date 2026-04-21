import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";

export const metadata: Metadata = {
  title: "Terms of Service — AiCensus",
  description:
    "Terms and conditions for using the AiCensus platform, including the AI tools directory and portfolio features.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            Legal
          </p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
            Terms of <em className="italic text-white/60">service</em>.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: February 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-8 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3 leading-relaxed">
                By accessing or using AiCensus, you agree to be bound by these
                Terms of Service. If you do not agree, please do not use the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                2. Description of Service
              </h2>
              <p className="mt-3 leading-relaxed">
                AiCensus is a platform that provides an AI tools directory and a
                free portfolio feature for builders. Users can browse and discover
                AI tools, submit tools for listing, create portfolio profiles to
                showcase projects, and subscribe to featured placement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                3. Account Terms
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                <li>
                  You must provide a valid email address to create an account.
                </li>
                <li>
                  You are responsible for maintaining the security of your
                  account and password.
                </li>
                <li>
                  You are responsible for all activity that occurs under your
                  account.
                </li>
                <li>You must be at least 13 years old to use this service.</li>
                <li>
                  One person may not have more than one account.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                4. User Content
              </h2>
              <p className="mt-3 leading-relaxed">
                You retain ownership of any content you submit to AiCensus,
                including tool submissions, portfolio information, project
                descriptions, and messages. By making content public (such as
                your portfolio), you grant AiCensus a non-exclusive license to
                display that content on the platform.
              </p>
              <p className="mt-3 leading-relaxed">
                You are solely responsible for the content you post. Content must
                not be illegal, harmful, threatening, abusive, defamatory, or
                otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                5. Prohibited Use
              </h2>
              <p className="mt-3 leading-relaxed">
                You agree not to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Submit false, misleading, or spam content</li>
                <li>Impersonate another person or entity</li>
                <li>
                  Use the platform to distribute malware or harmful software
                </li>
                <li>
                  Attempt to gain unauthorized access to other accounts or
                  systems
                </li>
                <li>
                  Scrape, crawl, or collect data from the platform in an
                  automated manner without permission
                </li>
                <li>
                  Use the platform for any purpose that violates applicable laws
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                6. Featured Listings & Payments
              </h2>
              <p className="mt-3 leading-relaxed">
                Featured tool listings are available through a paid subscription.
                Payments are processed by Stripe. Subscriptions renew
                automatically unless cancelled. Refund requests are handled on a
                case-by-case basis — contact us if you have concerns.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                7. Intellectual Property
              </h2>
              <p className="mt-3 leading-relaxed">
                The AiCensus platform, including its design, code, and original
                content, is the property of AiCensus. Tool listings contain
                information about third-party products — trademarks and logos
                belong to their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                8. Disclaimers
              </h2>
              <p className="mt-3 leading-relaxed">
                AiCensus is provided &quot;as is&quot; without warranties of any
                kind. We do our best to keep information accurate, but we cannot
                guarantee that all tool listings, reviews, or user-submitted
                content are correct or up to date. We are not responsible for the
                products or services listed in our directory.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                9. Limitation of Liability
              </h2>
              <p className="mt-3 leading-relaxed">
                To the fullest extent permitted by law, AiCensus shall not be
                liable for any indirect, incidental, special, or consequential
                damages arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                10. Termination
              </h2>
              <p className="mt-3 leading-relaxed">
                We reserve the right to suspend or terminate accounts that
                violate these terms. You may delete your account at any time by
                contacting us through the{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contact page
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                11. Changes to These Terms
              </h2>
              <p className="mt-3 leading-relaxed">
                We may update these terms from time to time. Continued use of the
                platform after changes are posted constitutes your acceptance of
                the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                12. Contact
              </h2>
              <p className="mt-3 leading-relaxed">
                Questions about these terms? Reach out through our{" "}
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
