import { Page, Locator } from '@playwright/test';

/** The Settings menu in the top-right corner (profile card, role, navigation items). */
export class SettingsMenu {
  readonly settingsButton: Locator;
  readonly roleLabel: Locator;
  readonly fleetManagementItem: Locator;

  constructor(page: Page) {
    this.settingsButton = page.getByRole('button', { name: 'settings Settings' });
    this.roleLabel = page.locator('.toolbar-profile.roles');
    this.fleetManagementItem = page.getByRole('menuitem', { name: 'Fleet Management' });
  }

  async open() {
    await this.settingsButton.click();
  }

  async openFleetManagement() {
    await this.open();
    await this.fleetManagementItem.click();
  }
}