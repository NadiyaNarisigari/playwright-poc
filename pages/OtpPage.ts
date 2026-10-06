import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { otpLocators as L } from '../locators/otp';

// Actions on the OTP screen
export class OtpPage extends BasePage {
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = L.buttons.submit(page);
  }

  private digitInput(digitNumber: number): Locator {
    return L.fields.digit(this.page, digitNumber);
  }

  // Types a 6-digit code (the code is never put in error messages, they end up in reports)
  async fillOtp(code: string) {
    if (!/^\d{6}$/.test(code)) {
      throw new Error(`OTP must be exactly 6 digits, received ${code.length} characters`);
    }
    for (let i = 0; i < 6; i++) {
      await this.digitInput(i + 1).fill(code[i]);
    }
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async submitOtp(code: string) {
    await this.fillOtp(code);
    await this.clickSubmit();
  }

  // Waits for a person to type the SMS code, then clicks Submit
  async submitWhenOtpEnteredManually(timeoutMs = 120_000) {
    await expect(this.digitInput(6)).toHaveValue(/^\d$/, { timeout: timeoutMs });
    for (let i = 1; i <= 6; i++) {
      await expect(this.digitInput(i)).toHaveValue(/^\d$/, { timeout: 5_000 });
    }
    await this.clickSubmit();
  }
}