import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { crownAccess, crownError, CrownApiError, rpcError } from "@/lib/offers/crown-core-access";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success) {
      throw new CrownApiError("INPUT_INVALID", 400);
    }
    const { client, tenant } = await crownAccess(request);
    const { data, error } = await client.from("maxx_offer_drafts")
      .select("id,kind,offer_id,status,artifact,payload_hash,created_at,reviewed_at,created_by,reviewed_by,source_draft_id")
      .eq("tenant_id", tenant.id).eq("id", id).maybeSingle();
    if (error) rpcError(error);
    if (!data) throw new CrownApiError("NOT_FOUND", 404);
    const { data: events, error: eventError } = await client.from("maxx_offer_draft_events")
      .select("event_type,actor_id,payload_hash,created_at")
      .eq("tenant_id", tenant.id).eq("draft_id", id)
      .order("created_at",{ ascending: true }).limit(50);
    if (eventError) rpcError(eventError);
    return NextResponse.json({
      ...data,
      immutable_payload_reference:data.payload_hash,
      events:events ?? [],
      owner_commercial_approval:false,
      external_execution_enabled:false
    },{ headers: { "cache-control":"private, no-store" } });
  } catch (error) { return crownError(error); }
}
