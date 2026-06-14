import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/automation-exercise/HomePage";
import { subscriberEmail } from "../../test-data/products";

/**
 * Automation Exercise — newsletter subscription from the footer.
 */
test.describe("Automation Exercise — newsletter", () => {
  test("visitor can subscribe to the newsletter from the footer", async ({ page }) => {
    const home = new HomePage(page);

    await home.open();
    await home.subscribe(subscriberEmail);

    await expect(
      home.subscriptionSuccess,
      "A success message should confirm the subscription"
    ).toBeVisible();
  });
});
