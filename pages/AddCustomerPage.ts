import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { addCustomerLocators as L } from '../locators/addCustomer';
import { escapeRegExp } from '../utils/regex';
import type { CustomerDetails } from '../test-data/customers';

// Actions on the "Add New Customer" form
export class AddCustomerPage extends BasePage {
  readonly openDialogButton: Locator;
  readonly modalTitle: Locator;
  readonly nameInput: Locator;
  readonly csmDropdown: Locator;
  readonly csmSearchInput: Locator;
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly streetInput: Locator;
  readonly zipCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    super(page);
    this.openDialogButton = L.form.openButton(page);
    this.modalTitle = L.form.title(page);
    this.nameInput = L.fields.name(page);
    this.csmDropdown = L.csm.dropdown(page);
    this.csmSearchInput = L.csm.searchInput(page);
    this.countryDropdown = L.address.country(page);
    this.stateDropdown = L.address.state(page);
    this.cityDropdown = L.address.city(page);
    this.streetInput = L.address.street(page);
    this.zipCodeInput = L.address.zipCode(page);
    this.cancelButton = L.buttons.cancel(page);
    this.addButton = L.buttons.add(page);
  }

  // Success message for the given customer name
  createdMessage(name: string): Locator {
    return L.messages.created(this.page, name);
  }

  // Selects the CSM: open list, search by email, tick the result, close the list
  async selectCsm(email: string) {
    await this.csmDropdown.click();
    await this.csmSearchInput.fill(email);

    const result = L.csm.result(this.page, email);
    await expect(result).toBeVisible();
    await result.click();

    await this.clickOutsideOn(this.modalTitle);

    // Check the list closed and the CSM is shown in the field
    await expect(this.csmSearchInput, 'CSM list did not close').toBeHidden();
    await expect(this.csmDropdown, 'CSM was not selected').toContainText(
      new RegExp(escapeRegExp(email), 'i'),
    );
  }

  // Fills every field of the form
  async fillCustomerForm(details: CustomerDetails) {
    await this.nameInput.fill(details.name);
    await this.selectCsm(details.csmEmail);
    await this.selectOption(this.countryDropdown, details.country);
    await this.selectOption(this.stateDropdown, details.state);
    await this.selectOption(this.cityDropdown, details.city);
    await this.streetInput.fill(details.street);
    await this.zipCodeInput.fill(details.zipCode);
    // Leave the last field so the form validates it
    await this.page.keyboard.press('Tab');
  }

  async clickAdd() {
    await this.addButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}