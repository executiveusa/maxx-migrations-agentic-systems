import { NextRequest, NextResponse } from "next/server";
import { crownAccess, crownError, rpcError } from "@/lib/offers/crown-core-access";

export const dynamic="force-dynamic";
export async function GET(request:NextRequest){
  try{
    const {client,tenant}=await crownAccess(request);
    const {data,error}=await client.from("maxx_offer_drafts")
      .select("id,offer_id,kind,status,payload_hash,created_at,reviewed_at,source_draft_id")
      .eq("tenant_id",tenant.id).order("created_at",{ascending:false}).limit(30);
    if(error) rpcError(error);
    return NextResponse.json({
      offer_id:"maxx-vibe-audit-v1",
      status:data?.length?"internal_drafts_exist":"no_audits_created",
      drafts:data??[],
      pricing_status:"requires_owner_approval",
      external_execution_enabled:false
    },{headers:{"cache-control":"no-store"}});
  }catch(error){return crownError(error);}
}
