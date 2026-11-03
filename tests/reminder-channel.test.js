import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.js';
import { bookAppointment } from '../src/appointments.js';
import { queueReminders, sendDueReminders, setReminderChannel } from '../src/reminders.js';

// Slot s1 starts 2026-11-10T14:00Z.
const DAY_BEFORE = new Date('2026-11-09T16:00:00Z');
const THREE_HOURS_BEFORE = new Date('2026-11-10T11:00:00Z');

function bookAndQueue(store) {
  bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  queueReminders(store, DAY_BEFORE);
}

function sendAll(store) {
  const sent = [];
  sendDueReminders(store, (r) => sent.push(r), THREE_HOURS_BEFORE);
  return sent;
}

test('patients get email reminders by default', () => {
  const store = createStore();
  assert.equal(store.patients[0].reminderChannel, 'email');
  bookAndQueue(store);

  const sent = sendAll(store);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].channel, 'email');
});

test('a patient with no saved preference also defaults to email', () => {
  const store = createStore();
  delete store.patients[0].reminderChannel;
  bookAndQueue(store);

  assert.equal(store.reminderQueue[0].channel, 'email');
});

test('a patient who chose SMS gets the reminder by SMS', () => {
  const store = createStore();
  setReminderChannel(store, 'p1', 'sms');
  bookAndQueue(store);

  const sent = sendAll(store);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].channel, 'sms');
});

test('no reminder is queued for a patient who chose none', () => {
  const store = createStore();
  setReminderChannel(store, 'p1', 'none');
  bookAndQueue(store);

  assert.equal(store.reminderQueue.length, 0);
  assert.equal(sendAll(store).length, 0);
});

test('changing to SMS after queueing changes the reminder not sent yet', () => {
  const store = createStore();
  bookAndQueue(store);
  setReminderChannel(store, 'p1', 'sms');

  const sent = sendAll(store);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].channel, 'sms');
});

test('changing to none after queueing cancels the reminder not sent yet', () => {
  const store = createStore();
  bookAndQueue(store);
  setReminderChannel(store, 'p1', 'none');

  assert.equal(sendAll(store).length, 0);
});

test('switching back from none before the send time queues the reminder again', () => {
  const store = createStore();
  bookAndQueue(store);
  setReminderChannel(store, 'p1', 'none');
  setReminderChannel(store, 'p1', 'email');
  queueReminders(store, DAY_BEFORE); // the hourly job runs again

  const sent = sendAll(store);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].channel, 'email');
});

test('changing the preference does not touch reminders already sent', () => {
  const store = createStore();
  bookAndQueue(store);
  sendAll(store);
  setReminderChannel(store, 'p1', 'none');

  assert.equal(store.reminderQueue.length, 1);
  assert.equal(store.reminderQueue[0].sent, true);
  assert.equal(store.reminderQueue[0].channel, 'email');
});

test('an unknown channel is refused', () => {
  const store = createStore();
  assert.throws(() => setReminderChannel(store, 'p1', 'fax'), /Unknown reminder channel fax/);
  assert.equal(store.patients[0].reminderChannel, 'email');
});
