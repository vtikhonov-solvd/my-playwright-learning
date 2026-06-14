import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { users } from "../../test-data/users";

/**
 * Ticket 1 — Login regression.
 * Positive and negative authentication paths through the LoginPage object.
 */
test.describe("SauceDemo — login", () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.open();
  });

  test("login page renders the Swag Labs branding", async ({ page }) => {
    await expect(page, 'Tab title should contain "Swag Labs"').toHaveTitle(/Swag Labs/);
    await expect(
      login.branding,
      "Swag Labs branding should be visible on the login page"
    ).toBeVisible();
  });

  test("standard user logs in and lands on the inventory page", async ({ page }) => {
    await login.login(users.standard.username, users.standard.password);

    await expect(
      page,
      "Valid credentials should redirect to /inventory"
    ).toHaveURL(/inventory/);
  });

  test("locked-out user is refused with a locked error", async () => {
    await login.login(users.locked.username, users.locked.password);

    await expect(
      login.errorMessage,
      "Locked-out user should see the locked-out error message"
    ).toHaveText("Epic sadface: Sorry, this user has been locked out.");
  });

  test("wrong password shows an error", async () => {
    await login.login(users.standard.username, "wrong_password");

    await expect(
      login.errorMessage,
      "Wrong credentials should surface an error banner"
    ).toBeVisible();
  });

  test("submitting the empty form reports the username is required", async () => {
    await login.submit();

    await expect(
      login.errorMessage,
      'Empty form submit should report "Username is required"'
    ).toHaveText(/Username is required/);
  });

  test("username only reports the password is required", async () => {
    await login.usernameInput.fill(users.standard.username);
    await login.submit();

    await expect(
      login.errorMessage,
      'Submitting with only a username should report "Password is required"'
    ).toHaveText(/Password is required/);
  });

  test("password only reports the username is required", async () => {
    await login.passwordInput.fill(users.standard.password);
    await login.submit();

    await expect(
      login.errorMessage,
      'Submitting with only a password should report "Username is required"'
    ).toHaveText(/Username is required/);
  });
});
