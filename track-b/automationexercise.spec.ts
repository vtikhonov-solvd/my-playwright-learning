import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { searchTerm, subscriberEmail } from "./products";

/**
 * Track B — Automation Exercise (https://automationexercise.com).
 *
 * The suite drives a real e-commerce demo site through the Page Object Model.
 * Every locator and low-level action lives in pages/; the tests below read as
 * user behaviour and own all of the assertions. Locators are role/accessibility
 * based or stable ids, and there are no hard waits — assertions rely on
 * Playwright's auto-waiting.
 */
test.describe("Automation Exercise", () => {
  let home: HomePage;
  let products: ProductsPage;
  let detail: ProductDetailPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    products = new ProductsPage(page);
    detail = new ProductDetailPage(page);
    cart = new CartPage(page);
  });

  test("home page loads and shows featured products", async ({ page }) => {
    await home.open();

    await expect(page, "Browser tab should show the site title").toHaveTitle(
      /Automation Exercise/i
    );
    await expect(
      home.featuredProducts.first(),
      "Home page should render the featured-products grid"
    ).toBeVisible();
    expect(
      await home.featuredProducts.count(),
      "Home page should list multiple featured products"
    ).toBeGreaterThan(1);
  });

  test("user can navigate to the products page from the navbar", async ({ page }) => {
    await home.open();
    await home.goToProducts();

    await expect(page, "Should be on the products page").toHaveURL(/products/);
    await expect(
      products.heading,
      'Products page should show the "All Products" heading'
    ).toBeVisible();
  });

  test("searching for a product returns matching results", async () => {
    await products.open();
    await products.search(searchTerm);

    await expect(
      products.searchedProductsHeading,
      'Search should switch the heading to "Searched Products"'
    ).toBeVisible();

    const matches = products.productCards.filter({
      hasText: new RegExp(searchTerm, "i"),
    });
    await expect(
      matches.first(),
      `Search results should contain at least one "${searchTerm}" product`
    ).toBeVisible();
  });

  test("searching for a nonsense term returns no products", async () => {
    await products.open();
    await products.search("zzqnonexistentproductxyz");

    await expect(
      products.searchedProductsHeading,
      'Search should still switch the heading to "Searched Products"'
    ).toBeVisible();
    expect(
      await products.productCards.count(),
      "A term that matches nothing should return zero products"
    ).toBe(0);
  });

  test("product detail page shows name, category and availability", async ({ page }) => {
    await products.open();
    await products.viewProduct(0);

    await expect(page, "Should be on a product detail page").toHaveURL(
      /product_details/
    );
    await expect(detail.name, "Product name should be shown").toBeVisible();
    await expect(
      detail.category,
      "Product category should be shown"
    ).toContainText("Category:");
    await expect(
      detail.availability,
      "Availability should report the product is in stock"
    ).toContainText(/In Stock/i);
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

  test("visitor can subscribe to the newsletter from the footer", async () => {
    await home.open();
    await home.subscribe(subscriberEmail);

    await expect(
      home.subscriptionSuccess,
      "A success message should confirm the subscription"
    ).toBeVisible();
  });
});
