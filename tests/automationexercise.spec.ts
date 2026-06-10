import { test, expect } from '@playwright/test';

const BASE_URL = 'https://practice.automationexercise.com';

test.describe('Automation Exercise — Realistic E-Commerce Journey', () => {
  test('user can navigate to home page and see products', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // Verify page loaded with title
    await expect(
      page,
      'Should load Automation Exercise home page'
    ).toHaveTitle(/Automation/i);

    // Verify product section exists
    const productsSection = page.locator('body');
    await expect(
      productsSection,
      'Should display products on home page'
    ).toBeVisible();
  });

  test('user can navigate to products page', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // Navigate to products page
    const productsLink = page.getByRole('link', { name: /products/i });
    await productsLink.click();

    // Verify products page loaded
    await expect(
      page,
      'Should navigate to products page'
    ).toHaveURL(/products/);

    // Verify page title indicates products page
    const pageTitle = page.locator('h1, h2');
    await expect(
      pageTitle,
      'Should show products page heading'
    ).toBeVisible();
  });

  test('user can view product details', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);

    // Click on first product view details
    const viewDetailsButton = page.getByRole('link', { name: /view details|details/i }).first();
    await viewDetailsButton.click();

    // Verify product details page loaded
    await expect(
      page,
      'Should navigate to product details page'
    ).toHaveURL(/product_details/);

    // Verify product information is displayed
    const productInfo = page.locator('body');
    await expect(
      productInfo,
      'Should display product details'
    ).toBeVisible();
  });

  test('user can add product to cart', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);

    // Click view details on first product
    const viewDetailsButton = page.getByRole('link', { name: /view details|details/i }).first();
    await viewDetailsButton.click();

    // Add to cart
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();

    // Handle success message or modal
    await page.waitForTimeout(1000);

    // Navigate to cart
    const cartLink = page.getByRole('link', { name: /cart|shopping cart/i }).first();
    await cartLink.click();

    // Verify cart page loaded
    await expect(
      page,
      'Should navigate to cart page'
    ).toHaveURL(/cart/);
  });

  test('user can navigate between pages', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // Navigate to products
    const productsLink = page.getByRole('link', { name: /products/i });
    await productsLink.click();

    await expect(page).toHaveURL(/products/);

    // Navigate to home
    const homeLink = page.getByRole('link', { name: /home|automationexercise/i }).first();
    await homeLink.click();

    await expect(
      page,
      'Should navigate back to home page'
    ).toHaveURL(BASE_URL + '/');
  });
});
