import { NextResponse } from "next/server";
import { getToolsBySlugs } from "@/lib/queries/tools";

const MAX_SLUGS = 50;

function cleanSlug(slug: string): string | null {
  const cleaned = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  return cleaned ? cleaned.slice(0, 80) : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSlugs = searchParams.get("slugs") || "";
  const slugs = Array.from(
    new Set(
      rawSlugs
        .split(",")
        .map(cleanSlug)
        .filter((slug): slug is string => Boolean(slug))
    )
  ).slice(0, MAX_SLUGS);

  if (slugs.length === 0) {
    return NextResponse.json({ tools: [] });
  }

  try {
    const tools = await getToolsBySlugs(slugs);
    return NextResponse.json({ tools });
  } catch {
    return NextResponse.json({ tools: [] }, { status: 200 });
  }
}
