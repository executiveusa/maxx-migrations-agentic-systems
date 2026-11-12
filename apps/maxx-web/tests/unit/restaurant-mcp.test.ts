import { describe, expect, it } from "vitest";
import { spawn } from "node:child_process";
import path from "node:path";

function invoke(requests: unknown[]): Promise<Array<Record<string, unknown>>> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.resolve(process.cwd(), "mcp/macs-restaurant.mjs")], {
      env: {
        ...process.env,
        MACS_RESTAURANT_API_URL: "http://127.0.0.1:3000",
        MAXX_RESTAURANT_AGENT_KEY: "",
      },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let output = "";
    let errors = "";
    const killTimer = setTimeout(() => { child.kill(); reject(new Error("MCP tool timed out")); }, 5000);
    child.stdout.on("data", chunk => { output += chunk.toString(); });
    child.stderr.on("data", chunk => { errors += chunk.toString(); });
    child.on("error", error => { clearTimeout(killTimer); reject(error); });
    child.on("close", code => {
      clearTimeout(killTimer);
      if (code !== 0) { reject(new Error(`MCP exited ${code}: ${errors}`)); return; }
      try { resolve(output.trim().split("\n").filter(Boolean).map(line => JSON.parse(line))); }
      catch (error) { reject(error); }
    });
    child.stdin.end(requests.map(x => JSON.stringify(x)).join("\n") + "\n");
  });
}
describe("MCP Restaurant Proof tools", () => {
  it("advertises only a scoped read-only payment report and fails closed without a key", async () => {
    const responses = await invoke([
      { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18" } },
      { jsonrpc: "2.0", id: 2, method: "tools/list" },
      { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "macs_restaurant_read_receipts", arguments: { days: 7 } } },
    ]);
    expect(responses).toHaveLength(3);
    const tools = (responses[1]!.result as {tools:{name:string}[]}).tools;
    expect(tools.map(x => x.name)).toEqual(["macs_restaurant_read_receipts"]);
    expect((responses[2]!.error as { code: number }).code).toBe(-32000);
  });
});
