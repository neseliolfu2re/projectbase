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

test("how it works section expands", async ({ page }) => {
  await page.goto("/");
  await page.locator("summary").filter({ hasText: "How it works" }).click();
  await expect(
    page.getByText("Confirm the transaction in your wallet"),
  ).toBeVisible();
});
