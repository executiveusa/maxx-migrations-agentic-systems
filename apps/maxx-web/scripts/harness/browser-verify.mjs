import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import process from "node:process";

const BASE_URL = process.env.HARNESS_BASE_URL ?? "http://127.0.0.1:3100";
const EXECUTABLE_PATH =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const ROUTES = [
  "/",
  "/how-it-works",
  "/pricing",
  "/migration-audit",
  "/features",
  "/features/community",
  "/features/courses",
  "/features/workflows",
  "/features/social-planner",
  "/features/ghl-import",
  "/features/missed-call-text-back",
  "/features/website-migration",
  "/privacy",
  "/terms",
  "/app",
  "/app/contacts",
  "/app/pipeline",
  "/app/forms",
  "/app/workflows",
  "/app/community",
  "/app/community/courses",
  "/app/social-planner",
  "/app/import/ghl",
  "/app/missed-calls",
  "/app/migrations",
  "/app/agents",
  "/app/settings",
];

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

async function run() {
  const browser = await chromium.launch({ executablePath: EXECUTABLE_PATH });
  const results = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });

    for (const route of ROUTES) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on("pageerror", (err) => consoleErrors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error" && !msg.text().includes("404"))
          consoleErrors.push(msg.text());
      });

      let status = 0;
      let horizontalOverflow = false;
      try {
        const response = await page.goto(`${BASE_URL}${route}`, {
          waitUntil: "networkidle",
          timeout: 15000,
        });
        status = response?.status() ?? 0;
        horizontalOverflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 1
        );
      } catch (error) {
        consoleErrors.push(
          `navigation failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      results.push({
        route,
        viewport: viewport.name,
        status,
        ok: status > 0 && status < 400,
        horizontalOverflow,
        consoleErrors,
      });

      await page.close();
    }

    await context.close();
  }

  await browser.close();

  const failures = results.filter(
    (r) => !r.ok || r.horizontalOverflow || r.consoleErrors.length > 0
  );

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    routesChecked: ROUTES.length,
    viewportsChecked: VIEWPORTS.map((v) => v.name),
    totalChecks: results.length,
    failureCount: failures.length,
    overallStatus: failures.length === 0 ? "pass" : "fail",
    failures,
  };

  mkdirSync("../../ops/reports/harness", { recursive: true });
  writeFileSync(
    "../../ops/reports/harness/browser-verification.json",
    JSON.stringify(report, null, 2) + "\n"
  );

  console.log(
    `Checked ${results.length} route/viewport combinations across ${ROUTES.length} routes.`
  );
  console.log(`Failures: ${failures.length}`);
  if (failures.length > 0) {
    for (const f of failures) {
      console.log(
        `  ✗ ${f.route} @ ${f.viewport} — status ${f.status}, overflow=${
          f.horizontalOverflow
        }, errors=${JSON.stringify(f.consoleErrors)}`
      );
    }
    process.exit(1);
  } else {
    console.log(
      "All routes passed at all viewports (no console errors, no 404s, no horizontal overflow)."
    );
  }
}

run();
