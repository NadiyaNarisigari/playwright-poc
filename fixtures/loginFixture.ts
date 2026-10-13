import { test as base, expect, Page } from '@playwright/test';
import { verifyDashboardOpen } from '../pages/DashboardPage';

// First load of the app in a fresh browser can be slow when several workers start it at once
const FIRST_DASHBOARD_LOAD_MS = 30_000;

type LoginFixtures = {
  // A page that is already logged in (saved session from tests/auth.setup.ts), with the dashboard open
  loggedInPage: Page;
};

export const test = base.extend<LoginFixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/dashboard');
    try {
      await verifyDashboardOpen(page, FIRST_DASHBOARD_LOAD_MS);
    } catch (error) {
      throw new Error(
        'The saved login session did not open the dashboard within 30 s. ' +
          'Check the screenshot: a blank page means the app was still loading; the login page means the session expired.',
        { cause: error },
      );
    }
    await use(page);
  },
});

export { expect };