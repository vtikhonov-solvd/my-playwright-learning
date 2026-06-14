import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { InventoryPage } from "../../pages/saucedemo/InventoryPage";
import { CartPage } from "../../pages/saucedemo/CartPage";
import { CheckoutPage } from "../../pages/saucedemo/CheckoutPage";
import { users, products, checkoutInfo } from "../../test-data/users";

/**
 * Ticket 3 — Checkout flow.
 * Drives the full purchase journey end to end through the page objects.
 */
test.describe("SauceDemo — checkout", () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await expect(
      page,
      "Precondition: must reach the inventory page after login"
    ).toHaveURL(/inventory/);
  });

  test("user can complete checkout and see the success message", async ({ page }) => {
    await test.step("Add a product and open the cart", async () => {
      await inventory.addToCart(products.backpack);
      await expect(
        inventory.cartBadge,
        "Precondition: badge should show 1 after add"
      ).toHaveText("1");
      await inventory.openCart();
      await expect(page, "Should navigate to the cart page").toHaveURL(/cart/);
    });

    await test.step("Enter shipping information", async () => {
      await cart.checkout();
      await expect(
        page,
        "Should navigate to checkout step one"
      ).toHaveURL(/checkout-step-one/);

      await checkout.fillInformation(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode
      );
      await expect(
        page,
        "Should navigate to checkout step two after continuing"
      ).toHaveURL(/checkout-step-two/);
    });

    await test.step("Finish the order", async () => {
      await checkout.finish();
      await expect(
        checkout.successHeader,
        "Completing checkout should display the order confirmation"
      ).toHaveText("Thank you for your order!");
    });
  });
});
