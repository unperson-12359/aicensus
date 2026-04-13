import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerChildren, StaggerItem, PageTransition } from "@/components/motion";
import { getAllPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — AiCensus",
  description:
    "Insights, guides, and updates from AiCensus. Learn about AI tools, vibe coding, and building in the AI era.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag: activeTag } = await searchParams;
  const allPosts = getAllPosts();
  const allTags = [...new Set(allPosts.flatMap((p) => p.tags))].sort();
  const posts = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Blog
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl">
              Insights & Updates
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Guides, tool roundups, and updates from the AiCensus team.
            </p>
          </div>
        </FadeIn>

        {allTags.length > 0 && (
          <FadeIn delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/blog"
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  !activeTag
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                All
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    activeTag === tag
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <Tag className="mr-1 h-2.5 w-2.5" />
                  {tag}
                </Link>
              ))}
            </div>
          </FadeIn>
        )}

        {posts.length === 0 ? (
          <FadeIn delay={0.15}>
            <div className="mt-16 text-center">
              <p className="text-muted-foreground">
                No posts yet. Check back soon.
              </p>
            </div>
          </FadeIn>
        ) : (
          <StaggerChildren className="mt-14 space-y-6">
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <Link href={`/blog/${post.slug}`}>
                  <Card className="border-border/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingTime}
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {post.description}
                      </p>
                      {post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              <Tag className="mr-1 h-2.5 w-2.5" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </div>
    </PageTransition>
  );
}
