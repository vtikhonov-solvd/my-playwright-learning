import { type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the SauceDemo inventory page (/inventory.html) — the product
 * list shown after a successful login. Owns add/remove, the cart badge/link,
 * and the sort dropdown.
 */
export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
  }

  /** "Add to cart" button for a product id, e.g. "sauce-labs-backpack". */
  addToCartButton(item: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${item}"]`);
  }

  /** "Remove" button that replaces "Add to cart" once the item is in the cart. */
  removeButton(item: string): Locator {
    return this.page.locator(`[data-test="remove-${item}"]`);
  }

  /** Name of the product shown first in the current sort order. */
  get firstItemName(): Locator {
    return this.itemNames.first();
  }

  async addToCart(item: string) {
    await this.addToCartButton(item).click();
  }

  async removeFromCart(item: string) {
    await this.removeButton(item).click();
  }

  /** Choose a sort order by its <option> value (e.g. "lohi", "az"). */
  async sortBy(value: string) {
    await this.sortDropdown.selectOption(value);
  }

  async openCart() {
    await this.cartLink.click();
  }
}
