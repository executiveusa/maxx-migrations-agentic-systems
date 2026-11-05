#!/usr/bin/env node

const API = (
  process.env.MAXX_MIGRATIONS_URL || "http://127.0.0.1:3000"
).replace(/\/$/, "");
const API_KEY = process.env.MAXX_MIGRATIONS_API_KEY;
// Optional short-lived agent JWT. Never substitute the general machine key for tenant auth.
const OFFER_AGENT_TOKEN = process.env.MAXX_CROWN_AGENT_ACCESS_TOKEN;
let buffer = "";

async function call(path, options = {}) {
  if (!API_KEY) throw new Error("MAXX_MIGRATIONS_API_KEY is required");
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      "x-maxx-migrations-api-key": API_KEY,
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      payload.error || `MAXX Migrations returned ${response.status}`
    );
  return payload;
}

async function offerCall(path, options = {}) {
  if (!OFFER_AGENT_TOKEN) throw new Error("Crown offer requires an authenticated agent token");
  const response = await fetch(API + path, {
    ...options,
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + OFFER_AGENT_TOKEN,
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.code || "Crown offer request failed: " + response.status);
  return payload;
}

function write(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

function toolResult(id, payload) {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    },
  };
}

async function handle(message) {
  const { id, method, params = {} } = message;

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params.protocolVersion || "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "maxx-migrations", version: "1.0.0" },
      },
    };
  }
  if (method === "notifications/initialized") return null;
  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "maxx_migrations_health",
            description:
              "Check the canonical MAXX Migrations/ICM backend machine surface.",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "maxx_migrations_manifest",
            description:
              "Read the canonical three-repository federation, ICM authority, evidence states, and public commercial buckets.",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "maxx_migrations_route",
            description:
              "Route a business condition to Reset, Momentum, Scale, or Launch and return the canonical ICM context path.",
            inputSchema: {
              type: "object",
              properties: { condition: { type: "string" } },
              required: ["condition"],
            },
          },
          ...(OFFER_AGENT_TOKEN ? [
            {
              name: "maxx_offer_list",
              description: "List internal Crown & Core offers using the authenticated per-agent tenant token. Not a signed commercial offer.",
              inputSchema: { type: "object", properties: {}, additionalProperties: false }
            },
            {
              name: "maxx_audit_prepare",
              description: "Prepare an internal source-grounded, unpriced Crown & Core Vibe Audit draft. No external effects. Requires verified tenant role.",
              inputSchema: {
                type: "object",
                properties: {
                  request_id: { type: "string", format: "uuid" },
                  idempotency_key: { type: "string", minLength: 12, maxLength: 120 },
                  business_name: { type: "string", const: "Crown & Core" },
                  sources: { type: "array", items: {
                    type: "object", properties: {
                      id: { type: "string" }, url: { type: "string" }, retrieved_at: { type: "string" }
                    }, required: ["id", "url"], additionalProperties: false
                  } },
                  findings: { type: "array", items: {
                    type: "object", properties: {
                      observation: { type: "string" }, recommendation: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] },
                      evidence_refs: { type: "array", items: { type: "string" } }
                    }, required: ["observation", "recommendation"], additionalProperties: false
                  } }
                },
                required: ["request_id", "idempotency_key", "business_name", "sources", "findings"],
                additionalProperties: false
              }
            },
            {
              name: "maxx_proposal_prepare",
              description: "Prepare an unpriced internal proposal from an independently reviewed Crown & Core audit.",
              inputSchema: {
                type: "object", properties: {
                  request_id: { type: "string", format: "uuid" },
                  idempotency_key: { type: "string", minLength: 12, maxLength: 120 },
                  source_audit_id: { type: "string", format: "uuid" }
                },
                required: ["request_id", "idempotency_key", "source_audit_id"],
                additionalProperties: false
              }
            },
            {
              name: "maxx_offer_status",
              description: "Read tenant-isolated internal Crown & Core audit/proposal status.",
              inputSchema: { type: "object", properties: {}, additionalProperties: false }
            }
          ] : []),
        ],
      },
    };
  }
  if (method === "tools/call") {
    const name = params.name;
    const args = params.arguments || {};
    if (name === "maxx_migrations_health") {
      return toolResult(id, await call("/api/system/health"));
    }
    if (name === "maxx_migrations_manifest") {
      return toolResult(id, await call("/api/system/manifest"));
    }
    if (name === "maxx_migrations_route") {
      const condition = String(args.condition || "").trim();
      if (!condition) throw new Error("condition is required");
      return toolResult(
        id,
        await call("/api/system/route", {
          method: "POST",
          body: JSON.stringify({ condition }),
        })
      );
    }
    if (name === "maxx_offer_list") return toolResult(id, await offerCall("/api/offers/crown-core"));
    if (name === "maxx_offer_status") return toolResult(id, await offerCall("/api/offers/crown-core/status"));
    if (name === "maxx_audit_prepare") return toolResult(id, await offerCall("/api/offers/crown-core/audits", {
      method: "POST", body: JSON.stringify(args)
    }));
    if (name === "maxx_proposal_prepare") return toolResult(id, await offerCall("/api/offers/crown-core/proposals", {
      method: "POST", body: JSON.stringify(args)
    }));
    throw new Error(`Unknown MAXX Migrations tool: ${name}`);
  }
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    let message;
    try {
      message = JSON.parse(line);
      const response = await handle(message);
      if (response) write(response);
    } catch (error) {
      write({
        jsonrpc: "2.0",
        id: message?.id ?? null,
        error: {
          code: -32000,
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }
});
