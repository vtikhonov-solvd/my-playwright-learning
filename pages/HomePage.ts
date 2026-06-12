import { type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the Automation Exercise home page (https://automationexercise.com/).
 * Owns the top navigation bar and the featured-products section.
 */
export class HomePage {
  readonly page: Page;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly featuredProducts: Locator;
  readonly subscriptionEmail: Locator;
  readonly subscribeButton: Locator;
  readonly subscriptionSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    // Navigation lives in the navbar; scope role-based locators to it so we
    // don't accidentally match footer or category links with the same name.
    const navbar = page.locator(".navbar-nav");
    this.productsLink = navbar.getByRole("link", { name: /products/i });
    this.cartLink = navbar.getByRole("link", { name: /cart/i });
    this.signupLoginLink = navbar.getByRole("link", { name: /signup \/ login/i });

    this.featuredProducts = page.locator(".features_items .product-image-wrapper");

    // The footer newsletter form. Note the site ships a typo'd id (#susbscribe_email).
    this.subscriptionEmail = page.locator("#susbscribe_email");
    this.subscribeButton = page.locator("#subscribe");
    this.subscriptionSuccess = page.locator("#success-subscribe");
  }

  async open() {
    await this.page.goto("https://automationexercise.com/", {
      waitUntil: "domcontentloaded",
    });
  }

  async goToProducts() {
    await this.productsLink.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async subscribe(email: string) {
    await this.subscriptionEmail.fill(email);
    await this.subscribeButton.click();
  }
}
