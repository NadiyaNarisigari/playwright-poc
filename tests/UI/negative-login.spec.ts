import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { invalidCredentials } from '../../test-data/invalidCredentials';

test.describe('Negative login scenarios', () => {
  test('shows error for invalid email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login(invalidCredentials.invalidEmail.email, invalidCredentials.invalidEmail.password);

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('shows error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login(invalidCredentials.invalidPassword.email, invalidCredentials.invalidPassword.password);

    await expect(loginPage.errorMessage).toBeVisible();
  });
});