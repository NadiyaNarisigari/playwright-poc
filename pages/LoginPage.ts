import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { loginLocators as L } from '../locators/login';

// Actions on the login screen
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = L.fields.email(page);
    this.passwordInput = L.fields.password(page);
    this.loginButton = L.buttons.login(page);
    this.errorMessage = L.messages.error(page);
  }

  async navigateToLogin() {
    await this.goto('/login');
  }

  // Types like a user and leaves the field, so the form validates it
  async fillEmail(email: string) {
    await this.emailInput.click();
    await this.emailInput.pressSequentially(email);
    await this.emailInput.blur();
  }

  async fillPassword(password: string) {
    await this.passwordInput.click();
    await this.passwordInput.pressSequentially(password);
    await this.passwordInput.blur();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}