import { test, expect } from '@playwright/test';

const BASE_URL = 'https://the-internet.herokuapp.com';

test.describe('The Internet — Technical UI Challenges', () => {
  test('checkboxes can be selected and unselected', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkboxes`);

    const checkbox1 = page.locator('input[type="checkbox"]').first();
    const checkbox2 = page.locator('input[type="checkbox"]').nth(1);

    // Checkbox 1 should be unchecked initially
    await expect(
      checkbox1,
      'First checkbox should be unchecked initially'
    ).not.toBeChecked();

    // Check the first checkbox
    await checkbox1.check();
    await expect(
      checkbox1,
      'First checkbox should be checked after click'
    ).toBeChecked();

    // Uncheck the first checkbox
    await checkbox1.uncheck();
    await expect(
      checkbox1,
      'First checkbox should be unchecked after uncheck'
    ).not.toBeChecked();

    // Checkbox 2 should be checked initially
    await expect(
      checkbox2,
      'Second checkbox should be checked initially'
    ).toBeChecked();

    // Uncheck the second checkbox
    await checkbox2.uncheck();
    await expect(
      checkbox2,
      'Second checkbox should be unchecked after uncheck'
    ).not.toBeChecked();
  });

  test('dropdown option can be selected', async ({ page }) => {
    await page.goto(`${BASE_URL}/dropdown`);

    const dropdown = page.locator('#dropdown');

    // Select an option by value
    await dropdown.selectOption('1');

    await expect(
      dropdown,
      'Dropdown should show selected option 1'
    ).toHaveValue('1');

    // Select another option
    await dropdown.selectOption('2');

    await expect(
      dropdown,
      'Dropdown should show selected option 2'
    ).toHaveValue('2');
  });

  test('dynamic loading waits for final text without hard wait', async ({ page }) => {
    await page.goto(`${BASE_URL}/dynamic_loading/2`);

    const startButton = page.locator('button:has-text("Start")');
    const finishText = page.locator('#finish h4');

    // Click the start button to trigger dynamic loading
    await startButton.click();

    // Wait for the loading spinner to disappear (it should exist then disappear)
    await page.locator('#loading').waitFor({ state: 'hidden' });

    // Wait for the "Hello World!" text to appear
    await expect(
      finishText,
      'Should display "Hello World!" after dynamic loading completes'
    ).toContainText('Hello World!', { timeout: 10000 });
  });

  test('broken images are detected', async ({ page }) => {
    await page.goto(`${BASE_URL}/broken_images`);

    const images = page.locator('img');
    const imageCount = await images.count();

    // Verify there are images on the page
    await expect(
      imageCount,
      'Should have at least 3 images on the broken images page'
    ).toBeGreaterThanOrEqual(3);

    // Check each image for broken status
    // Broken images will either have naturalHeight of 0 or fail to load
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const isBroken = image.evaluate((el) => {
        const img = el as HTMLImageElement;
        return img.naturalHeight === 0 || img.complete === false;
      });

      // Log the result for visibility
      const src = await image.getAttribute('src');
      console.log(`Image ${i + 1} (${src}): ${await isBroken ? 'BROKEN' : 'OK'}`);
    }

    // At least one image should be broken (as per the page design)
    const allImages = page.locator('img').evaluateAll((elements) => {
      return elements.map((el) => {
        const img = el as HTMLImageElement;
        return {
          src: img.src,
          isBroken: img.naturalHeight === 0 || img.complete === false,
        };
      });
    });

    const brokenImages = (await allImages).filter((img) => img.isBroken);

    expect(
      brokenImages.length,
      'Should detect at least one broken image'
    ).toBeGreaterThan(0);
  });
});