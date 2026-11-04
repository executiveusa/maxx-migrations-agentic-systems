#!/usr/bin/env node
/**
 * Non-network, non-secret MAXX client ICM scaffolder.
 * Creates a new private-workspace candidate; does not deploy a server.
 */
import { cp, lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve, sep, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../icm/clients/_template");

function usage() {
  console.log('Usage: node ops/client-template/scaffold.mjs --slug example-founder --name "Example Founder" --out ./tmp/example-founder [--dry-run]');
}
function fail(message) { throw new Error(message); }

const args = process.argv.slice(2);
if (args.includes("--help")) { usage(); process.exit(0); }
const opts = {};
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--dry-run") { opts.dryRun = true; continue; }
  if (!["--slug", "--name", "--out"].includes(arg) || !args[i + 1] || args[i + 1].startsWith("--")) {
    usage(); fail("Invalid argument: " + arg);
  }
  if (opts[arg] !== undefined) fail("Duplicate argument: " + arg);
  opts[arg] = args[++i];
}
const slug = opts["--slug"];
const name = opts["--name"];
const out = opts["--out"];
if (!slug || !/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(slug) || slug.includes("--")) {
  fail("Slug must be 3-63 lowercase letters, numbers or single hyphens");
}
if (!name || name.length > 120 || /[\r\n\u0000-\u001f]/.test(name)) fail("Name must be a short, single-line label");
if (!out) fail("--out is required");
const destination = resolve(out);
if (destination === source || destination.startsWith(source + sep)) fail("Destination cannot be inside template source");
if (destination === resolve(here, "../..")) fail("Destination cannot be the repository root");
try { await lstat(destination); fail("Destination already exists; refusing to overwrite"); }
catch (error) { if (error.code !== "ENOENT") throw error; }

async function rejectSymlinks(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isSymbolicLink()) fail("Template symlink refused: " + path);
    if (entry.isDirectory()) await rejectSymlinks(path);
  }
}
await rejectSymlinks(source);
const example = JSON.parse(await readFile(join(source, "_config/client.example.json"), "utf8"));
if (example.policy.default_external_writes !== "deny" || example.costs.provider_markup_percent !== 0) {
  fail("Unsafe template policy");
}
if (opts.dryRun) {
  console.log(JSON.stringify({ status: "dry_run", slug, destination, network_calls: 0 }, null, 2));
  process.exit(0);
}
await mkdir(dirname(destination), { recursive: true });
await cp(source, destination, { recursive: true, force: false, errorOnExist: true });
example.tenant_id = slug;
example.display_name = name;
await writeFile(join(destination, "_config/client.json"), JSON.stringify(example, null, 2) + "\n", { flag: "wx", mode: 0o600 });
console.log(JSON.stringify({ status: "scaffolded_not_deployed", slug, destination, next: "Validate, review, then place in a private client-controlled repository" }, null, 2));
