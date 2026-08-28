import { test, expect } from '@playwright/test';

test.describe('Lube Furniture - Core Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage with hero and key sections', async ({ page }) => {
    await expect(page).toHaveTitle(/Lube Furniture/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Lube Furniture', { exact: false }).first()).toBeVisible();
  });

  test('should navigate to Collections page', async ({ page }) => {
    await page.getByRole('link', { name: /collections/i }).first().click();
    await expect(page).toHaveURL(/.*collections/);
    await expect(page.getByText(/Furniture Organized by the Way You Live/i)).toBeVisible();
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.getByRole('link', { name: /services/i }).first().click();
    await expect(page).toHaveURL(/.*services/);
    await expect(page.getByText(/From First Idea to Finished Space/i)).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.getByRole('link', { name: /about/i }).first().click();
    await expect(page).toHaveURL(/.*about/);
    await expect(page.getByText(/A Furniture Brand Built on Consideration/i)).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.getByRole('link', { name: /contact/i }).first().click();
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.getByText(/Let's Talk About Your Space/i)).toBeVisible();
  });
});
