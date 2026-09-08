import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/supabase-auth";
import { getSupabaseClient } from "@/lib/data/supabase-client";

export type TenantAuthorizationCode = "UNAUTHENTICATED" | "ORG_NOT_SET" | "NOT_A_MEMBER";

export class TenantAuthorizationError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403,
    public readonly code: TenantAuthorizationCode,
  ) {
    super(message);
    this.name = "TenantAuthorizationError";
  }
}

/**
 * Fail-closed tenant resolver for prod-mode (isSeedMode() === false) API routes.
 *
 * Derives the organization id from the authenticated session only — never
 * from a client-supplied header/body/query param, and never from
 * NEXT_PUBLIC_DEMO_ORG_ID (that value only backs the seed-mode branch each
 * route takes separately). The claimed org_id in the session's metadata is
 * then re-verified against maxx_organization_members directly: these routes
 * still run on the service-role client (see lib/data/supabase-client.ts),
 * which bypasses RLS and therefore never evaluates maxx_is_org_member()'s
 * auth.uid() check, so that membership check has to happen here instead of
 * being left to Postgres.
 *
 * Throws TenantAuthorizationError (401 unauthenticated, 403 no/foreign org)
 * instead of ever falling back to a default organization. Callers must not
 * catch this and substitute a default — see tenantErrorResponse.
 */
export async function resolveAuthorizedOrgId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) {
    throw new TenantAuthorizationError("Not authenticated.", 401, "UNAUTHENTICATED");
  }

  const orgId = (user.user_metadata?.org_id as string | undefined) ?? null;
  if (!orgId) {
    throw new TenantAuthorizationError(
      "Authenticated user has no organization assigned.",
      403,
      "ORG_NOT_SET",
    );
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("maxx_organization_members")
    .select("id")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (!data) {
    throw new TenantAuthorizationError(
      "Authenticated user is not a member of this organization.",
      403,
      "NOT_A_MEMBER",
    );
  }

  return orgId;
}

/** Maps a caught error to the HTTP response an API route should return. */
export function tenantErrorResponse(err: unknown): NextResponse {
  if (err instanceof TenantAuthorizationError) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
  }
  return NextResponse.json({ error: (err as Error).message }, { status: 500 });
}
