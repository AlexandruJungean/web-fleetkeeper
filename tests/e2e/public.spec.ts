import { expect, test } from "@playwright/test";

import { expectNoAxeViolations } from "./axe";

test("public homepage renders primary content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
});

test("@accessibility public homepage has no WCAG AA violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
  await expectNoAxeViolations(page);
});
