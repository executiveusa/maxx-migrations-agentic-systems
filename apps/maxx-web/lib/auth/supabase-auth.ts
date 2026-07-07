import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieSerializeOptions } from "cookie";

/**
 * Server-side Supabase auth client for Phase 2+.
 * Uses the session cookie populated by middleware.
 * This client respects RLS policies via the user's JWT in the session.
 */
export async function getSupabaseAuth() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieSerializeOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore cookie errors in read-only contexts (like generateMetadata)
          }
        },
      },
    }
  );
}

/**
 * Extract the current authenticated user from the session.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const supabase = await getSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Extract the organization ID from the current user's metadata.
 * Set during signup via user_metadata.org_id.
 * Throws if not authenticated or org_id not in metadata.
 */
export async function getCurrentOrgId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const orgId = (user.user_metadata?.org_id as string | undefined) ?? null;
  if (!orgId) {
    throw new Error("Organization ID not found in user metadata");
  }

  return orgId;
}

/**
 * Sign out the current user by clearing their session.
 */
export async function signOut() {
  const supabase = await getSupabaseAuth();
  await supabase.auth.signOut();
}
