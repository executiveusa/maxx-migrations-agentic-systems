import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { getSupabaseAuth } from "@/lib/auth/supabase-auth";

type Tenant = { id: string; name: string; slug: string };
export type CrownAccess = {
  client: SupabaseClient;
  tenant: Tenant;
  user: User;
  role: string;
};

export class CrownApiError extends Error {
  constructor(public readonly code: string, public readonly httpStatus: number) {
    super(code);
    this.name = "CrownApiError";
  }
}

export async function crownAccess(request: NextRequest): Promise<CrownAccess> {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : null;
  let client: SupabaseClient;
  if (authorization && !token) throw new CrownApiError("UNAUTHENTICATED", 401);

  if (token) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) throw new CrownApiError("DEPENDENCY_UNAVAILABLE", 503);
    client = createSupabaseClient(url, anon, {
      global: { headers: { Authorization: "Bearer " + token } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } else {
    client = await getSupabaseAuth();
  }

  const { data: auth, error: authError } = token
    ? await client.auth.getUser(token)
    : await client.auth.getUser();
  if (authError || !auth.user) throw new CrownApiError("UNAUTHENTICATED", 401);

  // RLS policies on both queries enforce authenticated tenant membership.
  const { data: tenant, error: tenantError } = await client.from("maxx_icm_tenants")
    .select("id,name,slug").eq("slug", "crown-and-core").maybeSingle();
  if (tenantError) throw new CrownApiError("DEPENDENCY_UNAVAILABLE", 503);
  if (!tenant) throw new CrownApiError("TENANT_NOT_FOUND_OR_FORBIDDEN", 403);

  const { data: membership, error: membershipError } = await client.from("maxx_icm_memberships")
    .select("role").eq("tenant_id", tenant.id).eq("user_id", auth.user.id).maybeSingle();
  if (membershipError) throw new CrownApiError("DEPENDENCY_UNAVAILABLE", 503);
  if (!membership) throw new CrownApiError("FORBIDDEN", 403);

  return { client, tenant, user: auth.user, role: membership.role };
}

export function demandSameOrigin(request: NextRequest) {
  // A browser cookie cannot be used to perform a cross-site mutation.
  // Agent tokens are sent explicitly via Authorization (not ambient cookies).
  if (request.headers.get("authorization")?.startsWith("Bearer ")) return;
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    throw new CrownApiError("ORIGIN_REQUIRED", 403);
  }
}

export async function boundedJson(request: NextRequest, maxBytes = 16_000): Promise<unknown> {
  const length = request.headers.get("content-length");
  if (length && Number(length) > maxBytes) throw new CrownApiError("INPUT_TOO_LARGE", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new CrownApiError("INPUT_INVALID", 400);
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    bytes += part.value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new CrownApiError("INPUT_TOO_LARGE", 413);
    }
    chunks.push(part.value);
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)); }
  catch { throw new CrownApiError("INPUT_INVALID", 400); }
}

export function crownError(error: unknown) {
  if (error instanceof CrownApiError) {
    return NextResponse.json({ status:"error", code: error.code }, { status: error.httpStatus });
  }
  return NextResponse.json({ status:"error", code:"DEPENDENCY_UNAVAILABLE" }, { status:503 });
}

export function rpcError(error: { code?: string; message?: string } | null): never {
  if (!error) throw new CrownApiError("DEPENDENCY_UNAVAILABLE",503);
  if (error.code === "42501") throw new CrownApiError("FORBIDDEN",403);
  if (error.code === "23505") throw new CrownApiError("IDEMPOTENCY_CONFLICT",409);
  if (error.message?.includes("RATE_LIMITED")) throw new CrownApiError("RATE_LIMITED",429);
  if (error.code === "22023") throw new CrownApiError("INPUT_INVALID_OR_STATE_CONFLICT",400);
  throw new CrownApiError("DEPENDENCY_UNAVAILABLE",503);
}
