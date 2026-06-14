import { type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the SauceDemo checkout flow: the "Your Information" form
 * (/checkout-step-one.html), the overview (/checkout-step-two.html) and the
 * completion page (/checkout-complete.html).
 */
export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly successHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.successHeader = page.locator('[data-test="complete-header"]');
  }

  /** Fill the "Your Information" step and continue to the overview. */
  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Confirm the order on the overview step. */
  async finish() {
    await this.finishButton.click();
  }
}
