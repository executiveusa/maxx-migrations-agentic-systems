import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { boundedJson, crownAccess, crownError, demandSameOrigin, CrownApiError, rpcError } from "@/lib/offers/crown-core-access";

export const dynamic="force-dynamic";
const schema=z.object({
  draft_id:z.string().uuid(),
  decision:z.enum(["review","reject"]),
  expected_hash:z.string().regex(/^[0-9a-f]{64}$/)
}).strict();

export async function POST(request:NextRequest){
  try{
    demandSameOrigin(request);
    const {client,tenant,role}=await crownAccess(request);
    if(role!=="owner"&&role!=="reviewer") throw new CrownApiError("REVIEW_FORBIDDEN",403);
    const p=schema.safeParse(await boundedJson(request));
    if(!p.success) throw new CrownApiError("INPUT_INVALID",400);
    const {data,error}=await client.rpc("maxx_review_offer_draft",{
      p_tenant_id:tenant.id,p_draft_id:p.data.draft_id,
      p_decision:p.data.decision,p_expected_hash:p.data.expected_hash
    });
    if(error||!data) rpcError(error);
    return NextResponse.json({
      ...data,approval_type:"internal_evidence_review_only",
      external_actions_approved:false,external_side_effects:0
    },{headers:{"cache-control":"no-store"}});
  }catch(error){return crownError(error);}
}
