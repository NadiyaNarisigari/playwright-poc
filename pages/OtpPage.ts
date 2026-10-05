import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OtpPage extends BasePage {
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  private otpDigitInput(digitNumber: number): Locator {
    return this.page.getByRole('textbox', { name: `Digit ${digitNumber} of` });
  }

  async fillOtp(code: string) {
    if (!/^\d{6}$/.test(code)) {
      // Do not include the code itself in the message; errors end up in reports.
      throw new Error(`OTP must be exactly 6 digits, received ${code.length} characters`);
    }

    for (let i = 0; i < 6; i++) {
      await this.otpDigitInput(i + 1).fill(code[i]);
    }
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async submitOtp(code: string) {
    await this.fillOtp(code);
    await this.clickSubmit();
  }

  // Waits for the user to type the SMS code by hand, then submits automatically.
  async submitWhenOtpEnteredManually(timeoutMs = 120_000) {
    // Wait for the last box first: this is the long wait while the user types.
    await expect(this.otpDigitInput(6)).toHaveValue(/^\d$/, { timeout: timeoutMs });

    // Then confirm every box holds a digit (e.g. the user didn't skip one).
    for (let i = 1; i <= 6; i++) {
      await expect(this.otpDigitInput(i)).toHaveValue(/^\d$/, { timeout: 5_000 });
    }

    await this.clickSubmit();
  }
}