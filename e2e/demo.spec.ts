import { test, expect } from '@playwright/test';

test.describe('Demo Mode', () => {
  test('can navigate to demo page', async ({ page }) => {
    await page.goto('/start');
    await page.getByRole('link', { name: /demo/i }).click();
    await expect(page).toHaveURL(/.*demo/);
  });

  test('shows back to real trading link on demo page', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.getByRole('link', { name: /back to real trading/i })).toBeVisible();
  });

  test('shows demo session setup form', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.getByPlaceholder(/USD for demo/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /start demo/i })).toBeVisible();
  });

  test('shows error for invalid demo amount', async ({ page }) => {
    await page.goto('/demo');
    await page.getByPlaceholder(/USD for demo/i).fill('0');
    await page.getByRole('button', { name: /start demo/i }).click();
    await expect(page.locator('.status')).toBeVisible();
  });

  test('can return to start page from demo', async ({ page }) => {
    await page.goto('/demo');
    await page.getByRole('link', { name: /back to real trading/i }).click();
    await expect(page).toHaveURL(/.*start/);
  });
});
