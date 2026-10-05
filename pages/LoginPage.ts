import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByText('Incorrect username or password.');
  }

  async navigateToLogin() {
    await this.goto('/login');
  }

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