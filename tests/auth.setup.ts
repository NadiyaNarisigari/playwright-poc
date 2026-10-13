import { test as setup } from '@playwright/test';
import { openLoginPage, login } from '../pages/LoginPage';
import { submitOtpWhenEnteredManually } from '../pages/OtpPage';
import { users } from '../test-data/ui/users';
import { AUTH_FILE } from '../config/auth';

const OTP_WAIT_MS = 120_000;       // 2 minutes: time for a person to type the SMS OTP
const DASHBOARD_WAIT_MS = 30_000;  // 30 seconds: dashboard to open after Submit
const SETUP_TIMEOUT_MS = 240_000;  // 4 minutes: the whole login

// Logs in once per run (a person types the OTP) and saves the session for all UI tests
setup('Log in once and save the session', async ({ page }) => {
  setup.setTimeout(SETUP_TIMEOUT_MS);

  await openLoginPage(page);
  await login(page, users.qaUser.email, users.qaUser.password);
  await submitOtpWhenEnteredManually(page, OTP_WAIT_MS);
  await page.waitForURL(/\/dashboard/, { timeout: DASHBOARD_WAIT_MS });

  await page.context().storageState({ path: AUTH_FILE });
});