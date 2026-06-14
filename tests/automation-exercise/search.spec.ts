import { test, expect } from "@playwright/test";
import { ProductsPage } from "../../pages/automation-exercise/ProductsPage";
import { searchTerm } from "../../test-data/products";

/**
 * Automation Exercise — product search.
 * Positive (matching results) and negative (no results) search paths.
 */
test.describe("Automation Exercise — search", () => {
  let products: ProductsPage;

  test.beforeEach(async ({ page }) => {
    products = new ProductsPage(page);
    await products.open();
  });

  test("searching for a product returns matching results", async () => {
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
});
