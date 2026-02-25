import { expect } from '@playwright/test';
import { FILTER_TYPE } from '../constants/filterType.js';

export class ListPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;

    //Elements
    this.btnAddSession = page.getByTestId("add-session-button");
    this.btnEditSessionByTitle = (title) =>
      this.page.getByRole("button", {
        name: `Edit training session: ${title}`,
      });
    this.btnDeleteSessionByTitle = (title) =>
      this.page.getByRole("button", {
        name: `Delete training session: ${title}`,
      });

    this.btnConfirmDelete = page.getByRole("button", {
      name: "Yes, proceed to final confirmation",
    });
    this.btnDeletePermanently = page.getByRole("button", {
      name: "Yes, delete this training session permanently",
    });

    //Pak het juiste <li> op basis van de title-button in die row
    this.sessionsList = page.getByTestId("sessions-list");
    this.sessionItems = this.sessionsList.locator('[data-testid^="session-item-"]');

    //this.getSessionItemByTitle(title) = title => this.sessionsList.getByRole('listitem').filter({ has: this.page.getByRole('button', { name: title, exact: true }), }).first();

    this.txtTitle = this.page.locator('[data-testid^="edit-session-"]');
    this.txtStatus = this.page.locator('[data-testid^="status-badge-"]');
    this.txtDescription = this.page.locator('p.session-description');
    this.txtDuration = this.page.locator('p.session-duration');
    this.txtFilterSummary = this.page.locator('p.filter-summary');
    

    this.filterTitle = this.page.getByTestId("filter-title");
    this.filterDuration = this.page.getByTestId("filter-duration");
    this.filterStatus = this.page.getByTestId("filter-status");
    this.btnClearFilters = this.page.getByTestId("clear-filters");
  }

  // =====================================
  // Helper methods 
  // =====================================

  sessionTitleIn = (item) => item.locator('[data-testid^="edit-session-"]');
  sessionStatusIn = (item) => item.locator('[data-testid^="status-badge-"]');
  sessionDescriptionIn = (item) => item.locator('p.session-description');
  sessionDurationIn = (item) => item.locator('p.session-duration');



  //Actions
  getSessionItemByTitle(title) {
    return this.sessionsList
      .getByRole("listitem")
      .filter({
        has: this.btnEditSessionByTitle(title),
      })
      .first();
  }

  async assertSessionData(data) {
    //Get the right block based on title
    const item = this.getSessionItemByTitle(data.title);
    await expect(
      item.getByRole("button", {
        name: `Edit training session: ${data.title}`,
        exact: true,
      }),
    ).toBeVisible();

    await expect(item.locator("button.title-edit-button")).toHaveText(data.title);
    await expect(item.locator(".session-description")).toHaveText(data.description);
    await expect(item.getByRole("status")).toHaveText(data.status);
    await expect(item.locator(".session-duration")).toHaveText(`Duration: ${data.durationHours} hours`);
  }

  async clickAddSessionButton() {
    await this.btnAddSession.click();
  }

  async editSessionByClickOnTitle(title) {
    await this.btnEditSessionByTitle(title).click();
  }

  async deleteSessionByClickOnTrashIcon(title) {
    await this.btnDeleteSessionByTitle(title).click();
  }

  async confirmDelete() {
    await this.btnConfirmDelete.click();
  }

  async deletePermanently() {
    await expect(this.btnDeletePermanently).toBeVisible();
    await expect(this.btnDeletePermanently).toBeEnabled();
    await this.btnDeletePermanently.click();
  }

  async expectSessionNotPresent(title) {
    await expect(this.btnEditSessionByTitle(title)).toHaveCount(0);
  }

  async expectFilterSummaryVisibleAndContainsText(expectedText) {
    await expect(this.txtFilterSummary).toBeVisible();
    await expect(this.txtFilterSummary).toContainText(expectedText);
  }

  async getAllVisibleSessions() {
  // Wacht even tot er minstens 1 item is (of 0 als lijst leeg kan zijn)
  await this.sessionItems.first().waitFor({ state: 'visible' });

  return await this.sessionItems.evaluateAll((items) => {
    const parseHours = (durationText) => {
      const match = durationText?.match(/Duration:\s*([\d.]+)\s*hours?/i);
      return match ? Number(match[1]) : null;
    };

    return items.map((item) => {
      
      const title = item.querySelector('[data-testid^="edit-session-"]')?.textContent?.trim() ?? null;
      const description = item.querySelector('p.session-description')?.textContent?.trim() ?? null;
      const status = item.querySelector('[data-testid^="status-badge-"]')?.textContent?.trim() ?? null;
      const durationText = item.querySelector('p.session-duration')?.textContent?.trim() ?? null;
      const durationHours = durationText ? parseHours(durationText) : null;

      return { title, description, status, durationText, durationHours };
    });
  });
}


expectAllVisibleSessionsMatchFilters(sessions, filters) {
  const matchers = {
    [FILTER_TYPE.TITLE]: (s, value) => s.title?.trim().toLowerCase().includes(value.trim().toLowerCase()),
    [FILTER_TYPE.DURATION]: (s, value) => s.durationHours === Number.parseFloat(value),
    [FILTER_TYPE.STATUS]: (s, value) => s.status === value,
  };

  for (const { filterType, value } of filters) {
    const matcher = matchers[filterType];

    if (!matcher) { throw new Error(`Unknown filterType: ${filterType}`);}
    
    const allMatch = sessions.every(session => matcher(session, value));

    expect(allMatch).toBeTruthy();
  }
}


  async filterByTitle(titleText) {
    await this.filterTitle.fill("");          
    await this.filterTitle.fill(titleText); 
  }

  async filterByDuration(durationText) {
    await this.filterDuration.fill("");
    await this.filterDuration.fill(durationText);
  }

  async filterByStatus(statusLabel) {
    await this.filterStatus.selectOption({ label: statusLabel });
  }

  async clearFilters() {
    await this.btnClearFilters.click();
  }

  async buildExpectedSessionsSummaryText(page, { shown, total, filters = [] }) {
    let expected = `Showing ${shown} of ${total} sessions`;

    for (const { filterType, value } of filters) {
      expected += ` matching ${filterType} "${value}"`;
    }

    return expected;
  }

  async getActualSessionsSummaryText() {
    return await this.txtFilterSummary.innerText();
  }

}