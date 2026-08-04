import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Flow', () => {
  test('Admin dashboard requires authentication and redirects', async ({ page }) => {
    // Navigate to admin area without auth
    await page.goto('/admin');

    // Verify it redirects away from the dashboard to a login or setup screen
    // because we are not authenticated
    await expect(page).not.toHaveURL(/\/admin$/);
  });
});
