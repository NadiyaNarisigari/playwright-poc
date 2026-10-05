import { test, expect } from '../../fixtures/loginFixture';

test('QA user can log in and reach the dashboard', async ({ page, loggedInPage }) => {
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText('Welcome to Noedra Node')).toBeVisible();
});