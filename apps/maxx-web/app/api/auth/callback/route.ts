import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieSerializeOptions } from "cookie";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const returnTo = searchParams.get("returnTo") || "/app";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieSerializeOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange error:", error);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message || "Authentication failed")}`,
          request.url
        )
      );
    }

    // Decode returnTo to avoid open redirect
    try {
      const decodedReturnTo = decodeURIComponent(returnTo);
      // Basic validation: must start with /
      if (decodedReturnTo.startsWith("/")) {
        return NextResponse.redirect(new URL(decodedReturnTo, request.url));
      }
    } catch {
      // If decoding fails, use default
    }

    return NextResponse.redirect(new URL("/app", request.url));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(new URL("/login?error=callback_error", request.url));
  }
}
