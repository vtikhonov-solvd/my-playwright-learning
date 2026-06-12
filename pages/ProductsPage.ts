import { type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the "All Products" / search-results page
 * (https://automationexercise.com/products).
 */
export class ProductsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly viewProductLinks: Locator;
  readonly searchedProductsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "All Products" });
    this.searchInput = page.getByRole("textbox", { name: "Search Product" });
    this.searchButton = page.locator("#submit_search");
    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.viewProductLinks = page.getByRole("link", { name: /view product/i });
    this.searchedProductsHeading = page.getByRole("heading", {
      name: "Searched Products",
    });
  }

  async open() {
    await this.page.goto("https://automationexercise.com/products", {
      waitUntil: "domcontentloaded",
    });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /** Opens the detail page for the product at the given zero-based position. */
  async viewProduct(index = 0) {
    await this.viewProductLinks.nth(index).click();
  }
}
