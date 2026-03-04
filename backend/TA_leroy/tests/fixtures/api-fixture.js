import { test as base, expect } from '@playwright/test';
export { expect };
import { ApiClient } from '../api/utils/apiClient';

export const test = base.extend({
  api: async ({ request, baseURL }, use) => {
    const client = new ApiClient(request, baseURL);
    await use(client);
    console.log(">>> 1st API FIXTURE LOADED <<<");
  },
  

  // expose het echte requestContext zodat je kunt mocken
  requestContext: async ({ playwright, baseURL }, use) => {
    const ctx = await playwright.request.newContext({ baseURL });
    await use(ctx);
    await ctx.dispose();
    console.log(">>> 2nd API FIXTURE LOADED <<<");
  }
});

