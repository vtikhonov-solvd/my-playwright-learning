import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { InventoryPage } from "../../pages/saucedemo/InventoryPage";
import { users } from "../../test-data/users";

/**
 * Ticket 4 (bonus) — Sorting.
 * Verifies the inventory sort dropdown reorders the product list.
 */
test.describe("SauceDemo — sorting", () => {
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

  test('"Price (low to high)" changes which product is shown first', async () => {
    const defaultFirst = await inventory.firstItemName.textContent();

    await inventory.sortBy("lohi");

    await expect(
      inventory.firstItemName,
      `Sorting by price low-to-high should change the first product (was "${defaultFirst}")`
    ).not.toHaveText(defaultFirst ?? "");
  });

  test('"Name (Z to A)" puts a different product first than the default A→Z', async () => {
    const defaultFirst = await inventory.firstItemName.textContent();

    await inventory.sortBy("za");

    await expect(
      inventory.firstItemName,
      `Sorting Z→A should change the first product (was "${defaultFirst}")`
    ).not.toHaveText(defaultFirst ?? "");
  });
});
