import type { Page } from '@playwright/test';

// "Add New Factory" form
export const addFactoryLocators = {
  form: {
    title: (page: Page) => page.getByText('Add New Factory'),
  },

  fields: {
    name: (page: Page) => page.getByRole('textbox', { name: 'companyName' }),
  },

  address: {
    country: (page: Page) => page.getByRole('combobox', { name: 'companyCountry' }),
    state: (page: Page) => page.getByRole('combobox', { name: 'companyState' }),
    city: (page: Page) => page.getByRole('combobox', { name: 'companyCity' }),
    street: (page: Page) => page.getByRole('textbox', { name: 'companyStreet1' }),
    // Assumed to match the customer form's ZIP field; confirm when running add-factory
    zipCode: (page: Page) => page.getByPlaceholder('Enter ZIP code'),
  },

  buttons: {
    cancel: (page: Page) => page.getByRole('button', { name: 'Cancel' }),
    add: (page: Page) => page.getByRole('button', { name: 'Add', exact: true }),
  },
};