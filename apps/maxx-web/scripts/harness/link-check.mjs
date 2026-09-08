import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { SOURCE_DIRS, walkFiles, readText, relative } from "./_shared.mjs";

console.log("Checking internal links resolve to real routes");

function collectRoutes(dir, base = "") {
  const routes = [];
  if (!existsSync(dir)) return routes;
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith("_") || entry.startsWith("(")) continue;
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    const segment = entry.startsWith("[") && entry.endsWith("]") ? "*" : entry;
    const routePath = `${base}/${segment}`;
    if (
      existsSync(join(full, "page.tsx")) ||
      existsSync(join(full, "route.ts"))
    )
      routes.push(routePath);
    routes.push(...collectRoutes(full, routePath));
  }
  return routes;
}

const knownRoutes = new Set(
  ["/", ...collectRoutes("app")].map((r) => r.replace(/\/{2,}/g, "/"))
);
function routeMatches(path) {
  if (knownRoutes.has(path)) return true;
  const segments = path.split("/").filter(Boolean);
  for (const known of knownRoutes) {
    const parts = known.split("/").filter(Boolean);
    if (
      parts.length === segments.length &&
      parts.every((seg, i) => seg === "*" || seg === segments[i])
    )
      return true;
  }
  return false;
}
function resolvesLink(raw) {
  if (raw === "#" || raw === "") return false;
  if (/^(https?:|mailto:|tel:|#)/.test(raw)) return true;
  const path = raw.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) return true;
  // Only interpolation of a whole path segment may stand for a dynamic route.
  // A partial segment cannot silently match a wildcard.
  const parts = path
    .split("/")
    .map((part) => (/^\$\{[^{}]+\}$/.test(part) ? "*" : part));
  if (parts.some((part) => part.includes("${"))) return false;
  return routeMatches(parts.join("/"));
}

const hrefLiteral =
  /href\s*[:=]\s*(?:"([^"]+)"|'([^']+)'|\{`([^`]*)`\}|\{"([^"]+)"\})/g;
const fetchLiteral = /\bfetch\s*\(\s*(?:"([^"]+)"|'([^']+)'|`([^`]*)`)/g;
let brokenLinks = 0;
let deadAnchors = 0;
let checkedLinks = 0;
for (const dir of SOURCE_DIRS) {
  for (const file of walkFiles(dir)) {
    const text = readText(file);
    for (const pattern of [hrefLiteral, fetchLiteral]) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text))) {
        const raw = match[1] ?? match[2] ?? match[3] ?? match[4] ?? "";
        if (raw === "#" || raw === "") {
          console.log(
            `  ✗ ${relative(file)} — dead anchor href (${JSON.stringify(raw)})`
          );
          deadAnchors += 1;
          continue;
        }
        if (!raw.startsWith("/")) continue;
        checkedLinks += 1;
        if (!resolvesLink(raw)) {
          console.log(
            `  ✗ ${relative(file)} — "${raw}" does not resolve to a known route`
          );
          brokenLinks += 1;
        }
      }
    }
  }
}
console.log(
  `\nChecked ${checkedLinks} internal link(s) against ${knownRoutes.size} known route(s).`
);
if (brokenLinks > 0 || deadAnchors > 0) {
  console.error(
    `link-check failed: ${brokenLinks} broken link(s), ${deadAnchors} dead anchor(s).`
  );
  process.exit(1);
}
console.log(
  "link-check passed: no broken internal links or dead anchors found."
);
