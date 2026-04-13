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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Copy side */}
        <FadeIn>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-0.5 w-8 rounded-full bg-primary" />
              <div className="h-0.5 w-3 rounded-full bg-accent" />
            </div>
            <h2 className="font-display text-3xl font-normal tracking-display sm:text-4xl lg:text-5xl">
              Your work deserves{" "}
              <span className="text-gradient-primary">to be seen.</span>
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground sm:text-lg">
              Built a site with Cursor? Shipped an app with v0? Show the world.
              Create your free AI builder portfolio — no domain, no following, no
              gatekeepers.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="rounded-full">
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
                  className="rounded-xl border border-border/50 bg-card overflow-hidden"
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
