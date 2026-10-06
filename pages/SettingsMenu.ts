import { Page, Locator } from '@playwright/test';
import { settingsMenuLocators as L } from '../locators/settingsMenu';

// The Settings menu in the top-right corner
export class SettingsMenu {
  readonly settingsButton: Locator;
  readonly roleLabel: Locator;
  readonly fleetManagementItem: Locator;

  constructor(page: Page) {
    this.settingsButton = L.buttons.settings(page);
    this.roleLabel = L.labels.role(page);
    this.fleetManagementItem = L.menuItems.fleetManagement(page);
  }

  async open() {
    await this.settingsButton.click();
  }

  async openFleetManagement() {
    await this.open();
    await this.fleetManagementItem.click();
  }
}