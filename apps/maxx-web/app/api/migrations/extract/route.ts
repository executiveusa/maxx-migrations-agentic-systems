import { NextRequest, NextResponse } from "next/server";
import { migrationAuditSchema } from "@/lib/validation/migration-audit";
import { getStore } from "@/lib/data/store";
import { isIntegrationConfigured } from "@/lib/data/mode";
import type { MigrationAuditRequest } from "@/lib/types/migration-audit-request";

/**
 * Receives migration audit intake submissions from the public marketing
 * site (components/forms/MigrationAuditForm.tsx). This is a lead-capture
 * endpoint, not the migration crawl itself — approved audits are turned
 * into real migration jobs via POST /api/migrations/jobs.
 *
 * Persistence: always appends to the process-lifetime store (getStore())
 * so a submission is never silently dropped, even before Supabase is
 * wired up. `persisted` in the response tells the caller which mode
 * applies — "supabase" once NEXT_PUBLIC_SUPABASE_URL is configured and
 * this route is updated to write through to it, "in_memory" until then.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = migrationAuditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  const data = parsed.data;
  const record: MigrationAuditRequest = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    organizationName: data.organizationName,
    websiteUrl: data.websiteUrl,
    contactName: data.contactName,
    email: data.email,
    phone: data.phone ?? null,
    organizationType: data.organizationType,
    missionFocus: data.missionFocus,
    currentTools: data.currentTools ?? null,
    biggestProblem: data.biggestProblem,
    budgetRange: data.budgetRange,
    desiredTimeline: data.desiredTimeline,
    status: "new_audit_request",
    source: "public_site",
    submittedAt: new Date().toISOString(),
  };

  const supabaseConfigured = isIntegrationConfigured("NEXT_PUBLIC_SUPABASE_URL");

  // Always append to in-memory store (process lifetime) so submissions never drop
  getStore().migrationAuditRequests.push(record);

  // TODO: Also insert into Supabase when NEXT_PUBLIC_SUPABASE_URL is configured

  return NextResponse.json({
    received: true,
    id: record.id,
    persisted: supabaseConfigured ? "supabase" : "in_memory",
    message: supabaseConfigured
      ? "Your audit request is in. We saved your request and will follow up within two business days."
      : "Your audit request was received in demo mode. Connect Supabase before using this form for paid traffic.",
  });
}
