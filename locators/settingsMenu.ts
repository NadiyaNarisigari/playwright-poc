import type { Page } from '@playwright/test';

// Settings menu in the top-right corner
export const settingsMenuLocators = {
  buttons: {
    settings: (page: Page) => page.getByRole('button', { name: 'settings Settings' }),
  },

  labels: {
    // Shows the user's role, e.g. "Administrator"
    role: (page: Page) => page.locator('.toolbar-profile.roles'),
  },

  menuItems: {
    fleetManagement: (page: Page) => page.getByRole('menuitem', { name: 'Fleet Management' }),
  },
};