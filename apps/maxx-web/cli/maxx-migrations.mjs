#!/usr/bin/env node

const API = (
  process.env.MAXX_MIGRATIONS_URL || "http://127.0.0.1:3000"
).replace(/\/$/, "");
const API_KEY = process.env.MAXX_MIGRATIONS_API_KEY;

function usage() {
  console.log(
    `MAXX Migrations CLI\n\nUsage:\n  maxx-migrations health\n  maxx-migrations manifest\n  maxx-migrations route <business condition>\n\nEnvironment:\n  MAXX_MIGRATIONS_URL       MAXX Migrations web/API base URL\n  MAXX_MIGRATIONS_API_KEY   machine credential\n`
  );
}

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

const [command, ...args] = process.argv.slice(2);

try {
  if (!command || command === "help" || command === "--help") {
    usage();
  } else if (command === "health") {
    console.log(JSON.stringify(await call("/api/system/health"), null, 2));
  } else if (command === "manifest") {
    console.log(JSON.stringify(await call("/api/system/manifest"), null, 2));
  } else if (command === "route") {
    const condition = args.join(" ").trim();
    if (!condition) throw new Error("A business condition is required");
    console.log(
      JSON.stringify(
        await call("/api/system/route", {
          method: "POST",
          body: JSON.stringify({ condition }),
        }),
        null,
        2
      )
    );
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(
    `MAXX Migrations: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exitCode = 1;
}
