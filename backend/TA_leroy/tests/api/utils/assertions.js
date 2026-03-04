import { expect } from '@playwright/test';

export const expectOk = (res) => expect(res.ok()).toBeTruthy();
export const expectCreated = (res) => expect(res.status()).toBe(201);
export const expectNotFound = (res) => expect(res.status()).toBe(404);
export const expectUnauthorized = (res) => expect(res.status()).toBe(401);
export const expectBadRequest = (res) => expect(res.status()).toBe(400);
export const expectSuccess = (res) => {
  expect(res.ok()).toBeTruthy();
  return res.json();
};
