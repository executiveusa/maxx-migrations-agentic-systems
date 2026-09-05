import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { SOURCE_DIRS, walkFiles, readText, relative } from "./_shared.mjs";

console.log("Checking internal links resolve to real routes");

// Build the set of known routes from the app/ directory by finding every
// page.tsx and converting its folder path into a URL, turning [param]
// segments into wildcard matchers.
function collectRoutes(dir, base = "") {
  const routes = [];
  if (!existsSync(dir)) return routes;

  for (const entry of readdirSync(dir)) {
    if (entry === "api" || entry.startsWith("_")) continue;
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    const segment = entry.startsWith("[") && entry.endsWith("]") ? "*" : entry;
    const routePath = `${base}/${segment}`;
    if (existsSync(join(full, "page.tsx"))) {
      routes.push(routePath === "" ? "/" : routePath);
    }
    routes.push(...collectRoutes(full, routePath));
  }

  return routes;
}

const rawRoutes = ["/", ...collectRoutes("app")];
const knownRoutes = new Set(rawRoutes.map((r) => r.replace(/\/{2,}/g, "/")));

function routeMatches(path) {
  if (knownRoutes.has(path)) return true;
  const segments = path.split("/").filter(Boolean);
  for (const known of knownRoutes) {
    const knownSegments = known.split("/").filter(Boolean);
    if (knownSegments.length !== segments.length) continue;
    const matches = knownSegments.every(
      (seg, i) => seg === "*" || seg === segments[i]
    );
    if (matches) return true;
  }
  return false;
}

const EXTERNAL_OR_SPECIAL = /^(https?:|mailto:|tel:|#)/;
const hrefLiteral =
  /href\s*[:=]\s*(?:"([^"]+)"|'([^']+)'|\{`([^`]*)`\}|\{"([^"]+)"\})/g;

let brokenLinks = 0;
let deadAnchors = 0;
let checkedLinks = 0;

for (const dir of SOURCE_DIRS) {
  for (const file of walkFiles(dir)) {
    const text = readText(file);
    let match;
    hrefLiteral.lastIndex = 0;
    while ((match = hrefLiteral.exec(text))) {
      const raw = match[1] ?? match[2] ?? match[3] ?? match[4] ?? "";

      if (raw === "#" || raw === "") {
        console.log(
          `  ✗ ${relative(file)} — dead anchor href (${JSON.stringify(raw)})`
        );
        deadAnchors += 1;
        continue;
      }
      if (EXTERNAL_OR_SPECIAL.test(raw)) continue;
      if (raw.includes("${")) {
        // Template literal with an interpolated segment — check the static
        // prefix resolves to a real dynamic route pattern.
        const prefix = raw.split("${")[0];
        const withWildcard = `${prefix}*`.replace(/\/{2,}/g, "/");
        checkedLinks += 1;
        if (!routeMatches(withWildcard.split("?")[0])) {
          console.log(
            `  ✗ ${relative(
              file
            )} — no route matches dynamic link prefix "${prefix}"`
          );
          brokenLinks += 1;
        }
        continue;
      }

      const pathOnly = raw.split("?")[0].split("#")[0];
      if (!pathOnly.startsWith("/")) continue;
      checkedLinks += 1;
      if (!routeMatches(pathOnly)) {
        console.log(
          `  ✗ ${relative(file)} — "${raw}" does not resolve to a known route`
        );
        brokenLinks += 1;
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
} else {
  console.log(
    "link-check passed: no broken internal links or dead anchors found."
  );
}
