import { test, expect } from "@playwright/test";

const PUBLIC_ROUTES = [
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
];

for (const route of PUBLIC_ROUTES) {
  test(`public route renders without error: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(route);
    expect(response?.status(), `${route} should not 404`).toBeLessThan(400);
    await expect(page.locator("body")).not.toBeEmpty();
    expect(errors, `no console page errors on ${route}`).toEqual([]);
  });
}

test("homepage links to every recent-update feature and app route", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /recent updates shipped to your crm/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open in app →" }).first()).toBeVisible();
});

test("navigation links from the main nav resolve", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Primary" });
  await mainNav.getByRole("link", { name: "Features" }).click();
  await expect(page).toHaveURL(/\/features$/);
  await mainNav.getByRole("link", { name: "Pricing" }).click();
  await expect(page).toHaveURL(/\/pricing$/);
});
