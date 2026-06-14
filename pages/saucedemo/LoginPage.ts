import { type Locator, type Page } from "@playwright/test";

/**
 * Page Object for the SauceDemo login page (https://www.saucedemo.com/).
 * Owns the credential form and the error banner. Actions only — assertions
 * live in the specs.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly branding: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.branding = page.getByText("Swag Labs");
  }

  /** Open the login page (resolves against the configured baseURL). */
  async open() {
    await this.page.goto("/");
  }

  /** Fill both fields and submit. */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Submit the form as-is — used by the field-validation tests. */
  async submit() {
    await this.loginButton.click();
  }
}
