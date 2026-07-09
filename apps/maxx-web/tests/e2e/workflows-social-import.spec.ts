import { test, expect } from "@playwright/test";

test("workflow template selection builds a step list", async ({ page }) => {
  await page.goto("/app/workflows/new");
  await page.getByRole("button", { name: "Use this template" }).first().click();
  await expect(page.getByRole("heading", { name: "Build your workflow" })).toBeVisible();
  await expect(page.getByText(/step type/i).first()).toBeVisible();
});

test("social post scheduling works in local mode", async ({ page }) => {
  await page.goto("/app/social-planner");
  await page.getByRole("button", { name: "New post" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Facebook Page").check();
  await dialog.getByLabel("Post copy").fill("Local mode test post for the social planner.");
  await dialog.getByRole("button", { name: "Save post" }).click();
  await expect(page.getByText("Local mode test post for the social planner.")).toBeVisible();
});

test("GHL CSV mapping works end to end with sample data", async ({ page }) => {
  await page.goto("/app/import/ghl");
  await page.getByRole("button", { name: "Continue" }).click(); // choose source (CSV default)
  await page.getByRole("button", { name: "Or load sample data" }).click();
  await expect(page.getByText(/Loaded \d+ rows/)).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click(); // upload step
  await page.getByRole("button", { name: "Continue" }).click(); // objects step
  await expect(page.getByRole("heading", { name: "Map fields" })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click(); // mapping step
  await page.getByRole("button", { name: "Run import" }).click();
  await expect(page.getByRole("heading", { name: "Import summary" })).toBeVisible();
});
