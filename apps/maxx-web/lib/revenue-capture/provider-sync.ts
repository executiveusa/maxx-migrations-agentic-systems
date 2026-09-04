import { createHash } from "node:crypto";
import { getSupabaseClient } from "@/lib/data/supabase-client";
import { recordProviderEvent, stableCorrelationKey } from "@/lib/revenue-capture/runtime";

export type SyncProvider =
  | "google_analytics"
  | "search_console"
  | "google_business_profile"
  | "google_ads"
  | "meta_ads"
  | "quickbooks"
  | "xero"
  | "hubspot"
  | "salesforce"
  | "erpnext";

interface ConnectionRow {
  id: string;
  organization_id: string;
  provider: SyncProvider;
  external_account_id: string | null;
  secret_ref: string | null;
  config: Record<string, unknown> | null;
  status: string;
}

export interface SyncResult {
  provider: string;
  connectionId: string;
  organizationId: string;
  status: "synced" | "skipped" | "failed";
  eventId?: string;
  message?: string;
}

function envSecret(ref: string | null): string {
  if (!ref?.startsWith("env:")) throw new Error("Connection secret_ref must use env:VARIABLE_NAME.");
  const name = ref.slice(4);
  if (!/^[A-Z][A-Z0-9_]{2,100}$/.test(name)) throw new Error("Invalid environment secret reference.");
  const value = process.env[name];
  if (!value) throw new Error(`Required secret ${name} is not configured.`);
  return value;
}

function configString(config: Record<string, unknown>, key: string, required = true): string {
  const value = config[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (required) throw new Error(`Connection config is missing ${key}.`);
  return "";
}

function configEnv(config: Record<string, unknown>, key: string): string {
  const name = configString(config, key);
  if (!/^[A-Z][A-Z0-9_]{2,100}$/.test(name)) throw new Error(`Invalid environment variable name in ${key}.`);
  const value = process.env[name];
  if (!value) throw new Error(`Required secret ${name} is not configured.`);
  return value;
}

async function jsonFetch(url: string, init: RequestInit): Promise<unknown> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const text = await response.text();
  if (!response.ok) throw new Error(`Provider API returned HTTP ${response.status}.`);
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Provider API returned non-JSON data.");
  }
}

function summaryHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function pullConnection(connection: ConnectionRow): Promise<unknown> {
  const config = connection.config ?? {};
  const token = envSecret(connection.secret_ref);

  switch (connection.provider) {
    case "google_analytics": {
      const propertyId = configString(config, "property_id");
      return jsonFetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }, { name: "campaignName" }],
          metrics: [{ name: "sessions" }, { name: "keyEvents" }, { name: "purchaseRevenue" }],
          limit: 1000,
        }),
      });
    }
    case "search_console": {
      const siteUrl = configString(config, "site_url");
      return jsonFetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
          endDate: today(),
          dimensions: ["query", "page"],
          rowLimit: 1000,
        }),
      });
    }
    case "google_business_profile": {
      const account = configString(config, "account_name");
      return jsonFetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account}/locations?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
    case "google_ads": {
      const customerId = configString(config, "customer_id").replace(/-/g, "");
      const apiVersion = configString(config, "api_version");
      const developerToken = configEnv(config, "developer_token_env");
      const loginCustomerId = configString(config, "login_customer_id", false).replace(/-/g, "");
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        "developer-token": developerToken,
        "Content-Type": "application/json",
      };
      if (loginCustomerId) headers["login-customer-id"] = loginCustomerId;
      return jsonFetch(`https://googleads.googleapis.com/${apiVersion}/customers/${customerId}/googleAds:searchStream`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: "SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks, metrics.conversions, metrics.cost_micros, metrics.conversions_value FROM campaign WHERE segments.date DURING LAST_7_DAYS",
        }),
      });
    }
    case "meta_ads": {
      const version = configString(config, "graph_api_version");
      const adAccountId = configString(config, "ad_account_id").replace(/^act_/, "");
      const fields = "campaign_id,campaign_name,impressions,clicks,spend,actions,action_values";
      const url = new URL(`https://graph.facebook.com/${version}/act_${adAccountId}/insights`);
      url.searchParams.set("fields", fields);
      url.searchParams.set("date_preset", "last_7d");
      return jsonFetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
    }
    case "quickbooks": {
      const companyId = configString(config, "company_id");
      const query = encodeURIComponent("select Id, TxnDate, TotalAmt, Balance, CustomerRef from Invoice maxresults 100");
      return jsonFetch(`https://quickbooks.api.intuit.com/v3/company/${companyId}/query?query=${query}&minorversion=75`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
    }
    case "xero": {
      const tenantId = configString(config, "tenant_id");
      return jsonFetch("https://api.xero.com/api.xro/2.0/Invoices?page=1", {
        headers: { Authorization: `Bearer ${token}`, "Xero-tenant-id": tenantId, Accept: "application/json" },
      });
    }
    case "hubspot": {
      return jsonFetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,phone,lifecyclestage", {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    case "salesforce": {
      const instanceUrl = configString(config, "instance_url");
      const parsed = new URL(instanceUrl);
      if (parsed.protocol !== "https:" || !/(^|\.)salesforce\.com$/i.test(parsed.hostname)) {
        throw new Error("Salesforce instance_url must be an https://*.salesforce.com host.");
      }
      const apiVersion = configString(config, "api_version");
      const query = encodeURIComponent("SELECT Id, FirstName, LastName, Email, Phone, LastModifiedDate FROM Contact ORDER BY LastModifiedDate DESC LIMIT 100");
      return jsonFetch(`${parsed.origin}/services/data/${apiVersion}/query?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    case "erpnext": {
      const baseUrl = configString(config, "base_url");
      const parsed = new URL(baseUrl);
      const allowedHosts = (process.env.MAXX_ERP_ALLOWED_HOSTS ?? "")
        .split(",")
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean);
      if (parsed.protocol !== "https:" || !allowedHosts.includes(parsed.hostname.toLowerCase())) {
        throw new Error("ERPNext host is not present in MAXX_ERP_ALLOWED_HOSTS.");
      }
      const doctype = configString(config, "health_doctype", false) || "Customer";
      return jsonFetch(`${parsed.origin}/api/resource/${encodeURIComponent(doctype)}?limit_page_length=20`, {
        headers: { Authorization: token, Accept: "application/json" },
      });
    }
  }
}

/**
 * Pull one connected provider into the canonical event bus. Raw provider payloads are
 * kept as evidence snapshots; no revenue claim is created from marketing/accounting
 * metrics without a provider-native payment or explicit attribution rule.
 */
export async function syncProviderConnection(connection: ConnectionRow): Promise<SyncResult> {
  try {
    const snapshot = await pullConnection(connection);
    const hash = summaryHash(snapshot);
    const providerEventId = `snapshot:${today()}:${hash.slice(0, 24)}`;
    const event = await recordProviderEvent({
      organizationId: connection.organization_id,
      provider: connection.provider,
      providerEventId,
      eventType: `${connection.provider}.snapshot`,
      direction: "inbound",
      connectionId: connection.id,
      correlationKey: stableCorrelationKey([connection.organization_id, connection.provider, connection.external_account_id]),
      payload: { snapshot },
      evidence: { source: "provider_api", contentSha256: hash, fetchedAt: new Date().toISOString() },
      evidenceState: "VERIFIED",
      processingStatus: "processed",
    });

    const supabase = getSupabaseClient();
    await supabase
      .from("maxx_integration_connections")
      .update({ last_verified_at: new Date().toISOString(), health_message: null })
      .eq("id", connection.id)
      .eq("organization_id", connection.organization_id);

    return {
      provider: connection.provider,
      connectionId: connection.id,
      organizationId: connection.organization_id,
      status: "synced",
      eventId: event.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync failure";
    const supabase = getSupabaseClient();
    await supabase
      .from("maxx_integration_connections")
      .update({ health_message: message })
      .eq("id", connection.id)
      .eq("organization_id", connection.organization_id);
    return {
      provider: connection.provider,
      connectionId: connection.id,
      organizationId: connection.organization_id,
      status: "failed",
      message,
    };
  }
}

export async function syncAllProviderConnections(): Promise<SyncResult[]> {
  const supabase = getSupabaseClient();
  const providers: SyncProvider[] = [
    "google_analytics",
    "search_console",
    "google_business_profile",
    "google_ads",
    "meta_ads",
    "quickbooks",
    "xero",
    "hubspot",
    "salesforce",
    "erpnext",
  ];
  const { data, error } = await supabase
    .from("maxx_integration_connections")
    .select("id, organization_id, provider, external_account_id, secret_ref, config, status")
    .eq("status", "connected")
    .in("provider", providers);
  if (error) throw new Error(`Could not load integration connections: ${error.message}`);

  const results: SyncResult[] = [];
  for (const row of data ?? []) {
    results.push(await syncProviderConnection(row as ConnectionRow));
  }
  return results;
}
