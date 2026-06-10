import { test, expect } from '@playwright/test';

const VALID_USERNAME = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test.describe('SauceDemo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('has browser tab title', async ({ page }) => {
    await expect(page, 'Tab title should contain "Swag Labs"').toHaveTitle(/Swag Labs/);
  });

  test('has Swag Labs title', async ({ page }) => {
    await expect(
      page.getByText('Swag Labs'),
      'Swag Labs branding should be visible on the login page'
    ).toBeVisible();
  });

  test('logs in with valid credentials and lands on inventory', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(VALID_USERNAME);
    await page.locator('[data-test="password"]').fill(VALID_PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page, 'Valid credentials should redirect to /inventory').toHaveURL(/inventory/);
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
//Password validation message test
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

    test('double-click on Add to cart accidentally removes the item', async ({ page }) => {
      // After the first click the Add-to-cart button is replaced in place by a
      // Remove button. A fast double-click therefore registers as add + remove,
      // and the cart ends up empty with no feedback to the user.
      await page.locator(BACKPACK_ADD_BTN).dblclick();

      await expect(
        page.locator(CART_BADGE),
        'Bug: double-clicking Add to cart leaves the cart empty instead of adding the item'
      ).not.toBeVisible();
    });

    test('cart badge reflects multiple add and remove operations', async ({ page }) => {
      await page.locator(BACKPACK_ADD_BTN).click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

      await expect(
        page.locator(CART_BADGE),
        'Cart badge should show 3 after adding three distinct products'
      ).toHaveText('3');

      await page.locator(BACKPACK_REMOVE_BTN).click();

      await expect(
        page.locator(CART_BADGE),
        'Cart badge should show 2 after removing one of three products'
      ).toHaveText('2');
    });

    test('changing the sort order updates the first product shown', async ({ page }) => {
      const firstProductName = page.locator('[data-test="inventory-item-name"]').first();
      const defaultFirst = await firstProductName.textContent();

      await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

      await expect(
        firstProductName,
        `Switching to "Price (low to high)" should change the first product (was "${defaultFirst}")`
      ).not.toHaveText(defaultFirst ?? '');
    });

    test('cart persists across page refresh', async ({ page }) => {
      await page.locator(BACKPACK_ADD_BTN).click();
      await expect(
        page.locator(CART_BADGE),
        'Precondition: badge should show 1 after add'
      ).toHaveText('1');

      await page.reload();

      await expect(
        page.locator(CART_BADGE),
        'Cart badge should still show 1 after page reload (cart persistence)'
      ).toHaveText('1');
    });

    test('user can complete checkout and see success message', async ({ page }) => {
      await page.locator(BACKPACK_ADD_BTN).click();
      await expect(
        page.locator(CART_BADGE),
        'Precondition: badge should show 1 after add'
      ).toHaveText('1');

      await page.locator('[data-test="shopping-cart-link"]').click();

      await expect(
        page,
        'Should navigate to cart page'
      ).toHaveURL(/cart/);

      await page.locator('[data-test="checkout"]').click();

      await expect(
        page,
        'Should navigate to checkout page'
      ).toHaveURL(/checkout-step-one/);

      await page.locator('[data-test="firstName"]').fill('John');
      await page.locator('[data-test="lastName"]').fill('Doe');
      await page.locator('[data-test="postalCode"]').fill('12345');

      await page.locator('[data-test="continue"]').click();

      await expect(
        page,
        'Should navigate to checkout step two'
      ).toHaveURL(/checkout-step-two/);

      await page.locator('[data-test="finish"]').click();

      await expect(
        page.locator('[data-test="complete-header"]'),
        'Should display success message'
      ).toHaveText('Thank you for your order!');
    });
  });
});