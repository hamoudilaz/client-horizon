import { test, expect } from '@playwright/test';

/**
 * Full user flow test for Demo Mode with mocked backend
 */
test.describe('Demo Trading Flow', () => {
  test('complete demo trading session with mocked data', async ({ page }) => {
    let demoStarted = false;

    // Mock session check (not authenticated)
    await page.route('**/api/session', (route) => {
      route.fulfill({ status: 200, json: { pubKey: null } });
    });

    // Mock demo session check - returns valid after demo starts
    await page.route('**/api/demo/session', (route) => {
      route.fulfill({ status: 200, json: { valid: demoStarted } });
    });

    // Mock demo start
    await page.route('**/api/demo/start', (route) => {
      demoStarted = true;
      route.fulfill({ status: 200, json: { success: true, balance: 500 } });
    });

    // Mock demo session state (balance)
    await page.route('**/api/demo/session/state', (route) => {
      route.fulfill({ status: 200, json: { wsolBalance: 2.5, usdValue: 500 } });
    });

    // Mock demo tokens
    await page.route('**/api/demo/tokens', (route) => {
      route.fulfill({
        status: 200,
        json: [
          {
            tokenMint: 'So11111111111111111111111111111111111111112',
            symbol: 'SOL',
            balance: 2.5,
            usdValue: 500,
          },
          {
            tokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            symbol: 'USDC',
            balance: 100,
            usdValue: 100,
          },
        ],
      });
    });

    // 1. Start at home, get redirected to /start
    await page.goto('/');
    await expect(page).toHaveURL(/.*start/);

    // 2. Navigate to demo mode
    await page.getByRole('link', { name: /demo/i }).click();
    await expect(page).toHaveURL(/.*demo/);

    // 3. Start demo session with $500
    await page.getByPlaceholder(/USD for demo/i).fill('500');
    await page.getByRole('button', { name: /start demo/i }).click();

    // 4. Wait for demo dashboard to load - need to reload for state to update
    await page.waitForTimeout(500);
    await page.reload();

    // 5. Verify "Start New Demo Session" button is visible (means we're in demo dashboard)
    await expect(page.getByRole('button', { name: /start new demo session/i })).toBeVisible({
      timeout: 10000,
    });

    // 6. Verify OwnedTokens section shows tokens
    await expect(page.locator('text=SOL').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=USDC').first()).toBeVisible({ timeout: 5000 });
  });
});
