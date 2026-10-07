import { test } from '../../fixtures/loginFixture';
import { openLoginPage, login, verifyLoginError } from '../../pages/LoginPage';
import { verifyDashboardOpen } from '../../pages/DashboardPage';
import { invalidCredentials } from '../../test-data/invalidCredentials';

test.describe('Login', () => {
// loggedInPage is a page that has already logged in (email, password, OTP)
  test('QA user can log in and reach the dashboard', async ({ loggedInPage }) => {
    await test.step('Check the dashboard is open', async () => {
      await verifyDashboardOpen(loggedInPage);
    });
  });

  // The two tests below use a plain page, so they start logged out (no OTP needed)
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