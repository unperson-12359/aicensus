import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isWriteOrReviewAdminPath(pathname: string) {
  return (
    pathname.startsWith("/admin/submissions") ||
    pathname.startsWith("/admin/categories") ||
    pathname.startsWith("/admin/portfolios") ||
    pathname.startsWith("/admin/subscriptions") ||
    pathname === "/admin/tools/new" ||
    /^\/admin\/tools\/[^/]+\/edit$/.test(pathname)
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect dashboard routes — any authenticated user
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password") {
    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profile) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Protect admin routes
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Require a valid admin profile for admin routes
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Optionally redirect non-admin roles away from write/review pages.
    if (profile.role !== "admin" && isWriteOrReviewAdminPath(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
