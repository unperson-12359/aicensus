import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  tags: string[];
  readingTime: string;
  content: string;
  faqs?: BlogFaq[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  tags: string[];
  readingTime: string;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const stats = readingTime(content);
    const faqs = parseFaqs(content);

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      updated: data.updated || undefined,
      author: data.author || "AiCensus",
      tags: data.tags || [],
      readingTime: stats.text,
      content,
      ...(faqs ? { faqs } : {}),
    };
  } catch (err) {
    console.error(`Failed to parse blog post "${slug}":`, err);
    return null;
  }
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      // Return meta only (no content, no FAQs) for the index page
      const { content, faqs, ...meta } = post;
      void content;
      void faqs;
      return meta;
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Previous / next post relative to the given slug, using the same date-desc
 * ordering as `getAllPosts`. "Previous" means the post before this one in
 * reading order (i.e. newer one), "next" means the one after (older one).
 * Returns nulls at the edges — no wrapping.
 */
export function getAdjacentPosts(slug: string): {
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
} {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}

/**
 * Strip markdown inline formatting to plain text for JSON-LD output.
 * Links and images become their anchor/alt text; emphasis and inline
 * code markers are removed.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> anchor text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/__([^_]+)__/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/_([^_]+)_/g, "$1") // italic
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract FAQ question/answer pairs from the `## FAQ` section of a post.
 *
 * Supported question formats (both observed in src/content/blog):
 *   1. `### Question text?` heading followed by answer paragraphs
 *   2. `**Question text?**` bold-only paragraph followed by answer paragraphs
 *
 * The section runs from a `## FAQ` / `## FAQ: ...` heading to the next
 * `## ` heading or end of file. Trailing call-to-action paragraphs at the
 * very end of the section ("Explore more: ...", "Browse ...", etc.) are
 * dropped so they do not leak into the last answer. Returns undefined when
 * there is no FAQ section or no parseable pairs.
 */
export function parseFaqs(content: string): BlogFaq[] | undefined {
  const lines = content.split("\n");
  const startIdx = lines.findIndex((line) => /^## FAQ\b/.test(line.trim()));
  if (startIdx === -1) return undefined;

  const bodyLines: string[] = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i].trim())) break; // next h2 ends the section
    bodyLines.push(lines[i]);
  }

  // Split the section body into paragraph blocks separated by blank lines.
  const blocks: string[] = [];
  let current: string[] = [];
  for (const line of bodyLines) {
    if (line.trim() === "") {
      if (current.length > 0) {
        blocks.push(current.join("\n"));
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) blocks.push(current.join("\n"));

  // Drop trailing call-to-action paragraphs (directory links etc.) so they
  // are not treated as part of the final answer.
  const ctaPattern = /^(explore more\b|to explore\b|explore \[|browse\b|ready to compare\b)/i;
  while (blocks.length > 0 && ctaPattern.test(blocks[blocks.length - 1].trim())) {
    blocks.pop();
  }

  const faqs: BlogFaq[] = [];
  let question: string | null = null;
  let answerParts: string[] = [];

  const flush = () => {
    if (question && answerParts.length > 0) {
      const answer = stripMarkdown(answerParts.join("\n\n"));
      if (answer) faqs.push({ question, answer });
    }
  };

  for (const block of blocks) {
    const trimmed = block.trim();
    const headingMatch = /^###\s+(.+)$/.exec(trimmed);
    // Bold question may be a standalone paragraph, or the first line of a
    // block whose following lines (no blank line) are the answer start.
    const blockLines = trimmed.split("\n");
    const boldMatch = /^\*\*([^*]+)\*\*$/.exec(blockLines[0].trim());

    if (headingMatch || boldMatch) {
      flush();
      question = stripMarkdown((headingMatch ?? boldMatch)![1]);
      const rest = headingMatch
        ? ""
        : blockLines.slice(1).join("\n").trim();
      answerParts = rest ? [rest] : [];
    } else if (question) {
      answerParts.push(trimmed);
    }
    // Paragraphs before the first question are ignored (intro text).
  }
  flush();

  return faqs.length > 0 ? faqs : undefined;
}
