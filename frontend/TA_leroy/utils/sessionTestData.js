import { SESSION_STATUS } from '../constants/sessionStatus.js';

export function createSessionContext(overrides = {}) {
  const timestamp = Date.now();
  const durations = ['1', '2', '3', '4', '5', '6'];

  return {
    title: `Session ${timestamp}`,
    description: `My test description (${timestamp})`,
    status: SESSION_STATUS.PENDING,
    // REVIEW 🟡 MEDIUM: `durationHours` is a string here (from ['1','2',...]) but compared as a number elsewhere
    // (ListPage.js uses parseFloat, sessions.spec.js uses ===). This causes `'2' !== 2` failures.
    // FIX: Return a number: Number(durations[...])
    durationHours: durations[Math.floor(Math.random() * durations.length)],
    ...overrides,
  };
}