import { describe, expect, it, vi, beforeEach } from "vitest";

const getCurrentUser = vi.fn();
vi.mock("@/lib/auth/supabase-auth", () => ({
  getCurrentUser: () => getCurrentUser(),
}));

const maybeSingle = vi.fn();
const getSupabaseClient = vi.fn(() => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          maybeSingle,
        }),
      }),
    }),
  }),
}));
vi.mock("@/lib/data/supabase-client", () => ({
  getSupabaseClient: () => getSupabaseClient(),
}));

// Imported after the mocks above so resolveAuthorizedOrgId picks them up.
const { resolveAuthorizedOrgId, TenantAuthorizationError, tenantErrorResponse } = await import(
  "@/lib/auth/tenant"
);

describe("resolveAuthorizedOrgId", () => {
  beforeEach(() => {
    getCurrentUser.mockReset();
    maybeSingle.mockReset();
    getSupabaseClient.mockClear();
  });

  it("fails closed with 401 for anonymous access (no session)", async () => {
    getCurrentUser.mockResolvedValue(null);

    await expect(resolveAuthorizedOrgId()).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHENTICATED",
    });
    // No membership lookup should be attempted for an unauthenticated caller.
    expect(getSupabaseClient).not.toHaveBeenCalled();
  });

  it("fails closed with 403 when the session carries no org_id (forged/incomplete identity)", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", user_metadata: {} });

    await expect(resolveAuthorizedOrgId()).rejects.toMatchObject({
      status: 403,
      code: "ORG_NOT_SET",
    });
    expect(getSupabaseClient).not.toHaveBeenCalled();
  });

  it("fails closed with 403 when the claimed org has no membership row (foreign tenant)", async () => {
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      user_metadata: { org_id: "org-not-mine" },
    });
    maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(resolveAuthorizedOrgId()).rejects.toMatchObject({
      status: 403,
      code: "NOT_A_MEMBER",
    });
  });

  it("resolves the org id for a verified member (correct role/tenant)", async () => {
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      user_metadata: { org_id: "org-mine" },
    });
    maybeSingle.mockResolvedValue({ data: { id: "membership-1" }, error: null });

    await expect(resolveAuthorizedOrgId()).resolves.toBe("org-mine");
  });

  it("never falls back to NEXT_PUBLIC_DEMO_ORG_ID (demo/live-provider separation)", async () => {
    const originalDemoOrg = process.env.NEXT_PUBLIC_DEMO_ORG_ID;
    process.env.NEXT_PUBLIC_DEMO_ORG_ID = "org_demo_should_never_be_used";
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      user_metadata: { org_id: "org-mine" },
    });
    maybeSingle.mockResolvedValue({ data: { id: "membership-1" }, error: null });

    const orgId = await resolveAuthorizedOrgId();

    expect(orgId).toBe("org-mine");
    expect(orgId).not.toBe(process.env.NEXT_PUBLIC_DEMO_ORG_ID);
    process.env.NEXT_PUBLIC_DEMO_ORG_ID = originalDemoOrg;
  });

  it("propagates a membership-query failure instead of granting access (missing production configuration)", async () => {
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      user_metadata: { org_id: "org-mine" },
    });
    const dbError = new Error("relation \"maxx_organization_members\" does not exist");
    maybeSingle.mockResolvedValue({ data: null, error: dbError });

    await expect(resolveAuthorizedOrgId()).rejects.toBe(dbError);
  });
});

describe("tenantErrorResponse", () => {
  it("maps TenantAuthorizationError to its declared status and code", async () => {
    const err = new TenantAuthorizationError("nope", 403, "NOT_A_MEMBER");
    const res = tenantErrorResponse(err);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body).toEqual({ error: "nope", code: "NOT_A_MEMBER" });
  });

  it("maps an unrecognized error to 500 without leaking a default org", async () => {
    const res = tenantErrorResponse(new Error("boom"));
    expect(res.status).toBe(500);
  });
});
