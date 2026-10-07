import { Page, expect } from '@playwright/test';
import { loginLocators as L } from '../locators/login';

// Opens the login screen
export const openLoginPage = async (page: Page) => {
  await page.goto('/login');
};

// Types email and password like a user (leaving each field so the form validates it) and clicks Login
export const login = async (page: Page, email: string, password: string) => {
  await L.fields.email(page).click();
  await L.fields.email(page).pressSequentially(email);
  await L.fields.email(page).blur();

  await L.fields.password(page).click();
  await L.fields.password(page).pressSequentially(password);
  await L.fields.password(page).blur();

  await L.buttons.login(page).click();
};

// Checks the "Incorrect username or password." message is shown
export const verifyLoginError = async (page: Page) => {
  await expect(L.messages.error(page)).toBeVisible();
};