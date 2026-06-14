import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/automation-exercise/HomePage";
import { ProductsPage } from "../../pages/automation-exercise/ProductsPage";
import { ProductDetailPage } from "../../pages/automation-exercise/ProductDetailPage";

/**
 * Automation Exercise (https://automationexercise.com) — browsing.
 * Home page, navigation to the products list, and the product detail page.
 */
test.describe("Automation Exercise — browse", () => {
  let home: HomePage;
  let products: ProductsPage;
  let detail: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    products = new ProductsPage(page);
    detail = new ProductDetailPage(page);
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
});
