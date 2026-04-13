import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";
// Geometric decor removed for cleaner aesthetic
import type { UserProfile } from "@/lib/types/database";

interface PortfolioShowcaseProps {
  users: UserProfile[];
}

export function PortfolioShowcase({ users }: PortfolioShowcaseProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* Copy side */}
        <FadeIn>
          <div>
            <h2 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Your work deserves{" "}
              <span className="text-gradient-primary">to be seen.</span>
            </h2>
            <p className="mt-4 max-w-lg font-serif text-lg italic text-muted-foreground sm:text-xl">
              Built a site with Cursor? Shipped an app with v0? Show the world.
              Create your free AI builder portfolio — no domain, no following, no
              gatekeepers.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg">
                  Create Your Portfolio — Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Cards side */}
        {users.length > 0 ? (
          <StaggerChildren className="grid gap-4 sm:grid-cols-2">
            {users.slice(0, 4).map((user) => (
              <StaggerItem key={user.id}>
                <PortfolioCard user={user} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        ) : (
          <FadeIn delay={0.2}>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Placeholder cards when no portfolios exist yet */}
              {[
                { name: "Alex Chen", role: "Full-Stack Dev" },
                { name: "Sara Kim", role: "AI Designer" },
                { name: "Jordan Lee", role: "Indie Maker" },
                { name: "You?", role: "AI Builder" },
              ].map((placeholder) => (
                <div
                  key={placeholder.name}
                  className="rounded-lg border border-border/40 bg-card overflow-hidden"
                >
                  <div className="h-20 bg-gradient-to-br from-primary/15 to-accent/15" />
                  <div className="px-4 pb-4 pt-0">
                    <div className="-mt-6 mb-2 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-background bg-muted text-sm font-bold text-muted-foreground">
                      {placeholder.name.charAt(0)}
                    </div>
                    <p className="font-medium text-sm">{placeholder.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {placeholder.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
