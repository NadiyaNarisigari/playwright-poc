import { Page, expect } from '@playwright/test';
import { fleetManagementLocators as L } from '../locators/fleetManagement';
import { openSettingsMenu, chooseFleetManagementInMenu } from './SettingsMenu';
import { openUntilVisible } from './CommonFunctions';
import { assertTestRecord } from '../utils/guards';

// ---------- Page and tabs ----------

// Opens Fleet Management from the Settings menu
export const openFleetManagement = async (page: Page) => {
  await openSettingsMenu(page);
  await chooseFleetManagementInMenu(page);
};

// Checks both tabs are shown
export const verifyFleetManagementTabs = async (page: Page) => {
  await expect(L.tabs.factory(page)).toBeVisible();
  await expect(L.tabs.customer(page)).toBeVisible();
};

export const openFactoryTab = async (page: Page) => {
  await L.tabs.factory(page).click();
};

export const openCustomerTab = async (page: Page) => {
  await L.tabs.customer(page).click();
};

// ---------- Customer tab ----------

// Finds a customer in the dropdown (search) and selects it
export const selectCustomer = async (page: Page, name: string) => {
  // New customers only show up after switching tabs
  await openFactoryTab(page);
  await openCustomerTab(page);

  await openUntilVisible(L.customer.dropdown(page), L.customer.list(page));
  await L.customer.searchInput(page).fill(name);

  // The result text is shortened with "...", so click the single result instead of matching text
  await expect(L.common.anyOption(page)).toHaveCount(1);
  await L.common.anyOption(page).first().click();

  // The dropdown shows max 30 characters; the row on the right shows the full name
  await expect(L.customer.dropdown(page)).toContainText(name.slice(0, 30));
  await expect(L.customer.row(page, name)).toBeVisible();
};

// Deletes the selected customer, only if it is a test customer (prefix) named in the dialog
export const deleteCustomer = async (page: Page, name: string, expectedPrefix: string) => {
  assertTestRecord(name, expectedPrefix);

  // The trash icon only appears while hovering over the row
  await L.customer.row(page, name).hover();
  await L.customerDelete.icon(page).click();

  const dialog = L.customerDelete.dialog(page);
  await expect(dialog).toBeVisible();
  await expect(dialog, 'Delete dialog names a different customer').toContainText(name);
  await dialog.getByText('Delete', { exact: true }).click();
  await expect(L.customerDelete.deletedToast(page)).toBeVisible();
};

// ---------- Factory tab ----------

// Selects a factory by name in the factory dropdown.
// Matches on the first 30 characters, in case the list shortens long names with "...".
export const selectFactory = async (page: Page, name: string) => {
  // New factories only show up after switching tabs
  await openCustomerTab(page);
  await openFactoryTab(page);

  await L.factory.dropdown(page).click();
  const option = L.factory.optionsStartingWith(page, name.slice(0, 30));
  await expect(option, `Factory "${name}" not found in the list`).toHaveCount(1);
  await option.click();
};

// Deletes the selected factory, only if the dialog names it (name or prefix)
export const deleteSelectedFactory = async (page: Page, prefix: string) => {
  await L.factory.rowMenu(page).click();
  await L.factoryDelete.menuItem(page).click();
  await expect(L.factoryDelete.confirmText(page, prefix)).toBeVisible();
  await L.factoryDelete.confirmButton(page).click();
  await expect(L.factoryDelete.deletedToast(page)).toBeVisible();
};

// Reloads the page and checks how many factories starting with this text are left
export const verifyTestFactoryCount = async (page: Page, prefix: string, expectedCount: number) => {
  await page.reload();
  await L.factory.dropdown(page).click();
  await expect(L.common.anyOption(page).first()).toBeVisible();
  await expect(L.factory.optionsStartingWith(page, prefix)).toHaveCount(expectedCount);
};

// Deletes the selected factory, only if it is a test factory (prefix) named in the dialog
export const deleteFactory = async (page: Page, name: string, expectedPrefix: string) => {
  assertTestRecord(name, expectedPrefix);
  await deleteSelectedFactory(page, name);
};

// Reloads the page and checks the factory is no longer in the list
export const verifyFactoryDeleted = async (page: Page, name: string) => {
  await verifyTestFactoryCount(page, name.slice(0, 30), 0);
};