import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { addFactoryLocators as L } from '../locators/addFactory';
import type { FactoryDetails } from '../test-data/factories';

// Actions on the "Add New Factory" form
export class AddFactoryPage extends BasePage {
  readonly modalTitle: Locator;
  readonly nameInput: Locator;
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly streetInput: Locator;
  readonly zipCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modalTitle = L.form.title(page);
    this.nameInput = L.fields.name(page);
    this.countryDropdown = L.address.country(page);
    this.stateDropdown = L.address.state(page);
    this.cityDropdown = L.address.city(page);
    this.streetInput = L.address.street(page);
    this.zipCodeInput = L.address.zipCode(page);
    this.cancelButton = L.buttons.cancel(page);
    this.addButton = L.buttons.add(page);
  }

  // Fills every field of the form
  async fillFactoryForm(details: FactoryDetails) {
    await this.nameInput.fill(details.name);
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