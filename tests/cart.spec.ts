import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { users, products } from "../test-data/users";

/**
 * Ticket 2 — Cart behavior.
 * All tests start logged in as the standard user on the inventory page.
 */
test.describe("SauceDemo — cart", () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    inventory = new InventoryPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await expect(
      page,
      "Precondition: must reach the inventory page after login"
    ).toHaveURL(/inventory/);
  });

  test('cart badge shows "1" after adding a product', async () => {
    await inventory.addToCart(products.backpack);

    await expect(
      inventory.cartBadge,
      "Cart badge should show 1 after adding a product"
    ).toHaveText("1");
  });

  test("cart badge disappears after removing the product", async () => {
    await inventory.addToCart(products.backpack);
    await expect(
      inventory.cartBadge,
      "Precondition: badge should show 1 right after add"
    ).toHaveText("1");

    await inventory.removeFromCart(products.backpack);

    await expect(
      inventory.cartBadge,
      "Cart badge should not be visible after removing the product"
    ).not.toBeVisible();
  });

  test("badge reflects multiple add and remove operations", async () => {
    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.bikeLight);
    await inventory.addToCart(products.boltShirt);

    await expect(
      inventory.cartBadge,
      "Cart badge should show 3 after adding three distinct products"
    ).toHaveText("3");

    await inventory.removeFromCart(products.backpack);

    await expect(
      inventory.cartBadge,
      "Cart badge should show 2 after removing one of three products"
    ).toHaveText("2");
  });

  test("fast add/remove cycles leave the cart empty", async () => {
    for (let i = 0; i < 3; i++) {
      await inventory.addToCart(products.backpack);
      await inventory.removeFromCart(products.backpack);
    }

    await expect(
      inventory.cartBadge,
      "Equal numbers of add and remove should leave the badge hidden"
    ).not.toBeVisible();
  });

  test("double-clicking Add to cart accidentally removes the item", async () => {
    // After the first click the Add-to-cart button is replaced in place by a
    // Remove button, so a fast double-click registers as add + remove and the
    // cart ends up empty with no feedback to the user.
    await inventory.addToCartButton(products.backpack).dblclick();

    await expect(
      inventory.cartBadge,
      "Bug: double-clicking Add to cart leaves the cart empty instead of adding"
    ).not.toBeVisible();
  });

  test("cart persists across a page refresh", async ({ page }) => {
    await inventory.addToCart(products.backpack);
    await expect(
      inventory.cartBadge,
      "Precondition: badge should show 1 after add"
    ).toHaveText("1");

    await page.reload();

    await expect(
      inventory.cartBadge,
      "Cart badge should still show 1 after reload (cart persistence)"
    ).toHaveText("1");
  });
});
