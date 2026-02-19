import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  path: z.string().trim().optional(),
});

const ALLOWED_PATH_PREFIXES = ["/", "/tools", "/categories", "/about", "/submit", "/portfolio", "/blog", "/changelog", "/faq", "/pricing", "/contact"];

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");
  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (!expectedSecret) {
    return jsonError("Revalidation is not configured", 500);
  }

  if (!secret || secret !== expectedSecret) {
    return jsonError("Invalid token", 401);
  }

  try {
    const rawBody = await request.json();
    const parsedBody = bodySchema.safeParse(rawBody);

    if (!parsedBody.success) {
      return jsonError("Invalid request body", 400);
    }

    const { path } = parsedBody.data;

    if (path) {
      const isAllowedPath = ALLOWED_PATH_PREFIXES.some((prefix) =>
        path === prefix || path.startsWith(`${prefix}/`)
      );

      if (!isAllowedPath) {
        return jsonError("Path is not allowed for revalidation", 400);
      }

      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    }

    // Revalidate all main pages
    revalidatePath("/");
    revalidatePath("/tools");
    revalidatePath("/categories");

    return NextResponse.json({ revalidated: true, path: "all" });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
