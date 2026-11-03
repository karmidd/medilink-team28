import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.js';
import { bookAppointment, cancelAppointment } from '../src/appointments.js';
import { queueReminders, sendDueReminders } from '../src/reminders.js';

// Slot s1 starts 2026-11-10T14:00Z.
const DAY_BEFORE = new Date('2026-11-09T16:00:00Z');
const THREE_HOURS_BEFORE = new Date('2026-11-10T11:00:00Z');

test('a reminder is queued for an appointment in the next 24 hours', () => {
  const store = createStore();
  bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  queueReminders(store, DAY_BEFORE);

  assert.equal(store.reminderQueue.length, 1);
  assert.equal(store.reminderQueue[0].sendAt, '2026-11-10T11:00:00.000Z');
});

test('queueing twice does not create a second reminder', () => {
  const store = createStore();
  bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  queueReminders(store, DAY_BEFORE);
  queueReminders(store, DAY_BEFORE);

  assert.equal(store.reminderQueue.length, 1);
});

test('no reminder is queued for an appointment cancelled before queueing', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  cancelAppointment(store, appointment.id);
  queueReminders(store, DAY_BEFORE);

  assert.equal(store.reminderQueue.length, 0);
});

test('due reminders are sent once', () => {
  const store = createStore();
  bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  queueReminders(store, DAY_BEFORE);

  const sent = [];
  sendDueReminders(store, (r) => sent.push(r), THREE_HOURS_BEFORE);
  sendDueReminders(store, (r) => sent.push(r), THREE_HOURS_BEFORE);

  assert.equal(sent.length, 1);
  assert.equal(sent[0].patientId, 'p1');
});
