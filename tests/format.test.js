import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatAppointmentTime } from '../src/format.js';

test('formats a Montreal appointment in local time', () => {
  // 14:00 UTC on Nov 10, 2026 is 9:00 a.m. in Montreal (EST, after daylight saving ended Nov 1).
  assert.match(formatAppointmentTime('2026-11-10T14:00:00Z'), /9:00/);
});
