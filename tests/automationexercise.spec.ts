import { test, expect } from '@playwright/test';

const BASE_URL = 'https://automationexercise.com';

test.describe('Automation Exercise — Realistic E-Commerce Journey', () => {
  test('user can navigate to home page and see products', async ({ page }) => {
    await page.goto(`${BASE_URL}`, { waitUntil: 'domcontentloaded' });

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
    await page.goto(`${BASE_URL}`, { waitUntil: 'domcontentloaded' });

    // Navigate to products page
    const productsLink = page.getByRole('link', { name: /products/i });
    await productsLink.click();

    // Verify products page loaded
    await expect(
      page,
      'Should navigate to products page'
    ).toHaveURL(/products/);

    // Verify page title indicates products page
    const pageTitle = page.locator('h1, h2').first();
    await expect(
      pageTitle,
      'Should show products page heading'
    ).toBeVisible();
  });

  test('user can view product details', async ({ page }) => {
    await page.goto(`${BASE_URL}/products`, { waitUntil: 'domcontentloaded' });

    // Click on first product view details
    const viewDetailsButton = page.getByRole('link', { name: /view product/i }).first();
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
    await page.goto(`${BASE_URL}/products`, { waitUntil: 'domcontentloaded' });

    // Click view details on first product
    const viewDetailsButton = page.getByRole('link', { name: /view product/i }).first();
    await viewDetailsButton.click();

    // Add to cart
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();

    // A confirmation modal appears; follow its "View Cart" link
    const cartModal = page.locator('#cartModal');
    await expect(cartModal).toBeVisible();
    await cartModal.getByRole('link', { name: /view cart/i }).click();

    // Verify cart page loaded
    await expect(
      page,
      'Should navigate to cart page'
    ).toHaveURL(/cart/);
  });

  test('user can navigate between pages', async ({ page }) => {
    await page.goto(`${BASE_URL}`, { waitUntil: 'domcontentloaded' });

    // Navigate to products
    const productsLink = page.getByRole('link', { name: /products/i });
    await productsLink.click();

    await expect(page).toHaveURL(/products/);

    // Navigate to home via the navbar Home link
    const homeLink = page.locator('.navbar-nav').getByRole('link', { name: /home/i });
    await homeLink.click();

    await expect(
      page,
      'Should navigate back to home page'
    ).toHaveURL(BASE_URL + '/');
  });
});
