import type { Page } from '@playwright/test';

// OTP screen: six digit boxes and a Submit button
export const otpLocators = {
  fields: {
    // One box per digit, numbered 1 to 6
    digit: (page: Page, digitNumber: number) =>
      page.getByRole('textbox', { name: `Digit ${digitNumber} of` }),
  },

  buttons: {
    submit: (page: Page) => page.getByRole('button', { name: 'Submit' }),
  },
};