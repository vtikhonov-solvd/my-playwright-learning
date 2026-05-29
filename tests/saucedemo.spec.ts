import { test, expect } from '@playwright/test';

const VALID_USERNAME = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test.describe('SauceDemo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('has browser tab title', async ({ page }) => {
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('has Swag Labs title', async ({ page }) => {
    await expect(page.getByText('Swag Labs')).toBeVisible();
  });

  test('logs in with valid credentials and lands on inventory', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(VALID_USERNAME);
    await page.locator('[data-test="password"]').fill(VALID_PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory/);
  });

  test('shows an error when the password is wrong', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(VALID_USERNAME);
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();

    await expect(
      page.locator('[data-test="error"]'),
      'Error should appear for wrong credentials'
    ).toBeVisible();
  });

  test('shows a validation error when submitting the empty form', async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();

    await expect(
      page.locator('[data-test="error"]'),
      'Empty form submit should report "Username is required"'
    ).toHaveText(/Username is required/);
  });

  test('shows a password-required error when only username is provided', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(VALID_USERNAME);
    await page.locator('[data-test="login-button"]').click();

    await expect(
      page.locator('[data-test="error"]'),
      'Submitting with only username should report "Password is required"'
    ).toHaveText(/Password is required/);
  });

  test('shows a username-required error when only password is provided', async ({ page }) => {
    await page.locator('[data-test="password"]').fill(VALID_PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(
      page.locator('[data-test="error"]'),
      'Submitting with only password should report "Username is required"'
    ).toHaveText(/Username is required/);
  });

  test.describe('after successful login', () => {
    const BACKPACK_ADD_BTN = '[data-test="add-to-cart-sauce-labs-backpack"]';
    const BACKPACK_REMOVE_BTN = '[data-test="remove-sauce-labs-backpack"]';
    const CART_BADGE = '.shopping_cart_badge';

    test.beforeEach(async ({ page }) => {
      await page.locator('[data-test="username"]').fill(VALID_USERNAME);
      await page.locator('[data-test="password"]').fill(VALID_PASSWORD);
      await page.locator('[data-test="login-button"]').click();
      await expect(
        page,
        'Precondition: must reach the inventory page after login'
      ).toHaveURL(/inventory/);
    });

    test('cart badge shows "1" after adding a product', async ({ page }) => {
      await page.locator(BACKPACK_ADD_BTN).click();

      await expect(
        page.locator(CART_BADGE),
        'Cart badge should show 1 after adding a product'
      ).toHaveText('1');
    });

    test('cart badge disappears after removing the product', async ({ page }) => {
      await page.locator(BACKPACK_ADD_BTN).click();
      await expect(
        page.locator(CART_BADGE),
        'Precondition: badge should show 1 right after add'
      ).toHaveText('1');

      await page.locator(BACKPACK_REMOVE_BTN).click();

      await expect(
        page.locator(CART_BADGE),
        'Cart badge should not be visible after removing the product'
      ).not.toBeVisible();
    });

    test('fast add/remove cycles leave the cart empty', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.locator(BACKPACK_ADD_BTN).click();
        await page.locator(BACKPACK_REMOVE_BTN).click();
      }

      await expect(
        page.locator(CART_BADGE),
        'After equal numbers of add and remove the cart badge should not be visible'
      ).not.toBeVisible();
    });
  });
});