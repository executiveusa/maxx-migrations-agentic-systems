import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prepareProposal } from "@/lib/offers/crown-core.mjs";
import { boundedJson, crownAccess, crownError, CrownApiError, demandSameOrigin, rpcError } from "@/lib/offers/crown-core-access";

export const dynamic = "force-dynamic";
const schema = z.object({
  request_id:z.string().uuid(), idempotency_key:z.string().min(12).max(120),
  source_audit_id:z.string().uuid()
}).strict();

export async function POST(request: NextRequest) {
  try {
    demandSameOrigin(request);
    const {client,tenant,role}=await crownAccess(request);
    if (role!=="owner" && role!=="operator") throw new CrownApiError("FORBIDDEN",403);
    const p=schema.safeParse(await boundedJson(request));
    if (!p.success) throw new CrownApiError("INPUT_INVALID",400);
    const {data:source,error:sourceError}=await client.from("maxx_offer_drafts")
      .select("id,kind,status,payload_hash,artifact")
      .eq("tenant_id",tenant.id).eq("id",p.data.source_audit_id).maybeSingle();
    if (sourceError) rpcError(sourceError);
    if (!source || source.kind!=="audit" || source.status!=="reviewed") {
      throw new CrownApiError("REVIEWED_AUDIT_REQUIRED",409);
    }
    const artifact=prepareProposal(source);
    const {data,error}=await client.rpc("maxx_create_offer_draft",{
      p_tenant_id:tenant.id,p_kind:"proposal",p_artifact:artifact,
      p_idempotency_key:p.data.idempotency_key,p_request_id:p.data.request_id,
      p_source_draft_id:source.id
    });
    if (error||!data) rpcError(error);
    return NextResponse.json({
      ...data,kind:"proposal",price:null,review_required:true,external_side_effects:0
    },{status:data.replayed?200:201,headers:{"cache-control":"no-store"}});
  }catch(error){return crownError(error);}
}
