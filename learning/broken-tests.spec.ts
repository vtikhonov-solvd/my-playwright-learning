import { test, expect } from "@playwright/test";

test("login should redirect to inventory", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");   // ← correct placeholder text
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/inventory/);
});
// Root cause: placeholder text was "User Name" but the actual placeholder is "Username"
// Fix:        Changed getByPlaceholder("User Name") to getByPlaceholder("Username")
// How I verified: npx playwright test tests/broken-tests.spec.ts --project=chromium

test("error message on wrong password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("wrong_password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Epic sadface: Username and password do not match any user in this service" // ← correct error message
  );
});
// Root cause:     The assertion expected "Username and password do not match", but
//               toHaveText(), but SauceDemo's actual
//               error for wrong password is the longer string:
//               "Epic sadface: Username and password do not match any user in this service".
//               The expected text was both missing the "Epic sadface:" prefix and
//               truncated, so the match failed.
// Fix:            Updated the expected text to the exact, complete error string:
//                 "Epic sadface: Username and password do not match any user in this service".
// How I verified: npx playwright test tests/broken-tests.spec.ts --project=chromium

test("cart badge appears after adding product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();   // ← fixed missing await on click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});
// Root cause: missing await before page.locator ... 
// Fix:        added await before page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click() in the third test.]
// How I verified: npx playwright test tests/broken-tests.spec.ts --project=chromium and verify that product is added and the card badge shows "1
