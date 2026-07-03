import { test, expect } from "@playwright/test";

const APP_ROUTES = [
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
  "/app/settings/integrations",
  "/app/settings/billing",
];

for (const route of APP_ROUTES) {
  test(`app route renders without error: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(route);
    expect(response?.status(), `${route} should not 404`).toBeLessThan(400);
    await expect(page.locator("body")).not.toBeEmpty();
    expect(errors, `no console page errors on ${route}`).toEqual([]);
  });
}

test("app shell shows local build mode banner and sidebar nav", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByText("Local build mode")).toBeVisible();
  await expect(page.getByRole("link", { name: "Contacts" })).toBeVisible();
});

test("sidebar navigation moves between app sections", async ({ page }) => {
  await page.goto("/app");
  const sidebar = page.getByRole("navigation", { name: "Application" });
  await sidebar.getByRole("link", { name: "Pipeline" }).click();
  await expect(page).toHaveURL(/\/app\/pipeline$/);
  await sidebar.getByRole("link", { name: "Workflows" }).click();
  await expect(page).toHaveURL(/\/app\/workflows$/);
});
