import { ApiClient } from '../api/utils/apiClient';

export const apiFixture = {
  // REVIEW 🟢 LOW (TypeScript): No type annotations on fixture params. Add JSDoc for better IDE support:
  // /** @param {{ request: import('@playwright/test').APIRequestContext, baseURL: string }} ctx */
  api: async ({ request, baseURL }, use) => {
    const client = new ApiClient(request, baseURL);
    await use(client);
  },

  requestContext: async ({ playwright, baseURL }, use) => {
    const ctx = await playwright.request.newContext({ baseURL });
    await use(ctx);
    await ctx.dispose();
  }
};

