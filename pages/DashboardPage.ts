import { Page, expect } from '@playwright/test';
import { dashboardLocators as L } from '../locators/dashboard';

// Checks the dashboard is open after login
export const verifyDashboardOpen = async (page: Page) => {
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(L.messages.welcome(page)).toBeVisible();
};