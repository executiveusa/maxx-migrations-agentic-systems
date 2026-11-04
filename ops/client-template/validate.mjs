#!/usr/bin/env node
/**
 * Zero-dependency structural validation of a MAXX portable client workspace.
 * It checks graph routing and safety defaults, not a deployed runtime.
 */
import { lstat, readFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] || join(here, "../../icm/clients/_template"));
const required = [
  "README.md", "AGENTS.md", "CONTEXT.md", "GRAPH.md", "graph.json",
  "_config/client.example.json", "_shared/CONTRACTS.md", "_shared/SECOND_BRAIN.md",
  "_shared/OFFER_PLAYBOOKS.md", "_shared/REPO_DISCOVERY.md", "_shared/COST_POLICY.md",
  "working-state/STATUS.md",
  "01_intake/CONTEXT.md", "02_normalize/CONTEXT.md", "03_isolate/CONTEXT.md",
  "04_approve/CONTEXT.md", "05_prove/CONTEXT.md", "06_transform/CONTEXT.md"
];
function check(condition, message) { if (!condition) throw new Error(message); }
async function safeFile(relative) {
  check(typeof relative === "string" && relative.length > 0 && !relative.startsWith("/"), "Unsafe path: " + relative);
  const full = resolve(root, relative);
  check(full.startsWith(root + sep), "Path escapes workspace: " + relative);
  const stat = await lstat(full);
  check(stat.isFile() && !stat.isSymbolicLink(), "Not a regular file: " + relative);
}
try {
  for (const path of required) await safeFile(path);
  const graph = JSON.parse(await readFile(join(root, "graph.json"), "utf8"));
  check(graph.schema_version === 1 && Array.isArray(graph.nodes) && Array.isArray(graph.edges), "Invalid graph schema");
  const ids = new Set();
  for (const node of graph.nodes) {
    check(typeof node.id === "string" && node.id.length > 0 && !ids.has(node.id), "Duplicate/invalid graph node");
    ids.add(node.id);
    if (node.path !== undefined) await safeFile(node.path);
  }
  for (const edge of graph.edges) {
    check(ids.has(edge.from) && ids.has(edge.to) && typeof edge.relation === "string" && edge.relation.length > 0, "Broken graph edge");
  }
  let configPath = "_config/client.json";
  try { await safeFile(configPath); }
  catch (error) {
    if (error.code !== "ENOENT") throw error;
    configPath = "_config/client.example.json";
  }
  const cfg = JSON.parse(await readFile(join(root, configPath), "utf8"));
  check(cfg.schema_version === 1, "Invalid config version");
  check(typeof cfg.tenant_id === "string" && cfg.tenant_id.length > 0, "Missing tenant");
  check(cfg.policy.default_external_writes === "deny", "External writes must default deny");
  check(cfg.policy.requires_exact_action_approval === true, "Exact-action approval missing");
  check(cfg.policy.requires_tenant_isolation_test === true, "Tenant isolation test missing");
  check(cfg.costs.provider_markup_percent === 0, "Provider usage must be pass-through at cost");
  check(cfg.costs.hard_stop_on_budget === true && cfg.costs.monthly_model_budget_usd === 0, "Unsafe default budget");
  check(cfg.data.raw_exports_in_git === false, "Raw exports must stay outside Git");
  check(cfg.front_door.bridge_status === "disabled_pending_supported_api_and_consent", "Unverified Instinct bridge enabled");
  console.log(JSON.stringify({ status: "PASS_STRUCTURE_ONLY", root, nodes: ids.size, edges: graph.edges.length, config: configPath }, null, 2));
} catch (error) {
  console.error("MAXX template validation failed:", error.message);
  process.exitCode = 1;
}
