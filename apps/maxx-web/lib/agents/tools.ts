import type Anthropic from "@anthropic-ai/sdk";
import { getSupabaseClient } from "@/lib/data/supabase-client";
import { isSeedMode } from "@/lib/data/mode";
import { getStore } from "@/lib/data/store";
import { summarizeValueLedger, moneyByCurrency } from "@/lib/revenue-capture/value-summary";

export type ToolName = "search_contacts" | "get_pipeline" | "get_revenue_summary" | "get_integration_health" | "get_recovery_receipts" | "get_recent_provider_events" | "create_contact" | "move_deal" | "delete_contact";
export function getToolDefinitions(): Anthropic.Tool[] {
  return [
    { name: "search_contacts", description: "Search this business's contacts by name or email.", input_schema: { type: "object", properties: { query: { type: "string" }, limit: { type: "number" } }, required: ["query"] } },
    { name: "get_pipeline", description: "Read this business's opportunity pipeline. Pipeline is not revenue.", input_schema: { type: "object", properties: {}, required: [] } },
    { name: "get_revenue_summary", description: "Read evidence-backed net payment totals, separate bookings and recovery classifications, grouped by currency and confidence. Never add pipeline, bookings or recovery to cash.", input_schema: { type: "object", properties: {}, required: [] } },
    { name: "get_integration_health", description: "Read provider health and verification timestamps.", input_schema: { type: "object", properties: {}, required: [] } },
    { name: "get_recovery_receipts", description: "Read recent weekly Recovery Receipts.", input_schema: { type: "object", properties: { limit: { type: "number" } }, required: [] } },
    { name: "get_recent_provider_events", description: "Read recent provider evidence.", input_schema: { type: "object", properties: { provider: { type: "string" }, limit: { type: "number" } }, required: [] } },
    { name: "create_contact", description: "Create a contact. REQUIRES exact human approval.", input_schema: { type: "object", properties: { firstName: { type: "string" }, lastName: { type: "string" }, email: { type: "string" }, source: { type: "string", enum: ["manual","ghl","imported","form"] }, status: { type: "string", enum: ["lead","active","donor","volunteer","archived"] } }, required: ["firstName","lastName","email"] } },
    { name: "move_deal", description: "Move an opportunity. REQUIRES exact human approval.", input_schema: { type: "object", properties: { opportunityId: { type: "string" }, stageId: { type: "string" } }, required: ["opportunityId","stageId"] } },
    { name: "delete_contact", description: "Delete a contact. REQUIRES exact human approval and is destructive.", input_schema: { type: "object", properties: { contactId: { type: "string" } }, required: ["contactId"] } },
  ];
}
export async function executeTool(toolName: ToolName, toolInput: unknown, orgId: string): Promise<string> {
  try {
    switch (toolName) {
      case "search_contacts": return await executeSearchContacts(toolInput, orgId);
      case "get_pipeline": return await executeGetPipeline(orgId);
      case "get_revenue_summary": return await executeRevenueSummary(orgId);
      case "get_integration_health": return await executeIntegrationHealth(orgId);
      case "get_recovery_receipts": return await executeRecoveryReceipts(toolInput, orgId);
      case "get_recent_provider_events": return await executeRecentProviderEvents(toolInput, orgId);
      case "create_contact": return await executeCreateContact(toolInput, orgId);
      case "move_deal": return await executeMoveDeal(toolInput, orgId);
      case "delete_contact": return await executeDeleteContact(toolInput, orgId);
      default: return JSON.stringify({ error: "Unknown tool" });
    }
  } catch (error) { return JSON.stringify({ error: error instanceof Error ? error.message : "Tool failed" }); }
}
function boundedLimit(input: unknown, fallback: number, maximum: number): number {
  const value = input === undefined ? fallback : Number(input);
  if (!Number.isInteger(value) || value < 1) throw new Error("Invalid result limit");
  return Math.min(value, maximum);
}
async function executeSearchContacts(input: unknown, orgId: string) {
  const params = input as { query: string; limit?: number };
  if (typeof params.query !== "string" || !params.query.trim()) throw new Error("Search query is required");
  const limit = boundedLimit(params.limit, 10, 50);
  if (isSeedMode()) {
    const query = params.query.toLowerCase();
    return JSON.stringify({ contacts: getStore().contacts.filter((c) => c.firstName.toLowerCase().includes(query) || c.lastName.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)).slice(0, limit) });
  }
  const { data, error } = await getSupabaseClient().from("maxx_contacts").select("id, first_name, last_name, email, phone, status, source").eq("organization_id", orgId).or(`first_name.ilike.%${params.query}%,last_name.ilike.%${params.query}%,email.ilike.%${params.query}%`).limit(limit);
  if (error) throw new Error(error.message);
  return JSON.stringify({ contacts: data ?? [] });
}
async function executeGetPipeline(orgId: string) {
  if (isSeedMode()) return JSON.stringify({ opportunities: getStore().opportunities.slice(0, 20) });
  const { data, error } = await getSupabaseClient().from("maxx_opportunities").select("id, title, stage_id, contact_id, value_cents, currency, updated_at, maxx_contacts(first_name,last_name)").eq("organization_id", orgId).order("updated_at", { ascending: false }).limit(50);
  if (error) throw new Error(error.message);
  return JSON.stringify({ opportunities: data ?? [], count: data?.length ?? 0, truncated: (data?.length ?? 0) === 50 });
}
async function executeRevenueSummary(orgId: string) {
  if (isSeedMode()) return JSON.stringify({ evidenceState: "seed", message: "Revenue evidence is unavailable in seed mode." });
  const supabase = getSupabaseClient();
  const ledger = [];
  const opportunities = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from("maxx_value_ledger_entries").select("entry_type, amount_cents, currency, confidence, source_provider, source_ref, occurred_at").eq("organization_id", orgId).order("id").range(offset, offset + 499);
    if (error) throw new Error(error.message);
    ledger.push(...(data ?? []));
    if (!data?.length || data.length < 500) break;
  }
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from("maxx_opportunities").select("id, value_cents, currency, updated_at").eq("organization_id", orgId).order("id").range(offset, offset + 499);
    if (error) throw new Error(error.message);
    opportunities.push(...(data ?? []));
    if (!data?.length || data.length < 500) break;
  }
  return JSON.stringify({ currencies: summarizeValueLedger(ledger), pipelineByCurrency: moneyByCurrency(opportunities), openOpportunityCount: opportunities.length, recentEvidence: [...ledger].sort((a,b) => b.occurred_at.localeCompare(a.occurred_at)).slice(0,10), evidencePolicy: "Net payments only; bookings, recovery classifications and pipeline are non-additive. No incremental revenue is inferred." });
}
async function executeIntegrationHealth(orgId: string) {
  if (isSeedMode()) return JSON.stringify({ integrations: [], evidenceState: "seed" });
  const { data, error } = await getSupabaseClient().from("maxx_integration_connections").select("provider, status, external_account_id, last_verified_at, last_event_at, health_message, sync_cursor").eq("organization_id", orgId).order("provider");
  if (error) throw new Error(error.message);
  return JSON.stringify({ integrations: data ?? [] });
}
async function executeRecoveryReceipts(input: unknown, orgId: string) {
  if (isSeedMode()) return JSON.stringify({ receipts: [], evidenceState: "seed" });
  const params = input as { limit?: number };
  const { data, error } = await getSupabaseClient().from("maxx_recovery_receipts").select("id, period_start, period_end, verified_revenue_cents, attributed_revenue_cents, estimated_value_cents, summary, generated_at").eq("organization_id", orgId).order("period_end", { ascending: false }).limit(boundedLimit(params.limit, 8, 20));
  if (error) throw new Error(error.message);
  return JSON.stringify({ receipts: data ?? [] });
}
async function executeRecentProviderEvents(input: unknown, orgId: string) {
  if (isSeedMode()) return JSON.stringify({ events: [], evidenceState: "seed" });
  const params = input as { provider?: string; limit?: number };
  let query = getSupabaseClient().from("maxx_provider_events").select("id, provider, provider_event_id, event_type, direction, evidence_state, processing_status, correlation_key, occurred_at").eq("organization_id", orgId).order("occurred_at", { ascending: false }).limit(boundedLimit(params.limit, 20, 100));
  if (params.provider) query = query.eq("provider", params.provider);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return JSON.stringify({ events: data ?? [] });
}
async function executeCreateContact(input: unknown, orgId: string) {
  const params = input as { firstName: string; lastName: string; email: string; source?: string; status?: string };
  if (isSeedMode()) {
    const now = new Date().toISOString();
    const contact = { id: `contact_${Date.now()}`, organizationId: orgId, firstName: params.firstName, lastName: params.lastName, email: params.email, phone: undefined, tags: [], status: params.status ?? "lead", source: params.source ?? "manual", createdAt: now, updatedAt: now, notes: [], timeline: [] };
    getStore().contacts.push(contact as never);
    return JSON.stringify({ contact, created: true });
  }
  const { data, error } = await getSupabaseClient().from("maxx_contacts").insert({ organization_id: orgId, first_name: params.firstName, last_name: params.lastName, email: params.email, status: params.status ?? "lead", source: params.source ?? "manual" }).select("id, first_name, last_name, email, status, source").single();
  if (error) throw new Error(error.message);
  return JSON.stringify({ contact: data, created: true });
}
async function executeMoveDeal(input: unknown, orgId: string) {
  const params = input as { opportunityId: string; stageId: string };
  if (isSeedMode()) {
    const opp = getStore().opportunities.find((o) => o.id === params.opportunityId);
    if (!opp) return JSON.stringify({ error: "Opportunity not found" });
    opp.stageId = params.stageId; opp.updatedAt = new Date().toISOString();
    return JSON.stringify({ opportunity: opp, moved: true });
  }
  const { data, error } = await getSupabaseClient().from("maxx_opportunities").update({ stage_id: params.stageId, updated_at: new Date().toISOString() }).eq("id", params.opportunityId).eq("organization_id", orgId).select("id, title, stage_id").single();
  if (error) throw new Error(error.message);
  return JSON.stringify({ opportunity: data, moved: true });
}
async function executeDeleteContact(input: unknown, orgId: string) {
  const params = input as { contactId: string };
  if (isSeedMode()) {
    const store = getStore(); const index = store.contacts.findIndex((c) => c.id === params.contactId);
    if (index < 0) return JSON.stringify({ error: "Contact not found" });
    store.contacts.splice(index, 1);
    return JSON.stringify({ deleted: true, contactId: params.contactId });
  }
  const { error } = await getSupabaseClient().from("maxx_contacts").delete().eq("id", params.contactId).eq("organization_id", orgId);
  if (error) throw new Error(error.message);
  return JSON.stringify({ deleted: true, contactId: params.contactId });
}
