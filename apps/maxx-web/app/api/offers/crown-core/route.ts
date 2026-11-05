import { NextRequest, NextResponse } from "next/server";
import { CROWN_OFFER } from "@/lib/offers/crown-core.mjs";
import { crownAccess, crownError } from "@/lib/offers/crown-core-access";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const { tenant } = await crownAccess(request);
    return NextResponse.json({
      offers: [CROWN_OFFER],
      tenant: { name: tenant.name, slug: tenant.slug },
      runtime: "internal_draft",
      price_approved: false,
      external_execution_enabled: false
    }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return crownError(error); }
}
