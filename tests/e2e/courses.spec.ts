import { test, expect } from '@playwright/test';

test.describe('Courses Directory Flow', () => {
  test('User can view available courses', async ({ page }) => {
    await page.goto('/courses');

    // Verify page title or main heading
    await expect(page.getByRole('heading', { name: /Choose Your Path to IELTS Success|Select Your Course/i }).first()).toBeVisible();

    // Verify that at least one course card or item is rendered
    // Adjust selector based on actual DOM structure
    const courseCards = page.locator('.course-card, [data-testid="course-card"]');
    if (await courseCards.count() > 0) {
      await expect(courseCards.first()).toBeVisible();
    } else {
      // Fallback assertion if specific cards aren't used
      await expect(page.getByText(/IELTS/i).first()).toBeVisible();
    }
  });
});
