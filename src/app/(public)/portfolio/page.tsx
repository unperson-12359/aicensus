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
            <p className="tracking-accent text-white/50">For builders</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-hero sm:text-6xl lg:text-7xl">
              Websites and projects
              <br />
              <span className="text-white/45">built with AI</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
              Create a free portfolio page, showcase your projects with live
              previews, and let visitors message you directly. No domain needed.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg">
                  Create your portfolio — free
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
                className="mt-4 text-foreground underline underline-offset-4 hover:no-underline"
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
