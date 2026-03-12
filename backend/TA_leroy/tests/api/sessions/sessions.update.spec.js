import { test as base, expect } from '@playwright/test';
import { apiFixture } from '../../fixtures/api-fixture';
import { createSessionData, generateInvalidUpdatePayloads } from '../utils/testData';
import { expectOk, expectCreated, expectBadRequest, expectNotFound } from '../utils/assertions';
import { createSession, createSessions, getSession, updateSession, deleteSession } from '../utils/apiHelpers';



const test = base.extend(apiFixture);

test.describe('Sessions update API', () => {
  
  test('PUT /sessions updates a session', async ({ api }) => {
      
      const results = await createSessions(api, 1, createSessionData);

      const invalidCases = generateInvalidUpdatePayloads();

      
      
      for (const c of invalidCases) {

          const res = await updateSession(api, results.responses[c].id, invalidCases[c]);

          expect(res.status()).toBe(400);

      }

    });
});

