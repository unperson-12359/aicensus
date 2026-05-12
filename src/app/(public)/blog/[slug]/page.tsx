import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { FadeIn, PageTransition } from "@/components/motion";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PrevNextNav } from "@/components/shared/prev-next-nav";
import { getPostBySlug, getPostSlugs, getAdjacentPosts } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — AiCensus Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "AiCensus",
      url: siteUrl,
    },
    url: `${siteUrl}/blog/${slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbLd} />
      <PageTransition>
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {/* Breadcrumbs */}
          <FadeIn>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
              className="mb-4"
            />
          </FadeIn>

          {/* Header */}
          <FadeIn delay={0.1}>
            <header className="mt-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime}
                </span>
                <span>By {post.author}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-display sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      aria-label={`View all posts tagged ${tag}`}
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs transition-colors hover:bg-white/20"
                      >
                        <Tag className="mr-1 h-2.5 w-2.5" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </header>
          </FadeIn>

          {/* Content */}
          <FadeIn delay={0.2}>
            <div className="blog-content mt-10">
              <MDXRemote source={post.content} />
            </div>
          </FadeIn>

          {/* Prev / Next */}
          {(prev || next) && (
            <FadeIn delay={0.25}>
              <div className="mt-16 border-t border-white/10 pt-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
                  Continue reading
                </p>
                <div className="mt-4">
                  <PrevNextNav
                    prev={
                      prev
                        ? {
                            href: `/blog/${prev.slug}`,
                            label: prev.title,
                            sublabel: prev.readingTime,
                          }
                        : null
                    }
                    next={
                      next
                        ? {
                            href: `/blog/${next.slug}`,
                            label: next.title,
                            sublabel: next.readingTime,
                          }
                        : null
                    }
                    prevLabel="Newer post"
                    nextLabel="Older post"
                  />
                </div>
              </div>
            </FadeIn>
          )}

          {/* Footer */}
          <FadeIn delay={0.3}>
            <div className="mt-12 pt-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white sm:text-[11px]"
              >
                <ArrowLeft className="h-3 w-3" />
                All posts
              </Link>
            </div>
          </FadeIn>
        </article>
      </PageTransition>
    </>
  );
}
