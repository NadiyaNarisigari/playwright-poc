import { Page, expect } from '@playwright/test';
import { settingsMenuLocators as L } from '../locators/settingsMenu';

// Opens the Settings menu in the top-right corner
export const openSettingsMenu = async (page: Page) => {
  await L.buttons.settings(page).click();
};

// Checks the role shown in the Settings menu, e.g. "Administrator"
export const verifyRole = async (page: Page, role: string) => {
  await expect(L.labels.role(page)).toHaveText(role);
};

// Clicks "Fleet Management" in the (already open) Settings menu
export const chooseFleetManagementInMenu = async (page: Page) => {
  await L.menuItems.fleetManagement(page).click();
  await expect(page).toHaveURL(/\/group/);
};