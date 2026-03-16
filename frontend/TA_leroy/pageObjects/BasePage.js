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

  // REVIEW 🟡 MEDIUM (Playwright — Architecture): Assertions (expect) belong in spec files, not page objects.
  // Page objects define HOW to interact (locators + actions), specs define WHAT to verify.
  // Public locators are fine in Playwright — they ARE the abstraction (specs don't see raw selectors).
  // Compound actions like `login(user, pass)` and parameterized locators like `getItemByTitle(title)` belong here as methods.
  // But thin wrappers like `assertPageTitle(t)` that just call `expect(this.pageTitle).toHaveText(t)` add indirection without value.
  // FIX: Remove assertion methods. Use the public locators directly in specs: `await expect(basePage.pageTitle).toHaveText(...)`
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