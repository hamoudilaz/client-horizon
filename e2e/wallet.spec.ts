import { test, expect } from '@playwright/test';

test.describe('Wallet Setup', () => {
  test('shows private key input form', async ({ page }) => {
    await page.goto('/start');
    await expect(page.getByPlaceholder(/private key/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
  });

  test('shows error for invalid private key format', async ({ page }) => {
    await page.goto('/start');
    await page.getByPlaceholder(/private key/i).fill('invalid-key');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.locator('.status')).toContainText(/invalid/i);
  });

  test('shows error for empty private key', async ({ page }) => {
    await page.goto('/start');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.locator('.status')).toContainText(/invalid/i);
  });

  test('private key input accepts text', async ({ page }) => {
    await page.goto('/start');
    const input = page.getByPlaceholder(/private key/i);
    await input.fill('testkey123');
    await expect(input).toHaveValue('testkey123');
  });
});
