import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('redirects to /start when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*start/);
  });

  test('redirects /dashboard to /start when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*start/);
  });

  test('displays Horizon header', async ({ page }) => {
    await page.goto('/start');
    await expect(page.locator('text=HORIZON')).toBeVisible();
  });

  test('shows demo button on start page', async ({ page }) => {
    await page.goto('/start');
    await expect(page.getByRole('link', { name: /demo/i })).toBeVisible();
  });

  test('page title updates based on route', async ({ page }) => {
    await page.goto('/start');
    await expect(page).toHaveTitle(/Horizon/i);
  });
});
