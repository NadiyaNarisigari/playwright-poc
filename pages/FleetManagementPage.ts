import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SettingsMenu } from './SettingsMenu';
import { fleetManagementLocators as L } from '../locators/fleetManagement';
import { assertTestRecord } from '../utils/guards';

// Actions on the Fleet Management page (Factory and Customer tabs)
export class FleetManagementPage extends BasePage {
  readonly settingsMenu: SettingsMenu;
  readonly factoryTab: Locator;
  readonly customerTab: Locator;
  readonly anyOption: Locator;

  // Factory tab
  readonly factoryDropdown: Locator;
  readonly toolbarMenu: Locator;
  readonly factoryRowMenu: Locator;
  readonly addFactoryMenuItem: Locator;
  readonly deleteMenuItem: Locator;
  readonly confirmDeleteButton: Locator;
  readonly factoryDeletedToast: Locator;

  // Customer tab
  readonly customerDropdown: Locator;
  readonly customerList: Locator;
  readonly customerSearchInput: Locator;
  readonly deleteCustomerIcon: Locator;
  readonly deleteCustomerDialog: Locator;
  readonly customerDeletedToast: Locator;

  constructor(page: Page) {
    super(page);
    this.settingsMenu = new SettingsMenu(page);
    this.factoryTab = L.tabs.factory(page);
    this.customerTab = L.tabs.customer(page);
    this.anyOption = L.common.anyOption(page);

    this.factoryDropdown = L.factory.dropdown(page);
    this.toolbarMenu = L.factory.toolbarMenu(page);
    this.factoryRowMenu = L.factory.rowMenu(page);
    this.addFactoryMenuItem = L.factory.addMenuItem(page);
    this.deleteMenuItem = L.factoryDelete.menuItem(page);
    this.confirmDeleteButton = L.factoryDelete.confirmButton(page);
    this.factoryDeletedToast = L.factoryDelete.deletedToast(page);

    this.customerDropdown = L.customer.dropdown(page);
    this.customerList = L.customer.list(page);
    this.customerSearchInput = L.customer.searchInput(page);
    this.deleteCustomerIcon = L.customerDelete.icon(page);
    this.deleteCustomerDialog = L.customerDelete.dialog(page);
    this.customerDeletedToast = L.customerDelete.deletedToast(page);
  }

  async openFromSettingsMenu() {
    await this.settingsMenu.openFleetManagement();
    await expect(this.page).toHaveURL(/\/group/);
  }

  // ---------- Factory tab ----------

  // New factories only show up after switching tabs
  async refreshFactoryList() {
    await this.customerTab.click();
    await this.factoryTab.click();
  }

  async openAddFactoryDialog() {
    await this.toolbarMenu.click();
    await this.addFactoryMenuItem.click();
  }

  // Options in the open factory dropdown whose name starts with the prefix
  factoryOptionsStartingWith(prefix: string): Locator {
    return L.factory.optionsStartingWith(this.page, prefix);
  }

  // Deletes the selected factory, only if the dialog names a test factory (prefix)
  async deleteSelectedFactory(expectedPrefix: string) {
    await this.factoryRowMenu.click();
    await this.deleteMenuItem.click();
    await expect(L.factoryDelete.confirmText(this.page, expectedPrefix)).toBeVisible();
    await this.confirmDeleteButton.click();
    await expect(this.factoryDeletedToast).toBeVisible();
  }

  // ---------- Customer tab ----------

  // New customers only show up after switching tabs
  async refreshCustomerList() {
    await this.factoryTab.click();
    await this.customerTab.click();
  }

  customerRow(name: string): Locator {
    return L.customer.row(this.page, name);
  }

  // Opens the customer dropdown, searches the name and selects the only result
  async selectCustomer(name: string) {
    await this.openUntilVisible(this.customerDropdown, this.customerList);
    await this.customerSearchInput.fill(name);

    // The result text is shortened with "...", so click the single result instead of matching text
    await expect(this.anyOption).toHaveCount(1);
    await this.anyOption.first().click();

    // The dropdown shows max 30 characters; the row on the right shows the full name
    await expect(this.customerDropdown).toContainText(name.slice(0, 30));
    await expect(this.customerRow(name)).toBeVisible();
  }

  // Deletes the selected customer, only if it is a test customer (prefix) named in the dialog
  async deleteSelectedCustomer(name: string, expectedPrefix: string) {
    assertTestRecord(name, expectedPrefix);

    // The trash icon only appears while hovering over the row
    await this.customerRow(name).hover();
    await this.deleteCustomerIcon.click();

    await expect(this.deleteCustomerDialog).toBeVisible();
    await expect(this.deleteCustomerDialog, 'Delete dialog names a different customer').toContainText(name);
    await this.deleteCustomerDialog.getByText('Delete', { exact: true }).click();
    await expect(this.customerDeletedToast).toBeVisible();
  }
}