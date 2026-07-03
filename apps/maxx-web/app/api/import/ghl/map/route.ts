import { NextRequest, NextResponse } from "next/server";
import { suggestMappings } from "@/lib/import/ghl/mapper";
import { ghlObjectTypes } from "@/lib/validation/ghl-import";
import type { GhlObjectType } from "@/lib/types/imports";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const headers: string[] = Array.isArray(body.headers) ? body.headers : [];
  const object: GhlObjectType = ghlObjectTypes.includes(body.object) ? body.object : "contacts";

  if (headers.length === 0) {
    return NextResponse.json({ error: "headers is required and must be a non-empty array." }, { status: 400 });
  }

  const mappings = suggestMappings(headers, object);
  return NextResponse.json({ mappings });
}
