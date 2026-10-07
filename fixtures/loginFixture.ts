import { test as base, expect, Page } from '@playwright/test';
import { openLoginPage, login } from '../pages/LoginPage';
import { submitOtpWhenEnteredManually } from '../pages/OtpPage';
import { users } from '../test-data/users';

const OTP_WAIT_MS = 120_000;       // 2 minutes
const DASHBOARD_WAIT_MS = 30_000;  // 30 seconds
const TEST_TIMEOUT_MS = 240_000;   // 4 minutes

type LoginFixtures = {
  // A page that is already logged in, with the dashboard open. Needs a person to type the SMS OTP.
  loggedInPage: Page;
};

export const test = base.extend<LoginFixtures>({
  loggedInPage: async ({ page }, use, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_MS);

    await openLoginPage(page);
    await login(page, users.qaUser.email, users.qaUser.password);

    // A person types the SMS code; Submit is clicked automatically
    try {
      await submitOtpWhenEnteredManually(page, OTP_WAIT_MS);
    } catch (error) {
      throw new Error(
        'The OTP was not entered in time. Type the 6-digit SMS code in the browser ' +
          '(run with --headed so the browser is visible).',
        { cause: error },
      );
    }

    try {
      await page.waitForURL(/\/dashboard/, { timeout: DASHBOARD_WAIT_MS });
    } catch (error) {
      throw new Error(
        'Submit was clicked but the dashboard did not open. The OTP may have been wrong or expired.',
        { cause: error },
      );
    }

    // Hand the logged-in page to the test
    await use(page);
  },
});

export { expect };