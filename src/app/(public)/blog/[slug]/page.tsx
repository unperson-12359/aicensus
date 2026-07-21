import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion";
import { PageContainer } from "@/components/shared/page-container";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PrevNextNav } from "@/components/shared/prev-next-nav";
import {
  getPostBySlug,
  getPostSlugs,
  getAdjacentPosts,
  getRelatedPosts,
  extractToc,
  slugifyHeading,
} from "@/lib/blog";

/** Plain-text content of a rendered heading, for anchor ids and labels. */
function headingText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(headingText).join("");
  if (isValidElement(node))
    return headingText((node.props as { children?: ReactNode }).children);
  return "";
}

/**
 * Heading components that add anchor ids matching `extractToc` slugs
 * (same de-duplication: repeated slugs get -1, -2…). A fresh counter is
 * created per page render so TOC links and heading ids stay in sync.
 */
function createHeadingComponents() {
  const seen = new Map<string, number>();
  const make = (Tag: "h2" | "h3") =>
    function Heading({ children }: { children?: ReactNode }) {
      const text = headingText(children);
      const base = slugifyHeading(text);
      let id: string | undefined;
      if (base) {
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        id = count === 0 ? base : `${base}-${count}`;
      }
      return (
        <Tag id={id} className="group scroll-mt-24">
          {children}
          {id && (
            <a
              href={`#${id}`}
              aria-label={`Link to section: ${text}`}
              className="ml-2 align-middle text-white/30 no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-white/70"
            >
              #
            </a>
          )}
        </Tag>
      );
    };
  return { h2: make("h2"), h3: make("h3") };
}

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
    title: post.title,
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
  const relatedPosts = getRelatedPosts(slug, 3);
  const toc = extractToc(post.content).filter((item) => item.level === 2);
  const headingComponents = createHeadingComponents();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.updated ? { dateModified: post.updated } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
    image: `${siteUrl}/opengraph-image`,
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

  const faqJsonLd =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <PageContainer variant="narrow">
        <article>
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
                {post.updated && (
                  <span className="flex items-center gap-1.5">
                    Last updated{" "}
                    {new Date(post.updated).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
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

          {/* Table of contents */}
          {toc.length >= 4 && (
            <FadeIn delay={0.15}>
              <nav
                aria-label="Table of contents"
                className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] p-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
                  On this page
                </p>
                <ul className="mt-3 space-y-1.5">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-white"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </FadeIn>
          )}

          {/* Content */}
          <FadeIn delay={0.2}>
            <div className="blog-content mt-10">
              <MDXRemote
                source={post.content}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                components={{
                  ...headingComponents,
                  table: (props) => (
                    <div className="table-wrapper">
                      <table {...props} />
                    </div>
                  ),
                }}
              />
            </div>
          </FadeIn>

          {/* Related guides */}
          {relatedPosts.length > 0 && (
            <FadeIn delay={0.25}>
              <div className="mt-16 border-t border-white/10 pt-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
                  Related guides
                </p>
                <ul className="mt-4 space-y-3">
                  {relatedPosts.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={`/blog/${related.slug}`}
                        className="group flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/30"
                      >
                        <span>
                          <span className="font-serif text-base font-normal tracking-[-0.01em] group-hover:text-white">
                            {related.title}
                          </span>
                          <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">
                            {related.description}
                          </span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-white/70" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          )}

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
      </PageContainer>
    </>
  );
}
