import { test, expect } from '../../fixtures/api-fixture';

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
