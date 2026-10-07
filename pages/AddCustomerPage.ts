import { Page, expect } from '@playwright/test';
import { addCustomerLocators as L } from '../locators/addCustomer';
import { selectOption, clickOutsideOn } from './CommonFunctions';
import { escapeRegExp } from '../utils/regex';
import type { CustomerDetails } from '../test-data/customers';

// Opens the "Add New Customer" form
export const openAddCustomerForm = async (page: Page) => {
  await L.form.openButton(page).click();
  await expect(L.form.title(page)).toBeVisible();
};

// Selects the CSM: search by email, tick it, close the list
export const selectCsm = async (page: Page, email: string) => {
  await L.csm.dropdown(page).click();
  await L.csm.searchInput(page).fill(email);
  await L.csm.result(page, email).click();

  await clickOutsideOn(page, L.form.title(page));

  // Check the list closed and the CSM is shown in the field
  await expect(L.csm.searchInput(page), 'CSM list did not close').toBeHidden();
  await expect(L.csm.dropdown(page), 'CSM was not selected').toContainText(
    new RegExp(escapeRegExp(email), 'i'),
  );
};

// Fills every field of the form
export const fillCustomerForm = async (page: Page, customer: CustomerDetails) => {
  await L.fields.name(page).fill(customer.name);
  await selectCsm(page, customer.csmEmail);
  await selectOption(page, L.address.country(page), customer.country);
  await selectOption(page, L.address.state(page), customer.state);
  await selectOption(page, L.address.city(page), customer.city);
  await L.address.street(page).fill(customer.street);
  await L.address.zipCode(page).fill(customer.zipCode);
  // Leave the last field so the form validates it
  await page.keyboard.press('Tab');
};

// Clicks Add and checks the form closes with a success message
export const saveCustomer = async (page: Page, name: string) => {
  await expect(L.buttons.add(page)).toBeEnabled();
  await L.buttons.add(page).click();
  await expect(L.form.title(page)).toBeHidden();
  await expect(L.messages.created(page, name)).toBeVisible();
};