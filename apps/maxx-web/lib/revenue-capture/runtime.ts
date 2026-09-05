import { createHash } from "node:crypto";
import { getSupabaseClient } from "@/lib/data/supabase-client";

export type EvidenceState = "VERIFIED" | "ATTRIBUTED" | "ESTIMATED" | "UNKNOWN";
export type ProviderEventDirection = "inbound" | "outbound" | "internal";

export interface TenantBinding {
  organizationId: string;
  organizationName: string;
  connectionId: string | null;
}

export interface RecordProviderEventInput {
  organizationId: string;
  provider: string;
  providerEventId: string;
  eventType: string;
  direction?: ProviderEventDirection;
  occurredAt?: string;
  contactId?: string | null;
  opportunityId?: string | null;
  connectionId?: string | null;
  correlationKey?: string | null;
  payload?: Record<string, unknown>;
  evidence?: Record<string, unknown>;
  evidenceState?: EvidenceState;
  processingStatus?: "received" | "processed" | "ignored" | "failed" | "needs_human";
  errorMessage?: string | null;
}

export interface ValueLedgerInput {
  organizationId: string;
  contactId?: string | null;
  opportunityId?: string | null;
  providerEventId?: string | null;
  entryType:
    | "lead_value"
    | "opportunity_value"
    | "recovered_revenue"
    | "booked_revenue"
    | "payment"
    | "refund"
    | "lost_revenue"
    | "cost"
    | "adjustment";
  amountCents: number;
  currency?: string;
  confidence: EvidenceState;
  sourceProvider?: string | null;
  sourceRef?: string | null;
  attributionModel?: string | null;
  attributionReason?: string | null;
  evidence?: Record<string, unknown>;
  occurredAt?: string;
}

function normalizePhone(value: string): string {
  return value.replace(/[^+\d]/g, "");
}

export function stableCorrelationKey(parts: Array<string | null | undefined>): string {
  const material = parts.filter(Boolean).join("|");
  return createHash("sha256").update(material).digest("hex");
}

export async function resolveTenantByPhoneNumber(toNumber: string): Promise<TenantBinding | null> {
  const supabase = getSupabaseClient();
  const normalized = normalizePhone(toNumber);
  if (!normalized) return null;

  const { data: phone, error: phoneError } = await supabase
    .from("maxx_phone_numbers")
    .select("organization_id, number")
    .eq("number", normalized)
    .maybeSingle();
  if (phoneError) throw new Error(`Phone tenant lookup failed: ${phoneError.message}`);
  if (!phone?.organization_id) return null;

  const [{ data: org, error: orgError }, { data: connection, error: connectionError }] = await Promise.all([
    supabase.from("maxx_organizations").select("id, name").eq("id", phone.organization_id).single(),
    supabase
      .from("maxx_integration_connections")
      .select("id, status")
      .eq("organization_id", phone.organization_id)
      .eq("provider", "twilio")
      .maybeSingle(),
  ]);
  if (orgError) throw new Error(`Organization lookup failed: ${orgError.message}`);
  if (connectionError) throw new Error(`Twilio connection lookup failed: ${connectionError.message}`);

  return {
    organizationId: phone.organization_id,
    organizationName: org?.name ?? "the business",
    connectionId: connection?.status === "connected" ? connection.id : null,
  };
}

export async function resolveTenantByProviderAccount(
  provider: string,
  externalAccountId: string,
): Promise<TenantBinding | null> {
  if (!provider || !externalAccountId) return null;
  const supabase = getSupabaseClient();
  const { data: connection, error } = await supabase
    .from("maxx_integration_connections")
    .select("id, organization_id, status, maxx_organizations(name)")
    .eq("provider", provider)
    .eq("external_account_id", externalAccountId)
    .maybeSingle();
  if (error) throw new Error(`Provider tenant lookup failed: ${error.message}`);
  if (!connection?.organization_id) return null;

  const joined = connection.maxx_organizations as { name?: string } | Array<{ name?: string }> | null;
  const organizationName = Array.isArray(joined) ? joined[0]?.name : joined?.name;
  return {
    organizationId: connection.organization_id,
    organizationName: organizationName ?? "the business",
    connectionId: connection.status === "connected" ? connection.id : null,
  };
}

export async function recordProviderEvent(input: RecordProviderEventInput) {
  const supabase = getSupabaseClient();
  const row = {
    organization_id: input.organizationId,
    provider: input.provider,
    provider_event_id: input.providerEventId,
    event_type: input.eventType,
    direction: input.direction ?? "inbound",
    occurred_at: input.occurredAt ?? new Date().toISOString(),
    contact_id: input.contactId ?? null,
    opportunity_id: input.opportunityId ?? null,
    connection_id: input.connectionId ?? null,
    correlation_key: input.correlationKey ?? null,
    payload: input.payload ?? {},
    evidence: input.evidence ?? {},
    evidence_state: input.evidenceState ?? "UNKNOWN",
    processing_status: input.processingStatus ?? "received",
    error_message: input.errorMessage ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("maxx_provider_events")
    .upsert(row, { onConflict: "provider,provider_event_id", ignoreDuplicates: false })
    .select("id, organization_id, provider, provider_event_id, processing_status")
    .single();
  if (error) throw new Error(`Provider event persistence failed: ${error.message}`);

  if (input.connectionId) {
    await supabase
      .from("maxx_integration_connections")
      .update({ last_event_at: new Date().toISOString(), health_message: null })
      .eq("id", input.connectionId)
      .eq("organization_id", input.organizationId);
  }
  return data;
}

export async function recordValueLedgerEntry(input: ValueLedgerInput) {
  const supabase = getSupabaseClient();
  const row = {
    organization_id: input.organizationId,
    contact_id: input.contactId ?? null,
    opportunity_id: input.opportunityId ?? null,
    provider_event_id: input.providerEventId ?? null,
    entry_type: input.entryType,
    amount_cents: Math.trunc(input.amountCents),
    currency: input.currency ?? "USD",
    confidence: input.confidence,
    source_provider: input.sourceProvider ?? null,
    source_ref: input.sourceRef ?? null,
    attribution_model: input.attributionModel ?? null,
    attribution_reason: input.attributionReason ?? null,
    evidence: input.evidence ?? {},
    occurred_at: input.occurredAt ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (input.sourceProvider && input.sourceRef) {
    const { data, error } = await supabase
      .from("maxx_value_ledger_entries")
      .upsert(row, {
        onConflict: "organization_id,entry_type,source_provider,source_ref",
        ignoreDuplicates: false,
      })
      .select("id")
      .single();
    if (error) throw new Error(`Value Ledger persistence failed: ${error.message}`);
    return data;
  }

  const { data, error } = await supabase.from("maxx_value_ledger_entries").insert(row).select("id").single();
  if (error) throw new Error(`Value Ledger persistence failed: ${error.message}`);
  return data;
}

export async function findContactByPhone(organizationId: string, phone: string) {
  const supabase = getSupabaseClient();
  const normalized = normalizePhone(phone);
  const { data, error } = await supabase
    .from("maxx_contacts")
    .select("id, first_name, last_name, phone")
    .eq("organization_id", organizationId)
    .eq("phone", normalized)
    .maybeSingle();
  if (error) throw new Error(`Contact lookup failed: ${error.message}`);
  return data;
}
