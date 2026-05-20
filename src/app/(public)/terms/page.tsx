import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";

export const metadata: Metadata = {
  title: "Terms of Service - AiCensus",
  description:
    "Terms and conditions for using the AiCensus AI tools directory.",
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
            Last updated: May 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-8 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3 leading-relaxed">
                By accessing or using AiCensus, you agree to these Terms of
                Service. If you do not agree, please do not use the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                2. Description of Service
              </h2>
              <p className="mt-3 leading-relaxed">
                AiCensus is a public AI tools directory with tool listings,
                categories, comparisons, stack recipes, a prompt builder, saved
                browser-local shortlists, and editorial guides.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                3. Directory Content
              </h2>
              <p className="mt-3 leading-relaxed">
                Tool listings are editorial and informational. We try to keep
                names, pricing notes, descriptions, and links accurate, but AI
                products change quickly. You should verify pricing, features,
                and terms directly with each tool provider before making a
                purchase or relying on a tool for important work.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                4. Contact Messages
              </h2>
              <p className="mt-3 leading-relaxed">
                If you send us a message, you are responsible for the content
                you provide. Do not send spam, unlawful content, confidential
                third-party information, or anything you do not have permission
                to share.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                5. Prohibited Use
              </h2>
              <p className="mt-3 leading-relaxed">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Send false, misleading, abusive, or spam messages</li>
                <li>Impersonate another person or organization</li>
                <li>Use the site to distribute malware or harmful content</li>
                <li>Attempt to access systems you are not authorized to access</li>
                <li>
                  Scrape, crawl, or collect data from the site in an automated
                  manner that disrupts the service
                </li>
                <li>Use AiCensus for any purpose that violates applicable law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                6. Intellectual Property
              </h2>
              <p className="mt-3 leading-relaxed">
                The AiCensus site, design, code, and original editorial content
                belong to AiCensus. Tool names, trademarks, logos, and product
                information belong to their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                7. Disclaimers
              </h2>
              <p className="mt-3 leading-relaxed">
                AiCensus is provided &quot;as is&quot; without warranties of any
                kind. We are not responsible for third-party products, services,
                websites, pricing changes, outages, or claims made by listed
                tools.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                8. Limitation of Liability
              </h2>
              <p className="mt-3 leading-relaxed">
                To the fullest extent permitted by law, AiCensus shall not be
                liable for indirect, incidental, special, consequential, or
                punitive damages arising from your use of the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                9. Changes to These Terms
              </h2>
              <p className="mt-3 leading-relaxed">
                We may update these terms from time to time. Continued use of
                AiCensus after changes are posted constitutes your acceptance of
                the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                10. Contact
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
