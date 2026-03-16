import { expect } from "@playwright/test";

// REVIEW 🟢 LOW (Playwright): Hardcoded backend URL will break if the port changes (e.g. in CI).
// FIX: const HEALTH_URL = `${process.env.BACKEND_URL || 'http://localhost:3001'}/health`;
const HEALTH_URL = "http://localhost:3001/health";


export class HealthPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;

    //Elements
    this.statusText = page.getByTestId("status-text"); //GG Ik  hou niet van data-test-ids (meer :D)
    this.healthError = page.getByTestId("health-error");
    this.healthErrorText = page.locator('[data-testid="health-error"] .error-text');
    this.lastChecked = page.getByTestId("last-checked");
  }

  //Actions
  async goToHealthPage() {
    await this.page.goto("/health");
  }

  async mockBackendOnline() {
    await this.page.route(HEALTH_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          status: "OK",
          message: "Training Sessions API is running",
        }),
      });
    });
  }

  async mockBackendOffline() {
    await this.page.route(HEALTH_URL, async (route) => {
      // Simuleert echte "backend is down" (geen response, geen headers/body)
      await route.abort("connectionrefused"); // of: 'failed'
    });
  }

  async mockBackendChecking() {
    await this.page.route(HEALTH_URL, async () => {
      // Doe expres niets → request blijft pending
      return new Promise(() => {});
    });
  }

  // REVIEW 🟡 MEDIUM (Playwright — Architecture): Page objects should only contain locators and actions.
  // All assert/expect methods below (assertStatus, assertBackendOfflineErrorTextVisible, assertHealthErrorText, etc.)
  // should live in the spec files. Page objects answer "how do I interact with this page?", specs answer "what do I expect?".
  // FIX: Expose locators or getter methods (e.g. `getStatusText()`) and move assertions to specs.
  async assertStatus(state) {
    const expectedTextMap = {
      online: "Backend is Online",
      offline: "Backend is Offline",
      checking: "Checking Backend Status...",
    };

    await expect(this.statusText).toHaveText(expectedTextMap[state]);
  }


  //GG: Ik zou deze assertions verplaatsen naar naar de specs.
  async assertBackendOfflineErrorTextVisible() {
    await expect(this.healthError).toBeVisible();
  }

  async assertBackendOfflineErrorTextNotVisible() {
    await expect(this.healthError).toHaveCount(0);
  }

  async assertHealthErrorText(expectedText) {
    await expect(this.healthErrorText).toHaveText(expectedText);
  }

  async assertLastCheckedVisible() {
    await expect(this.lastChecked).toBeVisible();
  }

  async assertLastCheckedFormat() {
    await expect(this.lastChecked).toHaveText(
      /^Last checked:\s\d{1,2}:\d{2}:\d{2}(?:\s?(?:AM|PM))?$/i, //"Last checked: H:MM:SS am" óf bijv. "Last checked: HH:MM:SSPM"
    );
  }

  async assertLastCheckedUpdates(timeoutMs = 7000) {
    const first = await this.lastChecked.textContent();

    await expect(this.lastChecked).not.toHaveText(first, {
      timeout: timeoutMs,
    });
  }
}
