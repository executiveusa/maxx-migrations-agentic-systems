import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client factory for prod mode (isSeedMode() === false).
 *
 * Deliberately lazy: @supabase/supabase-js is only instantiated when a route
 * actually needs it, so seed-mode requests (and the whole test suite, which
 * always runs with NEXT_PUBLIC_AUTH_CONFIGURED unset) never require these env
 * vars to be present.
 *
 * This uses the service-role key, which BYPASSES Postgres row-level security
 * entirely — it does not "enforce RLS via the JWT" the way a browser client
 * authenticated with the anon key + a user session would. Real per-user RLS
 * enforcement needs Phase 2 (Supabase auth + @supabase/ssr session plumbing)
 * to exist first. Until then every query below manually scopes by
 * organization_id as the substitute isolation guarantee, and maxx_is_org_member
 * remains in place so it activates automatically once Phase 2 swaps this
 * service-role client for a per-request session client.
 */
let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cachedClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

/**
 * Resolves the organization id every prod-mode query is scoped to.
 *
 * Phase 2 will replace this with the organization derived from the
 * authenticated session's JWT claims. Until real auth/session middleware
 * exists there is no per-request identity to read an org id from, so
 * prod-mode deployments must set NEXT_PUBLIC_DEMO_ORG_ID to the uuid of the
 * maxx_organizations row they want every request scoped to. Failing loudly
 * here is intentional: silently falling back to the seed mock org id
 * ("org_riverside_mutual_aid", not a uuid) would produce confusing Postgres
 * errors instead of a clear configuration error.
 */
export function getCurrentOrgId(): string {
  const orgId = process.env.NEXT_PUBLIC_DEMO_ORG_ID;
  if (!orgId) {
    throw new Error(
      "NEXT_PUBLIC_DEMO_ORG_ID is not set. Prod-mode API routes need an organization id to scope " +
        "queries to until Phase 2 auth wires real sessions."
    );
  }
  return orgId;
}

/** Maps a PostgREST/Postgres error to the HTTP status the API routes should return. */
export function supabaseErrorStatus(error: PostgrestError): number {
  // 42501 = insufficient_privilege (RLS policy rejected the query).
  if (error.code === "42501") {
    return 403;
  }
  // 23503/23505 = FK violation / unique violation → bad input from the client.
  if (error.code === "23503" || error.code === "23505") {
    return 400;
  }
  return 500;
}
