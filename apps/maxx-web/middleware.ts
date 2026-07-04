import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware for Phase 2+ authentication.
 *
 * Responsibilities:
 * 1. Manage session cookies (refresh token if needed)
 * 2. Protect /app/* routes — redirect unauthenticated requests to /login
 * 3. Allow public routes — /, /login, /pricing, /terms, etc. are unprotected
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/pricing",
    "/terms",
    "/privacy",
    "/contact",
    "/audit",
    "/api/auth/callback",
    "/api/auth/magic-link",
    "/api/auth/logout",
  ];

  // Check if the request is for a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Create a response to set new cookies if needed
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client to manage the session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }: any) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh the session if needed (this updates the cookies)
  await supabase.auth.getUser();

  // Protect /app/* routes
  if (pathname.startsWith("/app/")) {
    // Check if there's an authenticated session by looking at the cookies
    const authToken = request.cookies.get("sb-auth-token");
    const refreshToken = request.cookies.get("sb-refresh-token");

    // If no session tokens found, redirect to login
    if (!authToken && !refreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Protect all routes except static assets and _next internal routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
