# Study with Asma - QA Workflow

This document outlines our end-to-end testing strategy using **Playwright** and **Playwright Test Agents (v1.56+)**.

## How to Run Tests Locally

You can run the end-to-end suite against your local development server (`http://localhost:3000`).

1. Make sure your local server is running:
   ```bash
   pnpm dev
   ```
2. Run tests in headless mode (perfect for CI or quick checks):
   ```bash
   pnpm run test:e2e
   ```
3. Run tests in UI mode (great for debugging and stepping through time):
   ```bash
   pnpm run test:e2e:ui
   ```

## Adding a New Test for a New Feature

When you build a new feature, you shouldn't just manually verify it and move on. You should generate a regression test using Playwright Test Agents!

1. Build your feature.
2. Ask your AI coding agent (e.g. Antigravity, Claude, or Cursor) to explore the feature live using the **Planner** and then generate a test using the **Generator**.
   - Example prompt: *"I just added a new user profile page at `/profile`. Use the Playwright Planner to explore it and the Generator to produce a new `profile.spec.ts` test verifying that a user can update their bio."*
3. The AI agent will navigate the live site in the background (using `playwright-mcp`), generate the scenario, and write the test file to `tests/e2e/`.

## Healing Broken Tests

When UI changes (like a redesigned button or a changed form label) cause an existing test to fail, don't manually rewrite the selectors! Use the **Healer** agent.

1. Run your tests locally. Note which test fails.
2. Ask your AI agent to heal the test.
   - Example prompt: *"The `courses.spec.ts` test is failing because I changed the course card structure. Please use the Playwright Healer to fix it."*
3. The AI agent will run the test, analyze the failure traceback and DOM snapshot, and automatically patch the `.spec.ts` file with the correct new selectors.

## Continuous Integration (CI)

A GitHub Actions workflow is configured in `.github/workflows/playwright.yml`. It runs the full Playwright suite on every push and pull request to the `main` or `master` branches, ensuring regressions are caught automatically before merging.
