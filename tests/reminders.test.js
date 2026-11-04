import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.js';
import { bookAppointment, cancelAppointment, rescheduleAppointment } from '../src/appointments.js';
import { queueReminders, sendDueReminders, setReminderChannel } from '../src/reminders.js';

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

test('rescheduling replaces a queued reminder with one for the new time', () => {
  const store = createStore();
  setReminderChannel(store, 'p1', 'sms');
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's2' });
  const exactlyADayBefore = new Date('2026-11-09T15:00:00Z');
  queueReminders(store, exactlyADayBefore);
  const oldReminder = store.reminderQueue[0];

  rescheduleAppointment(store, appointment.id, 's1', exactlyADayBefore);

  assert.equal(store.reminderQueue.length, 1);
  assert.notStrictEqual(store.reminderQueue[0], oldReminder);
  assert.equal(store.reminderQueue[0].appointmentId, appointment.id);
  assert.equal(store.reminderQueue[0].channel, 'sms');
  assert.equal(store.reminderQueue[0].sendAt, '2026-11-10T11:00:00.000Z');
});

test('rescheduling does not queue a reminder when the patient chose none', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's2' });
  const exactlyADayBefore = new Date('2026-11-09T15:00:00Z');
  queueReminders(store, exactlyADayBefore);
  setReminderChannel(store, 'p1', 'none');

  rescheduleAppointment(store, appointment.id, 's1', exactlyADayBefore);

  assert.equal(store.reminderQueue.length, 0);
});

test('rescheduling beyond the queue window invalidates the old reminder and queues the new one later', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  const exactlyADayBeforeOriginal = new Date('2026-11-09T14:00:00Z');
  queueReminders(store, exactlyADayBeforeOriginal);

  rescheduleAppointment(store, appointment.id, 's3', exactlyADayBeforeOriginal);

  assert.equal(store.reminderQueue.length, 0);

  queueReminders(store, new Date('2026-11-10T13:30:00Z'));
  assert.equal(store.reminderQueue.length, 1);
  assert.equal(store.reminderQueue[0].appointmentId, appointment.id);
  assert.equal(store.reminderQueue[0].sendAt, '2026-11-11T10:30:00.000Z');
});
