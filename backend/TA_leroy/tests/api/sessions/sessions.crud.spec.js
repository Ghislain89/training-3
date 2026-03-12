import { test as base, expect } from '@playwright/test';
import { apiFixture } from '../../fixtures/api-fixture';

import { createSessionData } from '../utils/testData';
import { expectOk, expectCreated, expectNotFound } from '../utils/assertions';
import { createSession, getSession, updateSession, deleteSession } from '../utils/apiHelpers';

const test = base.extend(apiFixture);

test.describe('Sessions API – CRUD & validation', () => {

  test('full CRUD flow', async ({ api }) => {

    // list
    const listRes = await api.get('/api/sessions');
    expectOk(listRes);
    const initial = await listRes.json();
    expect(Array.isArray(initial)).toBe(true);

    // create
    const payload = createSessionData();
    console.log('Request body:', payload);

    const res = await api.post('/api/sessions', payload);
    expectCreated(res);

    const body = await res.json();
    console.log('Response body:', body);

    const id = body.id;

    // get
    const getRes = await api.get(`/api/sessions/${id}`);
    expectOk(getRes);

    // update
    const updateRes = await updateSession(api, id, {
      title: "updated-title"
    });
    expectOk(updateRes);

    // delete
    const deleteRes = await api.delete(`/api/sessions/${id}`);
    expectOk(deleteRes);

    // verify 404
    const get404 = await api.get(`/api/sessions/${id}`);
    expectNotFound(get404);
  });

  // ---------------------------------------------------------
  // GET /sessions/:id
  // ---------------------------------------------------------

  test('GET /sessions/:id returns 404 for non-existing id', async ({ api }) => {
    const res = await api.get('/api/sessions/999999');
    expectNotFound(res);
  });

  test('GET /sessions/:id rejects invalid id type', async ({ api }) => {
    const res = await api.get('/api/sessions/abc');
    expectNotFound(res);
  });
});
