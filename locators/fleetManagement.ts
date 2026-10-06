import type { Page } from '@playwright/test';
import { escapeRegExp } from '../utils/regex';

// Fleet Management page: Factory and Customer tabs
export const fleetManagementLocators = {
  tabs: {
    factory: (page: Page) => page.getByText('Factory', { exact: true }),
    customer: (page: Page) => page.getByText('Customer', { exact: true }),
  },

  // Any option in an open dropdown list
  common: {
    anyOption: (page: Page) => page.getByRole('option'),
  },

  factory: {
    dropdown: (page: Page) => page.getByRole('combobox').first(),
    // Position based: 1st "more_vert" = toolbar menu, 2nd = menu of the selected factory row
    toolbarMenu: (page: Page) => page.getByText('more_vert').first(),
    rowMenu: (page: Page) => page.getByText('more_vert').nth(1),
    addMenuItem: (page: Page) => page.getByRole('menuitem', { name: 'Add Factory' }),
    optionsStartingWith: (page: Page, prefix: string) =>
      page.getByRole('option', { name: new RegExp(`^${escapeRegExp(prefix)}`) }),
  },

  factoryDelete: {
    menuItem: (page: Page) => page.getByRole('menuitem', { name: 'Delete' }),
    confirmText: (page: Page, prefix: string) =>
      page.getByText(new RegExp(`delete ${escapeRegExp(prefix)}`)),
    confirmButton: (page: Page) => page.getByRole('button', { name: 'Yes, Delete' }),
    deletedToast: (page: Page) => page.getByText('Factory deleted successfully'),
  },

  customer: {
    dropdown: (page: Page) => page.locator('mat-select[panelclass="customer-select-panel"]'),
    list: (page: Page) => page.getByRole('listbox'),
    searchInput: (page: Page) => page.getByPlaceholder('Search Customer', { exact: true }),
    // Row on the right; the name must stand on its own (not inside quotes)
    row: (page: Page, name: string) =>
      page.getByText(new RegExp(`(^|\\s)${escapeRegExp(name)}(\\s|$)`)).first(),
  },

  customerDelete: {
    // Trash icon, only visible while hovering over the customer row
    icon: (page: Page) => page.locator('[aria-label="Delete customer"]').first(),
    dialog: (page: Page) => page.getByRole('dialog').filter({ hasText: 'Delete Customer' }),
    deletedToast: (page: Page) => page.getByText('Customer deleted successfully'),
  },
};