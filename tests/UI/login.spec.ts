import { test, expect } from '../../fixtures/loginFixture';
import { DashboardPage } from '../../pages/DashboardPage';

test('QA user can log in and reach the dashboard', async ({ page, loggedInPage }) => {
  const dashboard = new DashboardPage(page);

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(dashboard.welcomeMessage).toBeVisible();
});