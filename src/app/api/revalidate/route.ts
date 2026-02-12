import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Optional: add a secret token for security
  // if (secret !== process.env.REVALIDATION_SECRET) {
  //   return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const { path } = body;

    if (path) {
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
