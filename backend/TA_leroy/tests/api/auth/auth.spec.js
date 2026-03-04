import { expect } from '@playwright/test';
import { test } from '../../fixtures/api-fixture';
import { randomUser, createUser } from '../utils/testData';
import { expectOk, expectCreated, expectNotFound } from '../utils/assertions';

test.describe('Auth API', () => {

  test('create account', async ({ api }) => {
    const { username, password } = randomUser();

    const res = await api.post('/api/create-account', { username, password });
    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test('login success', async ({ api }) => {
    const { username, password } = await createUser(api);

    const res = await api.post('/api/login', { username, password });
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.token).toBe('string');
  });

  test('login failure with wrong password', async ({ api }) => {
    const { username } = await createUser(api);

    const res = await api.post('/api/login', { username, password: 'wrong' });
    const body = await res.json();
    expect(res.status()).toBe(401);
    expect(body.success).toBe(false);
  });

  test('forgot password returns new password', async ({ api }) => {
    const { username } = await createUser(api);

    const res = await api.post('/api/forgot-password', { username });
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.newPassword).toBe('string');
  });

  test('full auth flow (create → login → forgot-password --> login)', async ({ api }) => {
    const { username, password } = randomUser();

    // create
    const createRes = await api.post('/api/create-account', { username, password });
    expect(createRes.status()).toBe(201);

    // login
    const loginRes = await api.post('/api/login', { username, password });
    expect(loginRes.ok()).toBeTruthy();

    // forgot-password
    const forgotRes = await api.post('/api/forgot-password', { username });
    expect(forgotRes.ok()).toBeTruthy();

    const forgotJsonBody = await forgotRes.json();
    const newPassword = forgotJsonBody.newPassword;
    expect(typeof newPassword).toBe('string');

    // login with new password
    const loginNewRes = await api.post('/api/login', { username, password: newPassword }); 
    expect(loginNewRes.ok()).toBeTruthy();

  });

});
