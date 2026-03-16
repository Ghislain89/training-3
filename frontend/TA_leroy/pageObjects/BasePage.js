import { expect } from '@playwright/test';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;

    //Elements
    this.pageTitle = page.locator("h1.page-title");
  }

  // REVIEW 🟡 MEDIUM (Playwright — Architecture): Page objects should only contain locators and actions (click, fill, navigate).
  // Assertions (expect) belong in the spec files — they define WHAT we're testing, while page objects define HOW we interact.
  // This separation makes page objects reusable and keeps test intent readable in the specs.
  // FIX: Move `assertUrlEndsWith`, `assertPageTitle` to the spec files, or return values and let specs assert.
  //Actions
  async assertUrlEndsWith(pathSegment) {
    const regex = new RegExp(`/${pathSegment}(\\?.*)?$`); //list?page=1 is hiermee ook goed
    await expect(this.page).toHaveURL(regex);
  }

  async assertPageTitle(expectedTitle) {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText(expectedTitle);
  }
}