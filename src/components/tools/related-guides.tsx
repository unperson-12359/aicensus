import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostBySlug } from "@/lib/blog";

interface RelatedGuidesProps {
  /** Blog post slugs, in display order. Missing posts are skipped. */
  slugs: string[];
}

/**
 * "Related guides" sidebar card for tool pages — links back into the blog so
 * equity flows both ways between the directory and editorial content.
 * Server component: resolves titles and reading time from the .mdx files.
 */
export function RelatedGuides({ slugs }: RelatedGuidesProps) {
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-primary" />
          Related Guides
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <p className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
              {post.readingTime}
            </p>
          </Link>
        ))}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
        >
          All guides
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
