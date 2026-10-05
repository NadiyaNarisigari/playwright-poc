import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { FactoryDetails } from '../test-data/factories';

export class AddFactoryPage extends BasePage {
  readonly modalTitle: Locator;
  readonly nameInput: Locator;
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly streetInput: Locator;
  readonly cancelButton: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modalTitle = page.getByText('Add New Factory');
    this.nameInput = page.getByRole('textbox', { name: 'companyName' });
    this.countryDropdown = page.getByRole('combobox', { name: 'companyCountry' });
    this.stateDropdown = page.getByRole('combobox', { name: 'companyState' });
    this.cityDropdown = page.getByRole('combobox', { name: 'companyCity' });
    this.streetInput = page.getByRole('textbox', { name: 'companyStreet1' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
  }

  private async selectFrom(dropdown: Locator, value: string) {
    await dropdown.click();
    await this.page.getByRole('option', { name: value, exact: true }).click();
  }

  async selectCountry(country: string) {
    await this.selectFrom(this.countryDropdown, country);
  }

  async selectState(state: string) {
    await this.selectFrom(this.stateDropdown, state);
  }

  async selectCity(city: string) {
    await this.selectFrom(this.cityDropdown, city);
  }

  async fillFactoryForm(details: FactoryDetails) {
    await this.nameInput.fill(details.name);
    await this.selectCountry(details.country);
    await this.selectState(details.state);
    await this.selectCity(details.city);
    await this.streetInput.fill(details.street);
  }

  async clickAdd() {
    await this.addButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}