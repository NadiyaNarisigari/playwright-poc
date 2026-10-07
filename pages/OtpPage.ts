import { Page, expect } from '@playwright/test';
import { otpLocators as L } from '../locators/otp';

// Waits for a person to type the 6-digit SMS code, then clicks Submit
export const submitOtpWhenEnteredManually = async (page: Page, timeoutMs = 120_000) => {
  await expect(L.fields.digit(page, 6)).toHaveValue(/^\d$/, { timeout: timeoutMs });
  for (let i = 1; i <= 6; i++) {
    await expect(L.fields.digit(page, i)).toHaveValue(/^\d$/, { timeout: 5_000 });
  }
  await L.buttons.submit(page).click();
};