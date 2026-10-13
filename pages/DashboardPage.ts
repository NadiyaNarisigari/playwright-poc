import { Page, expect } from '@playwright/test';
import { dashboardLocators as L } from '../locators/dashboard';

// Checks the dashboard is open after login.
// Pass a longer timeout for the first load of the app (e.g. in parallel runs, where it starts more slowly).
export const verifyDashboardOpen = async (page: Page, timeout?: number) => {
  await expect(page).toHaveURL(/\/dashboard/, { timeout });
  await expect(L.messages.welcome(page)).toBeVisible({ timeout });
};