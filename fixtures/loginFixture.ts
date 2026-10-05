import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OtpPage } from '../pages/OtpPage';
import { users } from '../test-data/users';

const OTP_WAIT_MS = 2 * 60 * 1000;
const DASHBOARD_WAIT_MS = 30 * 1000;
const TEST_TIMEOUT_MS = 4 * 60 * 1000;

type LoginFixtures = {
  /** Logs in and returns once the dashboard is open. Needs a person to type the SMS OTP. */
  loggedInPage: void;
};

export const test = base.extend<LoginFixtures>({
  loggedInPage: async ({ page }, use, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_MS);

    const loginPage = new LoginPage(page);
    const otpPage = new OtpPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login(users.qaUser.email, users.qaUser.password);

    // The OTP arrives by SMS, so a person types the six digits into the browser.
    // Submit is clicked automatically once all six boxes are filled.
    try {
      await otpPage.submitWhenOtpEnteredManually(OTP_WAIT_MS);
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

    await use();
  },
});

export { expect };