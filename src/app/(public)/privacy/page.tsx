import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";

export const metadata: Metadata = {
  title: "Privacy Policy — AiCensus",
  description:
    "Learn how AiCensus collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            Legal
          </p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
            Privacy <em className="italic text-white/60">policy</em>.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: February 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="prose-custom mt-8 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">
                1. Information We Collect
              </h2>
              <p className="mt-3 leading-relaxed">
                When you use AiCensus, we may collect the following types of
                information:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">Account information</strong>{" "}
                  — email address, username, and display name when you create an
                  account.
                </li>
                <li>
                  <strong className="text-foreground">Profile information</strong>{" "}
                  — bio, links, avatar, and other details you choose to add to
                  your portfolio.
                </li>
                <li>
                  <strong className="text-foreground">Submitted content</strong>{" "}
                  — tool submissions, portfolio projects, and messages you send
                  through the platform.
                </li>
                <li>
                  <strong className="text-foreground">Usage data</strong> — pages
                  visited, time spent, and general interaction patterns collected
                  through analytics.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                2. How We Use Your Information
              </h2>
              <p className="mt-3 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Provide, maintain, and improve AiCensus</li>
                <li>Create and manage your account and portfolio</li>
                <li>Display your public portfolio and projects to visitors</li>
                <li>Process tool submissions and contact messages</li>
                <li>Send important service-related communications</li>
                <li>
                  Understand how people use the platform so we can make it better
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                3. Third-Party Services
              </h2>
              <p className="mt-3 leading-relaxed">
                AiCensus uses the following third-party services that may process
                your data:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">Supabase</strong> — database
                  hosting and authentication
                </li>
                <li>
                  <strong className="text-foreground">Stripe</strong> — payment
                  processing for featured listings
                </li>
                <li>
                  <strong className="text-foreground">Google Analytics</strong> —
                  anonymous usage statistics
                </li>
                <li>
                  <strong className="text-foreground">Vercel</strong> — website
                  hosting and delivery
                </li>
              </ul>
              <p className="mt-3 leading-relaxed">
                Each service has its own privacy policy governing how they handle
                data. We encourage you to review their policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                4. Cookies
              </h2>
              <p className="mt-3 leading-relaxed">
                We use cookies for authentication (keeping you logged in) and
                analytics (understanding how the site is used).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                5. Data Sharing
              </h2>
              <p className="mt-3 leading-relaxed">
                We do not sell your personal information. We only share data with
                the third-party services listed above as needed to operate the
                platform. If you create a public portfolio, the information you
                add to it (display name, bio, projects, links) is visible to
                anyone who visits your profile.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                6. Data Security
              </h2>
              <p className="mt-3 leading-relaxed">
                We take reasonable measures to protect your information, including
                encrypted connections (HTTPS), secure authentication, and
                access-controlled databases. However, no method of transmission
                or storage is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                7. Your Rights
              </h2>
              <p className="mt-3 leading-relaxed">
                You can update or delete your profile information at any time
                through your dashboard settings. If you want to delete your
                account entirely, contact us and we will remove your data from
                our systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                8. Changes to This Policy
              </h2>
              <p className="mt-3 leading-relaxed">
                We may update this privacy policy from time to time. If we make
                significant changes, we will notify you through the platform or
                by email. Your continued use of AiCensus after changes are posted
                means you accept the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                9. Contact
              </h2>
              <p className="mt-3 leading-relaxed">
                If you have questions about this privacy policy or your data,
                reach out through our{" "}
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
