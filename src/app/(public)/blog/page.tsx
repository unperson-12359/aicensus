import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerChildren, StaggerItem, PageTransition } from "@/components/motion";
import { Pagination } from "@/components/shared/pagination";
import { PaginationInfo } from "@/components/shared/pagination-info";
import { getAllPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

const POSTS_PER_PAGE = 9;

export const metadata: Metadata = {
  title: "Blog — AiCensus",
  description:
    "Insights, guides, and updates from AiCensus. AI tools, reviews, and how to pick the right stack.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { tag: activeTag, page: pageParam } = await searchParams;
  const allPosts = getAllPosts();
  const allTags = [...new Set(allPosts.flatMap((p) => p.tags))].sort();
  const filtered = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, parseInt(pageParam || "1", 10) || 1)
  );
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = filtered.slice(offset, offset + POSTS_PER_PAGE);

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
            Blog
          </p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
            Insights &amp; <em className="italic text-white/60">updates</em>.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            Guides, tool roundups, and updates from the AiCensus team.
          </p>
        </FadeIn>

        {allTags.length > 0 && (
          <FadeIn delay={0.1}>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  !activeTag
                    ? "border-white bg-white text-black"
                    : "border-white/15 text-muted-foreground hover:border-white/40 hover:text-foreground"
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
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-muted-foreground hover:border-white/40 hover:text-foreground"
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
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                No posts yet. Check back soon.
              </p>
            </div>
          </FadeIn>
        ) : (
          <>
            <div id="posts" className="scroll-mt-24">
            <StaggerChildren className="mt-8 space-y-3 sm:space-y-4">
              {posts.map((post) => (
                <StaggerItem key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="border-white/10 bg-card transition-all duration-200 hover:border-white/30">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {post.readingTime && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              {post.readingTime}
                            </span>
                          )}
                        </div>
                        <h2 className="mt-3 font-serif text-xl font-normal tracking-[-0.02em] sm:text-2xl">
                          {post.title}
                        </h2>
                        {post.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {post.description}
                          </p>
                        )}
                        {post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="border-white/15 bg-white/[0.02] text-[10px] text-white/70"
                              >
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
            </div>

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
                <PaginationInfo
                  currentPage={currentPage}
                  perPage={POSTS_PER_PAGE}
                  total={total}
                  label="posts"
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/blog"
                  anchor="posts"
                  searchParams={{ tag: activeTag }}
                />
              </div>
            ) : (
              <div className="mt-8 flex justify-center">
                <PaginationInfo
                  currentPage={currentPage}
                  perPage={POSTS_PER_PAGE}
                  total={total}
                  label="posts"
                />
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
