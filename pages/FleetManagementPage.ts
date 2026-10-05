import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SettingsMenu } from './SettingsMenu';

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class FleetManagementPage extends BasePage {
  readonly settingsMenu: SettingsMenu;
  readonly factoryTab: Locator;
  readonly customerTab: Locator;
  readonly factoryDropdown: Locator;
  readonly toolbarMenu: Locator;
  readonly factoryRowMenu: Locator;
  readonly addFactoryMenuItem: Locator;
  readonly deleteMenuItem: Locator;
  readonly confirmDeleteButton: Locator;
  readonly deletedToast: Locator;

  constructor(page: Page) {
    super(page);
    this.settingsMenu = new SettingsMenu(page);
    this.factoryTab = page.getByText('Factory', { exact: true });
    this.customerTab = page.getByText('Customer');
    this.factoryDropdown = page.getByRole('combobox').first();
    // Position based: the first "more_vert" is the toolbar menu, the second belongs to
    // the row of the selected factory. Revisit if the page layout changes.
    this.toolbarMenu = page.getByText('more_vert').first();
    this.factoryRowMenu = page.getByText('more_vert').nth(1);
    this.addFactoryMenuItem = page.getByRole('menuitem', { name: 'Add Factory' });
    this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
    this.deletedToast = page.getByText('Factory deleted successfully');
  }

  async openFromSettingsMenu() {
    await this.settingsMenu.openFleetManagement();
    await expect(this.page).toHaveURL(/\/group/);
  }

  /** Newly created factories only show up in the list after switching tabs. */
  async refreshFactoryList() {
    await this.customerTab.click();
    await this.factoryTab.click();
  }

  async openAddFactoryDialog() {
    await this.toolbarMenu.click();
    await this.addFactoryMenuItem.click();
  }

  /** Options in the (already opened) factory dropdown whose name starts with the prefix. */
  factoryOptionsStartingWith(prefix: string): Locator {
    return this.page.getByRole('option', { name: new RegExp(`^${escapeRegExp(prefix)}`) });
  }

  /**
   * Deletes the factory that is currently selected, but only if the confirmation dialog
   * names a factory that starts with `expectedPrefix`. This stops the test from ever
   * deleting a real factory by accident.
   */
  async deleteSelectedFactory(expectedPrefix: string) {
    await this.factoryRowMenu.click();
    await this.deleteMenuItem.click();

    await expect(
      this.page.getByText(new RegExp(`delete ${escapeRegExp(expectedPrefix)}`)),
    ).toBeVisible();
    await this.confirmDeleteButton.click();

    await expect(this.deletedToast).toBeVisible();
  }
}