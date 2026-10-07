import { test } from '../../fixtures/loginFixture';
import { openLoginPage, login, verifyLoginError } from '../../pages/LoginPage';
import { verifyDashboardOpen } from '../../pages/DashboardPage';
import { invalidCredentials } from '../../test-data/invalidCredentials';

test.describe('Login', () => {
  // loggedInPage logs in first (email, password, OTP); the test starts on the dashboard
  test('QA user can log in and reach the dashboard', async ({ page, loggedInPage }) => {
    await test.step('Check the dashboard is open', async () => {
      await verifyDashboardOpen(page);
    });
  });

  // The two tests below don't ask for loggedInPage, so they start logged out (no OTP needed)
  test('shows error for invalid email', async ({ page }) => {
    await test.step('Log in with an email that does not exist', async () => {
      await openLoginPage(page);
      await login(page, invalidCredentials.invalidEmail.email, invalidCredentials.invalidEmail.password);
    });

    await test.step('Check the error message', async () => {
      await verifyLoginError(page);
    });
  });

  test('shows error for invalid password', async ({ page }) => {
    await test.step('Log in with a wrong password', async () => {
      await openLoginPage(page);
      await login(page, invalidCredentials.invalidPassword.email, invalidCredentials.invalidPassword.password);
    });

    await test.step('Check the error message', async () => {
      await verifyLoginError(page);
    });
  });
});