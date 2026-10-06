import type { Page } from '@playwright/test';

// Dashboard (first page after login)
export const dashboardLocators = {
  messages: {
    welcome: (page: Page) => page.getByText('Welcome to Noedra Node'),
  },
};