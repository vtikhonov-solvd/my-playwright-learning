import { type Locator, type Page } from "@playwright/test";

/**
 * Page Object for a single product detail page
 * (https://automationexercise.com/product_details/{id}).
 */
export class ProductDetailPage {
  readonly page: Page;
  readonly info: Locator;
  readonly name: Locator;
  readonly category: Locator;
  readonly availability: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartModal: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Everything we care about lives inside the .product-information block.
    this.info = page.locator(".product-information");
    this.name = this.info.getByRole("heading").first();
    this.category = this.info.getByText(/^Category:/);
    // Availability is "<p><b>Availability:</b> In Stock</p>" — match the whole
    // paragraph so the status text after the bold label is included.
    this.availability = this.info.locator("p").filter({ hasText: "Availability:" });
    this.quantityInput = page.locator("#quantity");
    this.addToCartButton = this.info.getByRole("button", { name: /add to cart/i });

    // A modal pops up after adding to cart, offering a link to the cart page.
    this.cartModal = page.locator("#cartModal");
    this.viewCartLink = this.cartModal.getByRole("link", { name: /view cart/i });
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
    // Wait for the confirmation modal so the add request has completed before
    // the caller navigates away. This is action synchronisation (waitFor),
    // not a hard wait and not a test assertion.
    await this.cartModal.waitFor({ state: "visible" });
  }

  /** Adds the product to the cart and follows the modal's "View Cart" link. */
  async addToCartAndView() {
    await this.addToCart();
    await this.viewCartLink.click();
  }
}
