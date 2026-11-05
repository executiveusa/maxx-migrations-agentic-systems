import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prepareAudit } from "@/lib/offers/crown-core.mjs";
import { boundedJson, crownAccess, crownError, CrownApiError, demandSameOrigin, rpcError } from "@/lib/offers/crown-core-access";

export const dynamic = "force-dynamic";
const requestSchema = z.object({
  request_id: z.string().uuid(),
  idempotency_key: z.string().min(12).max(120),
  business_name: z.literal("Crown & Core"),
  sources: z.array(z.object({
    id: z.string().min(1).max(60),
    url: z.string().url().max(1200),
    retrieved_at: z.string().datetime().optional()
  }).strict()).max(15),
  findings: z.array(z.object({
    observation: z.string().min(1).max(800),
    recommendation: z.string().min(1).max(800),
    priority: z.enum(["high","medium","low"]).default("medium"),
    evidence_refs: z.array(z.string().min(1).max(60)).max(5).default([])
  }).strict()).max(10)
}).strict();

export async function POST(request: NextRequest) {
  try {
    demandSameOrigin(request);
    const { client, tenant, role } = await crownAccess(request);
    if (role !== "owner" && role !== "operator") throw new CrownApiError("FORBIDDEN",403);
    const parsed = requestSchema.safeParse(await boundedJson(request));
    if (!parsed.success) throw new CrownApiError("INPUT_INVALID",400);
    const artifact = prepareAudit(parsed.data);
    const { data, error } = await client.rpc("maxx_create_offer_draft",{
      p_tenant_id: tenant.id,
      p_kind: "audit",
      p_artifact: artifact,
      p_idempotency_key: parsed.data.idempotency_key,
      p_request_id: parsed.data.request_id,
      p_source_draft_id: null
    });
    if (error || !data) rpcError(error);
    return NextResponse.json({
      ...data, kind:"audit", offer_id:"maxx-vibe-audit-v1",
      review_required:true, price:null, external_side_effects:0
    }, { status: data.replayed ? 200 : 201, headers: {"cache-control":"no-store"} });
  } catch (error) { return crownError(error); }
}

export async function GET(request: NextRequest) {
  try {
    const { client, tenant } = await crownAccess(request);
    const { data, error } = await client.from("maxx_offer_drafts")
      .select("id,kind,status,payload_hash,created_at,reviewed_at,created_by")
      .eq("tenant_id",tenant.id).eq("kind","audit")
      .order("created_at",{ascending:false}).limit(25);
    if (error) rpcError(error);
    return NextResponse.json({ offer_id:"maxx-vibe-audit-v1", drafts:data ?? [] },
      {headers:{"cache-control":"no-store"}});
  } catch (error) { return crownError(error); }
}
