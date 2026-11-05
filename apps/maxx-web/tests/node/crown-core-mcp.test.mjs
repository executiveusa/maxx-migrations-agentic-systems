import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";

const executable = new URL("../../mcp/maxx-migrations-server.mjs", import.meta.url).pathname;

function mcp(messages, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [executable], { env: { ...process.env, ...env } });
    let output = "";
    let error = "";
    child.stdout.on("data", (x) => {
      output += x.toString();
      if (output.trim().split("\n").filter(Boolean).length >= messages.length) {
        child.kill();
        resolve(output.trim().split("\n").filter(Boolean).map((v) => JSON.parse(v)));
      }
    });
    child.stderr.on("data", (x) => { error += x.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (output.trim().split("\n").filter(Boolean).length < messages.length) {
        reject(new Error("Missing MCP response. " + error + " code=" + code));
      }
    });
    child.stdin.end(messages.map((m) => JSON.stringify(m)).join("\n") + "\n");
  });
}

test("Crown tools are not advertised without scoped JWT", async () => {
  const [result] = await mcp([{ jsonrpc:"2.0", id:1, method:"tools/list" }], {
    MAXX_CROWN_AGENT_ACCESS_TOKEN:""
  });
  assert.equal(result.result.tools.some((t) => t.name === "maxx_audit_prepare"), false);
});

test("Crown tools are advertised when scoped JWT is configured", async () => {
  const [result] = await mcp([{ jsonrpc:"2.0", id:1, method:"tools/list" }], {
    MAXX_CROWN_AGENT_ACCESS_TOKEN:"test-scoped-token"
  });
  const names = result.result.tools.map((t) => t.name);
  assert.deepEqual(["maxx_offer_list","maxx_audit_prepare","maxx_proposal_prepare","maxx_offer_status"].every((name) => names.includes(name)), true);
  assert.equal(names.includes("maxx_action_execute"), false);
});

test("agent tool forwards the scoped bearer without forwarding machine key", async () => {
  const requests = [];
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    requests.push({ path:req.url, headers:req.headers, body });
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ status:"draft", external_side_effects:0 }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const port = server.address().port;
    const [result] = await mcp([
      { jsonrpc:"2.0", id:2, method:"tools/call", params:{
        name:"maxx_audit_prepare", arguments:{
          request_id:"00000000-0000-4000-8000-000000000001",
          idempotency_key:"crown-e2e-test-key",
          business_name:"Crown & Core",
          sources:[], findings:[]
        }
      }}
    ], {
      MAXX_MIGRATIONS_URL:"http://127.0.0.1:" + port,
      MAXX_MIGRATIONS_API_KEY:"should-not-leak-to-offer",
      MAXX_CROWN_AGENT_ACCESS_TOKEN:"scoped-test-agent"
    });
    assert.equal(result.result.structuredContent.external_side_effects, 0);
    assert.equal(requests[0].path, "/api/offers/crown-core/audits");
    assert.equal(requests[0].headers.authorization, "Bearer scoped-test-agent");
    assert.equal(requests[0].headers["x-maxx-migrations-api-key"], undefined);
  } finally { server.close(); }
});
