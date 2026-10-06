import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { dashboardLocators as L } from '../locators/dashboard';

// The dashboard shown after login
export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = L.messages.welcome(page);
  }
}