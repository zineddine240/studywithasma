import { test, expect } from '@playwright/test';

test.describe('Request Access Flow', () => {
  test('Prospective student can submit an access request', async ({ page }) => {
    // Mock the API endpoint
    await page.route('/api/request-access', async route => {
      await route.fulfill({ json: { success: true } });
    });

    await page.goto('/request-access');

    // Wait for the form to be fully hydrated to prevent React from wiping out early inputs
    await page.waitForTimeout(500);
    await expect(page.getByLabel(/full name/i)).toBeVisible();

    await page.getByLabel(/full name/i).focus();
    await page.keyboard.type('Test User');
    
    await page.getByLabel(/email/i).focus();
    await page.keyboard.type('test@example.com');
    
    await page.getByLabel(/password/i).focus();
    await page.keyboard.type('securepassword123');
    await page.getByLabel(/phone/i).fill('+123456789');
    await page.getByLabel(/country/i).fill('Canada');
    
    // Select dropdowns
    await page.getByPlaceholder(/Select a course/i).click();
    await page.getByRole('option', { name: /Academic IELTS/i }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: /Academic IELTS/i }).click();

    await page.getByPlaceholder(/Select your level/i).click();
    await page.getByRole('option', { name: /Beginner/i }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: /Beginner/i }).click();

    await page.getByPlaceholder(/Select your target/i).click();
    await page.getByRole('option', { name: /7.0/i }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: /7.0/i }).click();

    await page.getByPlaceholder(/Select your reason/i).click();
    await page.getByRole('option', { name: /Work/i }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: /Work/i }).click();

    // Check agreement
    await page.getByRole('checkbox').check();

    // Submit form
    await page.getByRole('button', { name: /submit/i }).click();

    // Verify success message
    await expect(page.getByText(/submitted successfully|request received/i)).toBeVisible();
  });
});
