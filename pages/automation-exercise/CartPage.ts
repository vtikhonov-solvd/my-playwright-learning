import { type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the shopping cart page
 * (https://automationexercise.com/view_cart).
 */
export class CartPage {
  readonly page: Page;
  readonly cartTable: Locator;
  readonly rows: Locator;
  readonly productNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTable = page.locator("#cart_info_table");
    this.rows = this.cartTable.locator("tbody tr");
    this.productNames = this.cartTable.locator(".cart_description h4 a");
  }

  async open() {
    await this.page.goto("https://automationexercise.com/view_cart", {
      waitUntil: "domcontentloaded",
    });
  }

  /** Number of distinct product lines currently in the cart. */
  async itemCount(): Promise<number> {
    return this.rows.count();
  }
}
