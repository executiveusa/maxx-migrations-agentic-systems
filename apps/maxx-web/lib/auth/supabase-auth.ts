import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieSerializeOptions } from "cookie";

/** Server-side Supabase auth client using the current session cookie. */
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
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Read-only server component; middleware owns refresh cookie writes.
          }
        },
      },
    },
  );
}

export async function getCurrentUser() {
  const supabase = await getSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Resolve the active tenant from persisted membership, not user-controlled metadata.
 * A metadata org_id may select among memberships, but never grants membership itself.
 */
export async function getCurrentOrgId(): Promise<string> {
  const supabase = await getSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: memberships, error } = await supabase
    .from("maxx_organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Organization membership lookup failed: ${error.message}`);
  if (!memberships?.length) throw new Error("No organization membership found for this user");

  const hintedOrgId = user.user_metadata?.org_id as string | undefined;
  if (hintedOrgId && memberships.some((row) => row.organization_id === hintedOrgId)) {
    return hintedOrgId;
  }
  if (memberships.length === 1) return memberships[0].organization_id;

  throw new Error("Multiple organization memberships found. Select an active organization before continuing.");
}

export async function getCurrentMembership() {
  const supabase = await getSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const orgId = await getCurrentOrgId();
  const { data, error } = await supabase
    .from("maxx_organization_members")
    .select("organization_id, user_id, role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();
  if (error) throw new Error(`Membership lookup failed: ${error.message}`);
  return data;
}

export async function signOut() {
  const supabase = await getSupabaseAuth();
  await supabase.auth.signOut();
}
