import { expect, test } from "@playwright/test";

test("home page loads with main heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Fortune Cookie" }),
  ).toBeVisible();
});

test("wallet section is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Wallet" })).toBeVisible();
});
