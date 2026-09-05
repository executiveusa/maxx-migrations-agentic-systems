import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

const requiredFiles = [
  "app/api/system/health/route.ts",
  "app/api/system/manifest/route.ts",
  "app/api/system/route/route.ts",
  "lib/system/federation.ts",
  "lib/system/machine-auth.ts",
  "cli/maxx-migrations.mjs",
  "mcp/maxx-migrations-server.mjs",
  "../../docs/icm/FEDERATION_CONTRACT.md",
  "../../icm/federation/CONTEXT.md",
  "../../icm/federation/WALK_TEST.md",
];

let failed = false;
for (const path of requiredFiles) {
  if (!existsSync(path)) {
    console.error(`missing federation file: ${path}`);
    failed = true;
  }
}

const federation = readFileSync("lib/system/federation.ts", "utf8");
for (const bucket of ["reset", "momentum", "scale", "launch"]) {
  if (!federation.includes(`"${bucket}"`)) {
    console.error(`missing canonical bucket: ${bucket}`);
    failed = true;
  }
}

const auth = readFileSync("lib/system/machine-auth.ts", "utf8");
if (
  !auth.includes("timingSafeEqual") ||
  !auth.includes("x-maxx-migrations-api-key")
) {
  console.error(
    "machine federation auth must be timing-safe and use the dedicated header"
  );
  failed = true;
}

const manifest = readFileSync("app/api/system/manifest/route.ts", "utf8");
if (
  !manifest.includes("motionGate") ||
  !manifest.includes("requiredBeforeWalkPass")
) {
  console.error("manifest must expose the motion-before-walk gate");
  failed = true;
}

const mcp = readFileSync("mcp/maxx-migrations-server.mjs", "utf8");
for (const tool of [
  "maxx_migrations_health",
  "maxx_migrations_manifest",
  "maxx_migrations_route",
]) {
  if (!mcp.includes(tool)) {
    console.error(`missing MCP tool: ${tool}`);
    failed = true;
  }
}

if (failed) {
  console.error("federation-contract failed");
  process.exit(1);
}

console.log(
  "federation-contract passed: API, CLI, MCP, ICM and motion gate are structurally wired"
);
