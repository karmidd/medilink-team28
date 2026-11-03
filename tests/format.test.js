import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.js';
import { formatAppointmentTime } from '../src/format.js';

const { clinics } = createStore();
const montreal = clinics.find((c) => c.id === 'c1'); // America/Toronto
const halifax = clinics.find((c) => c.id === 'c2'); // America/Halifax

// Daylight saving time ended on Nov 1, 2026, so Nov 10 is EST / AST.

test('formats a Montreal appointment in Eastern time', () => {
  // Slot s1: 14:00 UTC is 9:00 a.m. EST.
  assert.equal(formatAppointmentTime('2026-11-10T14:00:00Z', montreal), 'Nov 10, 2026, 9:00 a.m. EST');
});

test('formats a Halifax appointment in Atlantic time, not Eastern (#4)', () => {
  // Slot s4: 13:00 UTC is 9:00 a.m. AST. Before the fix this showed 8:00 a.m.
  assert.equal(formatAppointmentTime('2026-11-10T13:00:00Z', halifax), 'Nov 10, 2026, 9:00 a.m. AST');
});

test('uses daylight time before Nov 1', () => {
  assert.equal(formatAppointmentTime('2026-10-20T13:00:00Z', halifax), 'Oct 20, 2026, 10:00 a.m. ADT');
  assert.equal(formatAppointmentTime('2026-10-20T13:00:00Z', montreal), 'Oct 20, 2026, 9:00 a.m. EDT');
});

test('refuses to format without the clinic, so no caller can fall back to one time zone', () => {
  assert.throws(() => formatAppointmentTime('2026-11-10T13:00:00Z'), /needs the clinic/);
});
