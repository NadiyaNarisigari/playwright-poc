import type { Page } from '@playwright/test';
import { escapeRegExp } from '../utils/regex';

// "Add New Customer" form
export const addCustomerLocators = {
  form: {
    // Button that opens the form, and the form title
    openButton: (page: Page) => page.getByRole('button', { name: 'Add New Customer' }),
    title: (page: Page) => page.getByRole('dialog').getByText('Add New Customer', { exact: true }),
  },

  fields: {
    name: (page: Page) => page.getByPlaceholder('Enter Customer name'),
  },

  csm: {
    // The dropdown in the form without "Select Country/State/City" text
    dropdown: (page: Page) =>
      page
        .getByRole('dialog')
        .getByRole('combobox')
        .filter({ hasNotText: /Select (Country|State|City)/ })
        .first(),
    searchInput: (page: Page) => page.getByPlaceholder('Search Customer Success Manager(CSM)'),
    // Row whose text is exactly the email (any upper/lower case)
    result: (page: Page, email: string) =>
      page.getByText(new RegExp(`^\\s*${escapeRegExp(email)}\\s*$`, 'i')).first(),
  },

  address: {
    country: (page: Page) => page.getByRole('combobox', { name: 'companyCountry' }),
    state: (page: Page) => page.getByRole('combobox', { name: 'companyState' }),
    city: (page: Page) => page.getByRole('combobox', { name: 'companyCity' }),
    street: (page: Page) => page.getByPlaceholder('Enter Street name'),
    zipCode: (page: Page) => page.getByPlaceholder('Enter ZIP code'),
  },

  buttons: {
    cancel: (page: Page) => page.getByRole('button', { name: 'Cancel' }),
    add: (page: Page) => page.getByRole('button', { name: 'Add', exact: true }),
  },

  messages: {
    // Shown after adding: Customer "<name>" has been ...
    created: (page: Page, name: string) => page.getByText(`Customer "${name}"`),
  },
};