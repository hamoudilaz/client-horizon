import { test, expect } from '@playwright/test';

/**
 * Full authentication flow test
 * Requires:
 *  - Backend running
 *  - Valid test private key in TEST_PRIVATE_KEY env variable
 *
 * Run with: TEST_PRIVATE_KEY=your_key npx playwright test auth-flow.spec.ts
 */
test.describe('Authentication Flow', () => {
  const TEST_KEY = process.env.TEST_PRIVATE_KEY;

  test.skip(!TEST_KEY, 'Skipping - TEST_PRIVATE_KEY not set');

  test('login and view dashboard', async ({ page }) => {
    // 1. Go to start page
    await page.goto('/start');
    await expect(page.getByPlaceholder(/private key/i)).toBeVisible();

    // 2. Enter private key
    await page.getByPlaceholder(/private key/i).fill(TEST_KEY!);
    await page.getByRole('button', { name: /submit/i }).click();

    // 3. Wait for redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 4. Verify dashboard elements
    await expect(page.getByText(/HORIZON/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();

    // 5. Verify public key is displayed
    await expect(page.getByText(/public key/i)).toBeVisible();

    // 6. Verify trading form is loaded
    await expect(page.getByPlaceholder(/contract address|mint/i)).toBeVisible();

    // 7. Logout
    await page.getByRole('button', { name: /logout/i }).click();

    // 8. Should redirect to start
    await expect(page).toHaveURL(/.*start/);
  });
});
