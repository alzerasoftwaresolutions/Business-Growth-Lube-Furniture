import { test, expect } from '@playwright/test';

test.describe('Lube Furniture - Request for Quote Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open RFQ modal from header CTA and submit successfully', async ({ page }) => {
    // Click Header Request Quote button
    await page.getByRole('button', { name: /request quote/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/Request a Furniture Quote/i)).toBeVisible();

    // Fill form
    await page.locator('input[type="text"]').first().fill('Jane Doe');
    await page.locator('input[type="email"]').fill('jane@example.com');
    await page.locator('input[type="tel"]').fill('+251 91 123 4567');
    await page.locator('textarea').fill('Looking for custom dining table and 8 chairs.');

    // Submit
    await page.getByRole('button', { name: /submit quote request/i }).click();

    // Verify confirmation message
    await expect(page.getByText(/Thank you/i)).toBeVisible();
    await expect(page.getByText(/Our design team will review your project/i)).toBeVisible();
  });
});
