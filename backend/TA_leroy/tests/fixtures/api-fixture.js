import { ApiClient } from '../api/utils/apiClient';

export const apiFixture = {
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

