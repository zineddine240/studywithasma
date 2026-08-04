import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('Login redirects to setup when no admin exists, or shows login form', async ({ page }) => {
    await page.goto('/login');

    const setupHeading = page.getByText(/setup|create admin/i).first();
    const loginHeading = page.getByText(/Platform Login/i);

    // Wait for either the setup page or login page to be ready
    await expect(setupHeading.or(loginHeading)).toBeVisible();
  });
});
