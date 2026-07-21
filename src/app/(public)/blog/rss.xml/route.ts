import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Wrap text in CDATA, splitting any literal "]]>" so it cannot break out. */
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co";
  const posts = getAllPosts();
  const lastBuild = posts.reduce<string | null>((latest, post) => {
    const stamp = post.updated ?? post.date;
    if (!stamp) return latest;
    return !latest || new Date(stamp) > new Date(latest) ? stamp : latest;
  }, null);

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : "";
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : "",
        `      <description>${cdata(post.description)}</description>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AiCensus Blog</title>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Insights, guides, and updates from AiCensus. AI tools, reviews, and how to pick the right stack.</description>
    <language>en-us</language>
${lastBuild ? `    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
