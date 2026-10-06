import { Page, Locator, expect } from '@playwright/test';

// Shared actions that every page can use
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  // Opens a dropdown and picks the option with this exact text
  protected async selectOption(dropdown: Locator, value: string) {
    await dropdown.click();
    await this.page.getByRole('option', { name: value, exact: true }).click();
  }

  // Clicks the middle of an element with the mouse.
  // Used to close an open list by clicking outside it (a normal click is blocked by the list).
  protected async clickOutsideOn(target: Locator) {
    const box = await target.boundingBox();
    if (!box) throw new Error('Element to click outside on was not found');
    await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }

  // Clicks a dropdown until its list opens (a list that is still loading can ignore the click)
  protected async openUntilVisible(dropdown: Locator, list: Locator) {
    await expect(async () => {
      await dropdown.click();
      await expect(list).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 15000 });
  }
}