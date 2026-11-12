#!/usr/bin/env node
// Read-only MACS Restaurant Proof tool. No merchant secrets or customer PII.
const endpoint = new URL(process.env.MACS_RESTAURANT_API_URL || "http://127.0.0.1:3000");
if (!["https:", "http:"].includes(endpoint.protocol) ||
  (endpoint.protocol === "http:" && !["127.0.0.1", "localhost", "[::1]"].includes(endpoint.hostname)) ||
  endpoint.username || endpoint.password || endpoint.search || endpoint.hash) {
  throw new Error("Only HTTPS or loopback HTTP is permitted for the MACS API endpoint");
}
const agentKey = process.env.MAXX_RESTAURANT_AGENT_KEY;
let buffer = "";
function send(message) { process.stdout.write(JSON.stringify(message) + "\n"); }
function toolResponse(id, data) {
  return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data } };
}
async function report(days) {
  if (!agentKey) throw new Error("MAXX_RESTAURANT_AGENT_KEY is not configured");
  if (![7, 14, 30].includes(days)) throw new Error("days must be 7, 14 or 30");
  const url = new URL("/api/restaurant-growth/metrics?days=" + days, endpoint);
  const response = await fetch(url, {
    headers: { authorization: "Bearer " + agentKey, accept: "application/json" },
    signal: AbortSignal.timeout(15_000), cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("MACS restaurant data unavailable (" + response.status + ")");
  return data;
}
async function handle(message) {
  if (!message || typeof message !== "object") throw new Error("Invalid request");
  const { id, method, params = {} } = message;
  if (method === "initialize") return { jsonrpc: "2.0", id, result: {
    protocolVersion: params.protocolVersion || "2025-06-18",
    capabilities: { tools: {} }, serverInfo: { name: "macs-restaurant-proof", version: "0.1.0" },
  } };
  if (method === "notifications/initialized") return null;
  if (method === "tools/list") return { jsonrpc: "2.0", id, result: { tools: [{
    name: "macs_restaurant_read_receipts",
    description: "Read verified POS payment totals for one pre-approved tenant. Cash included where the POS records cash. Never claim incremental lift or adjust campaigns.",
    inputSchema: { type: "object", properties: { days: { type: "integer", enum: [7, 14, 30] } }, required: ["days"], additionalProperties: false },
  }] } };
  if (method === "tools/call") {
    if (params.name !== "macs_restaurant_read_receipts") throw new Error("Unknown tool");
    return toolResponse(id, await report(params.arguments?.days));
  }
  return { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } };
}
process.stdin.setEncoding("utf8");
process.stdin.on("data", async chunk => {
  buffer += chunk;
  if (buffer.length > 65_536) { buffer = ""; send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Request too large" } }); return; }
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    let id = null;
    try {
      const message = JSON.parse(line); id = message.id ?? null;
      const response = await handle(message);
      if (response) send(response);
    } catch {
      send({ jsonrpc: "2.0", id, error: { code: -32000, message: "Tool execution unavailable; verify scope and connection" } });
    }
  }
});
