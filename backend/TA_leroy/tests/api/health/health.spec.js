import { test as base, expect } from '@playwright/test';
import { apiFixture } from '../../fixtures/api-fixture';

const test = base.extend(apiFixture);

test.describe('Health API', () => {
  
test('should return OK on GET /health', async ({ requestContext }) => {
    const response = await requestContext.get('/health');
    await expect(response).toBeOK();

    const json = await response.json();
    expect(json).toEqual({
        status: 'OK',
        message: 'Training Sessions API is running'
    });
});

//Mocks waarin backend uit staat of laadt, staan in de FE tests.




  
});
