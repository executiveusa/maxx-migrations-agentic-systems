import { NextRequest, NextResponse } from "next/server";
import { migrationAuditSchema } from "@/lib/validation/migration-audit";

/**
 * Receives migration audit intake submissions from the public marketing
 * site (components/forms/MigrationAuditForm.tsx). This is a lead-capture
 * endpoint, not the migration crawl itself — approved audits are turned
 * into real migration jobs via POST /api/migrations/jobs.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = migrationAuditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  return NextResponse.json({
    received: true,
    message: "Migration audit request received. A human from Maxx Migrations will follow up within two business days.",
  });
}
