import { Page, expect } from '@playwright/test';
import { addFactoryLocators as L } from '../locators/addFactory';
import { fleetManagementLocators as F } from '../locators/fleetManagement';
import { selectOption } from './CommonFunctions';
import type { FactoryDetails } from '../test-data/factories';

// Opens the "Add New Factory" form from the toolbar menu
export const openAddFactoryForm = async (page: Page) => {
  await F.factory.toolbarMenu(page).click();
  await F.factory.addMenuItem(page).click();
  await expect(L.form.title(page)).toBeVisible();
};

// Fills every field of the form
export const fillFactoryForm = async (page: Page, factory: FactoryDetails) => {
  await L.fields.name(page).fill(factory.name);
  await selectOption(page, L.address.country(page), factory.country);
  await selectOption(page, L.address.state(page), factory.state);
  await selectOption(page, L.address.city(page), factory.city);
  await L.address.street(page).fill(factory.street);
  await L.address.zipCode(page).fill(factory.zipCode);
  // Leave the last field so the form validates it
  await page.keyboard.press('Tab');
};

// Clicks Add and checks the form closes
export const saveFactory = async (page: Page) => {
  await expect(L.buttons.add(page)).toBeEnabled();
  await L.buttons.add(page).click();
  await expect(L.form.title(page)).toBeHidden();
};