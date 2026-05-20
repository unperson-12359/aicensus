import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";

export const metadata: Metadata = {
  title: "Privacy Policy - AiCensus",
  description:
    "Learn how AiCensus collects, uses, and protects information from visitors.",
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
            Last updated: May 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="prose-custom mt-8 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">
                1. Information We Collect
              </h2>
              <p className="mt-3 leading-relaxed">
                AiCensus is a public AI tools directory. We collect only the
                limited information needed to operate the site:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">Contact messages</strong>{" "}
                  - your name, email address, subject, and message when you use
                  the contact form.
                </li>
                <li>
                  <strong className="text-foreground">Usage data</strong> -
                  pages visited, rough traffic patterns, device/browser details,
                  and other analytics used to improve the site.
                </li>
                <li>
                  <strong className="text-foreground">Local saved items</strong>{" "}
                  - saved tools, comparisons, and stack-builder state are stored
                  in your browser on your device.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                2. How We Use Information
              </h2>
              <p className="mt-3 leading-relaxed">
                We use information to operate AiCensus, respond to messages,
                fix bugs, understand which pages are useful, and improve the
                directory, comparisons, stacks, prompt builder, and blog.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                3. Third-Party Services
              </h2>
              <p className="mt-3 leading-relaxed">
                AiCensus uses third-party services to run the site:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">Supabase</strong> -
                  database hosting for the tools catalog and contact messages.
                </li>
                <li>
                  <strong className="text-foreground">Vercel</strong> - website
                  hosting and delivery.
                </li>
                <li>
                  <strong className="text-foreground">Google Analytics</strong>{" "}
                  - traffic and usage analytics.
                </li>
              </ul>
              <p className="mt-3 leading-relaxed">
                These services have their own privacy policies governing how
                they handle data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                4. Cookies and Local Storage
              </h2>
              <p className="mt-3 leading-relaxed">
                We may use cookies or similar technologies for analytics. Saved
                tools and stack-builder state are stored locally in your browser
                so you can revisit them later without an account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                5. Data Sharing
              </h2>
              <p className="mt-3 leading-relaxed">
                We do not sell personal information. We share data only with the
                service providers needed to operate the site, respond to contact
                messages, and understand site usage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                6. Data Security
              </h2>
              <p className="mt-3 leading-relaxed">
                We use reasonable safeguards, including HTTPS and
                access-controlled systems. No method of transmission or storage
                is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                7. Your Choices
              </h2>
              <p className="mt-3 leading-relaxed">
                You can clear saved AiCensus items by clearing your browser
                storage. If you have contacted us and want your contact message
                removed, reach out through the{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contact page
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                8. Changes to This Policy
              </h2>
              <p className="mt-3 leading-relaxed">
                We may update this privacy policy from time to time. Continued
                use of AiCensus after changes are posted means you accept the
                updated policy.
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
