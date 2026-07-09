import { test, expect } from "@playwright/test";

test("missed calls page shows opt-out list and compliance notice", async ({ page }) => {
  await page.goto("/app/missed-calls");
  await expect(page.getByText(/Twilio setup required/i)).toBeVisible();
  await page.getByRole("tab", { name: /Opt-outs/i }).click();
  await expect(page.getByText("+15035559999")).toBeVisible();
  await expect(page.getByText(/Replying STOP immediately and permanently opts a number out/i)).toBeVisible();
});

test("/api/health returns ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body.status).toBe("ok");
});

test("no internal link on the homepage 404s", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[href^='/']").evaluateAll((links) =>
    Array.from(new Set(links.map((l) => l.getAttribute("href")).filter((h): h is string => Boolean(h)))),
  );

  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), `${href} should not 404`).toBeLessThan(400);
  }
});
