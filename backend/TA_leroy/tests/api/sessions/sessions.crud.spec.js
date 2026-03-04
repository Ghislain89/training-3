import { expect } from '@playwright/test';
import { test } from '../../fixtures/api-fixture';
import { sessionData } from '../utils/testData';
import { expectOk, expectCreated, expectNotFound } from '../utils/assertions';

test.describe('Sessions API – CRUD & validation', () => {
  test('full CRUD flow', async ({ api }) => {

    // list
    const listRes = await api.get('/api/sessions');
    expectOk(listRes);
    const initial = await listRes.json();
    expect(Array.isArray(initial)).toBe(true); //api geeft een lijst terug

    // create
    const createRes = await api.post('/api/sessions', sessionData.valid);
    console.log('Created session:', createRes);
    const created = await createRes.json();
    const id = created.id;
    expectCreated(createRes);

    // get
    const getRes = await api.get(`/api/sessions/${id}`);
    expectOk(getRes);

    // update
    const updateRes = await api.put(`/api/sessions/${id}`, sessionData.updated);
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
