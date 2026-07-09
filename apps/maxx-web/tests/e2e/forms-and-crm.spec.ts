import { test, expect } from "@playwright/test";

test("migration audit form validates required fields", async ({ page }) => {
  await page.goto("/migration-audit");
  await page.getByRole("button", { name: "Start a Migration Audit" }).click();
  await expect(page.getByText("Organization name is required.")).toBeVisible();
});

test("migration audit form submits successfully with valid data", async ({ page }) => {
  await page.goto("/migration-audit");
  await page.getByLabel("Organization name").fill("Riverside Mutual Aid Kitchen");
  await page.getByLabel("Website URL").fill("https://old-riversidemutualaid.example.org");
  await page.getByLabel("Contact name").fill("Dana Okafor");
  await page.getByLabel("Email").fill("dana@example.org");
  await page.getByLabel("Organization type").selectOption("nonprofit");
  await page.getByLabel("Mission focus").fill("Emergency food access");
  await page.getByLabel("Biggest problem right now").fill("Our current CRM cannot text donors back automatically.");
  await page.getByLabel("Budget range").selectOption("$5,000–$10,000");
  await page.getByLabel("Desired timeline").selectOption("1–3 months");
  await page.getByRole("button", { name: "Start a Migration Audit" }).click();
  await expect(page.getByText("your migration audit request is in")).toBeVisible();
});

test("contact creation validates and adds a new contact", async ({ page }) => {
  await page.goto("/app/contacts");
  await page.getByRole("button", { name: "Add contact" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Add contact" }).click();
  await expect(dialog.getByText("First name is required.")).toBeVisible();

  await dialog.getByLabel("First name").fill("Priya");
  await dialog.getByLabel("Last name").fill("Nair");
  await dialog.getByLabel("Email").fill("priya.test@example.org");
  await dialog.getByRole("button", { name: "Add contact" }).click();
  await expect(page.getByRole("cell", { name: "Priya Nair" })).toBeVisible();
});
