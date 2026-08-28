import { test, expect } from '@playwright/test';

test.describe('Lube Furniture - Collections & Product Inspector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collections');
  });

  test('should allow filtering across all collections', async ({ page }) => {
    // Click Bedroom tab
    await page.getByRole('tab', { name: /bedroom/i }).click();
    await expect(page.getByRole('heading', { name: /bedroom/i, level: 2 })).toBeVisible();

    // Click Dining tab
    await page.getByRole('tab', { name: /dining/i }).click();
    await expect(page.getByRole('heading', { name: /dining/i, level: 2 })).toBeVisible();

    // Click Workspace tab
    await page.getByRole('tab', { name: /workspace/i }).click();
    await expect(page.getByRole('heading', { name: /workspace/i, level: 2 })).toBeVisible();
  });

  test('should open product detail modal when clicking a product card', async ({ page }) => {
    const firstProduct = page.locator('article').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    // Verify modal appears
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('button', { name: /request quote for this piece/i })).toBeVisible();

    // Close modal
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
