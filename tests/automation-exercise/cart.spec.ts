import { test, expect } from "@playwright/test";
import { ProductsPage } from "../../pages/automation-exercise/ProductsPage";
import { ProductDetailPage } from "../../pages/automation-exercise/ProductDetailPage";
import { CartPage } from "../../pages/automation-exercise/CartPage";

/**
 * Automation Exercise — cart.
 * Adding one and two distinct products from their detail pages.
 */
test.describe("Automation Exercise — cart", () => {
  let products: ProductsPage;
  let detail: ProductDetailPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    products = new ProductsPage(page);
    detail = new ProductDetailPage(page);
    cart = new CartPage(page);
  });

  test("user can add a product to the cart and see it listed", async ({ page }) => {
    await products.open();
    await products.viewProduct(0);

    const productName = (await detail.name.textContent())?.trim() ?? "";

    await detail.addToCartAndView();

    await expect(page, "Should land on the cart page").toHaveURL(/view_cart/);
    await expect(
      cart.productNames.filter({ hasText: productName }),
      `Cart should list the product just added ("${productName}")`
    ).toBeVisible();
  });

  test("user can add two distinct products to the cart", async ({ page }) => {
    let firstName = "";

    await test.step("Add the first product", async () => {
      await products.open();
      await products.viewProduct(0);
      firstName = (await detail.name.textContent())?.trim() ?? "";
      await detail.addToCart();
    });

    await test.step("Add a second, different product", async () => {
      // Re-opening the products page navigates away and dismisses the modal.
      await products.open();
      await products.viewProduct(1);
      await detail.addToCartAndView();
    });

    await test.step("Verify both products are in the cart", async () => {
      await expect(page, "Should land on the cart page").toHaveURL(/view_cart/);
      await expect(
        cart.productNames.filter({ hasText: firstName }),
        "Cart should still list the first product"
      ).toBeVisible();
      expect(
        await cart.itemCount(),
        "Cart should hold two distinct product lines"
      ).toBe(2);
    });
  });
});
