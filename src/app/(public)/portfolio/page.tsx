import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { GeometricDecor, pageHeaderShapes } from "@/components/shared/geometric-decor";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { getPortfolioUsers } from "@/lib/queries/portfolios";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portfolio Showcase - AiCensus",
  description:
    "Discover websites and projects built with AI tools. Browse portfolios from developers who code with AI.",
  openGraph: {
    title: "Portfolio Showcase - AiCensus",
    description:
      "Discover websites and projects built with AI tools. Browse portfolios from developers who code with AI.",
  },
};

export default async function PortfolioPage() {
  const { users } = await getPortfolioUsers({ limit: 50 });

  return (
    <div className="relative">
      <GeometricDecor shapes={pageHeaderShapes} />

      {/* Hero */}
      <section className="relative px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <SectionHeading
            title="Portfolio Showcase"
            description="Websites and projects built with AI. No domain needed — just deploy and share."
            size="lg"
            gradient
            accent
            className="mx-auto items-center"
          />
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
