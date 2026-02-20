import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeometricDecor, pageHeaderShapes } from "@/components/shared/geometric-decor";
import { FadeIn } from "@/components/motion";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { getPortfolioUsers } from "@/lib/queries/portfolios";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portfolio Showcase — Projects Built with AI Tools | AiCensus",
  description:
    "Discover websites and projects built with AI tools like Cursor, Bolt, Lovable, and more. Create your free portfolio page, showcase your projects with live previews, and get discovered.",
  openGraph: {
    title: "Portfolio Showcase — Projects Built with AI Tools | AiCensus",
    description:
      "Discover websites and projects built with AI tools. Create your free portfolio and showcase your work.",
  },
};

export default async function PortfolioPage() {
  const { users } = await getPortfolioUsers({ limit: 50 });

  return (
    <div className="relative">
      <GeometricDecor shapes={pageHeaderShapes} />

      {/* Hero */}
      <section className="relative px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              For Builders
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl">
              Websites and projects{" "}
              <span className="text-gradient-primary">built with AI</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
              Create a free portfolio page, showcase your projects with live
              previews, and let visitors message you directly. No domain needed.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-6">
              <Link href="/signup">
                <Button size="lg" className="glow-sm">
                  Create Your Portfolio — Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No portfolios yet. Be the first to showcase your work!
              </p>
              <a
                href="/signup"
                className="mt-4 text-primary hover:underline"
              >
                Create your portfolio
              </a>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {users.map((user) => (
                <PortfolioCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
