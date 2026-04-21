import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";
import type { UserProfile } from "@/lib/types/database";

interface PortfolioShowcaseProps {
  users: UserProfile[];
}

export function PortfolioShowcase({ users }: PortfolioShowcaseProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Copy tile (inverted) */}
        <FadeIn className="lg:col-span-5">
          <div className="bento-tile bento-tile--invert h-full p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <p className="tracking-accent text-black/60">Your portfolio</p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-hero leading-[0.95] sm:text-5xl">
                Your work
                <br />
                deserves to
                <br />
                be seen.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-black/70">
                Built a site with Cursor? Shipped an app with v0? Create your
                free AI builder portfolio — no domain, no following, no
                gatekeepers.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-black/85"
                >
                  Create your portfolio — free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Cards grid */}
        <div className="lg:col-span-7">
          {users.length > 0 ? (
            <StaggerChildren className="grid h-full gap-3 sm:gap-4 sm:grid-cols-2">
              {users.slice(0, 4).map((user) => (
                <StaggerItem key={user.id}>
                  <PortfolioCard user={user} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <FadeIn delay={0.2}>
              <div className="grid h-full gap-3 sm:gap-4 sm:grid-cols-2">
                {[
                  { name: "Alex Chen", role: "Full-stack dev" },
                  { name: "Sara Kim", role: "AI designer" },
                  { name: "Jordan Lee", role: "Indie maker" },
                  { name: "You?", role: "AI builder" },
                ].map((placeholder) => (
                  <div
                    key={placeholder.name}
                    className="bento-tile h-full p-6 flex flex-col justify-between"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg font-bold text-white/70">
                      {placeholder.name.charAt(0)}
                    </div>
                    <div className="mt-6">
                      <p className="text-base font-semibold tracking-tight">
                        {placeholder.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {placeholder.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
