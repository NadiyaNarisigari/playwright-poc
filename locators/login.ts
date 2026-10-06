import type { Page } from '@playwright/test';

// Login screen
export const loginLocators = {
  fields: {
    email: (page: Page) => page.getByRole('textbox', { name: 'Enter your email' }),
    password: (page: Page) => page.getByRole('textbox', { name: 'Enter your password' }),
  },

  buttons: {
    login: (page: Page) => page.getByRole('button', { name: 'Login' }),
  },

  messages: {
    error: (page: Page) => page.getByText('Incorrect username or password.'),
  },
};