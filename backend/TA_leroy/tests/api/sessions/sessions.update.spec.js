import { test as base, expect } from '@playwright/test';
import { apiFixture } from '../../fixtures/api-fixture';
import { createSessionData, generateInvalidUpdatePayloads } from '../utils/testData';
import { expectOk, expectCreated, expectBadRequest, expectNotFound } from '../utils/assertions';
// REVIEW 🔴 HIGH: `createSession`, `getSession`, `deleteSession` are not exported from apiHelpers.js. This will crash at runtime.
// FIX: import { createSessions, updateSession } from '../utils/apiHelpers';
import { createSession, createSessions, getSession, updateSession, deleteSession } from '../utils/apiHelpers';



const test = base.extend(apiFixture);

test.describe('Sessions update API', () => {
  
  test('PUT /sessions updates a session', async ({ api }) => {
      
      const results = await createSessions(api, 1, createSessionData);

      const invalidCases = generateInvalidUpdatePayloads();

      
      
      for (const c of invalidCases) {

          // REVIEW 🔴 HIGH: `c` is an object from for...of (not an index). Using it as an array index gives `undefined`.
          // FIX: const res = await updateSession(api, results.responses[0].id, c.payload);
          const res = await updateSession(api, results.responses[c].id, invalidCases[c]);

          expect(res.status()).toBe(400);

      }

    });
});

