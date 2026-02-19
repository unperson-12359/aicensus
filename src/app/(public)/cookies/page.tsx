import type { Metadata } from "next";
import { FadeIn, PageTransition } from "@/components/motion";

export const metadata: Metadata = {
  title: "Cookie Policy — AiCensus",
  description:
    "Information about how AiCensus uses cookies and similar technologies.",
  alternates: { canonical: "/cookies" },
};

export default function CookiePolicyPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold tracking-display sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: February 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-12 space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">
                What Are Cookies
              </h2>
              <p className="mt-3 leading-relaxed">
                Cookies are small text files stored on your device when you visit
                a website. They help the site remember your preferences and
                understand how you interact with it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                Cookies We Use
              </h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-foreground">
                        Cookie
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">
                        Purpose
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs text-primary">
                        sb-*-auth-token
                      </td>
                      <td className="px-4 py-3">
                        Keeps you logged in to your account (authentication)
                      </td>
                      <td className="px-4 py-3">Session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs text-primary">
                        _ga / _ga_*
                      </td>
                      <td className="px-4 py-3">
                        Google Analytics — helps us understand how the site is
                        used (anonymous)
                      </td>
                      <td className="px-4 py-3">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                Essential vs. Analytics Cookies
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                <li>
                  <strong className="text-foreground">Essential cookies</strong>{" "}
                  (authentication) are required for the site to function. Without
                  them, you cannot log in or use your dashboard.
                </li>
                <li>
                  <strong className="text-foreground">Analytics cookies</strong>{" "}
                  (Google Analytics) are used to improve the site. They collect
                  anonymous data about page views and interactions.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                How to Manage Cookies
              </h2>
              <p className="mt-3 leading-relaxed">
                Most web browsers allow you to control cookies through their
                settings. You can block or delete cookies at any time. Note that
                blocking essential cookies may prevent you from logging in.
              </p>
              <p className="mt-3 leading-relaxed">
                To opt out of Google Analytics specifically, you can install the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                Contact
              </h2>
              <p className="mt-3 leading-relaxed">
                If you have questions about our use of cookies, reach out through
                our{" "}
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
