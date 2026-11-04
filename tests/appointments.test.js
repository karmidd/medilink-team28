import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.js';
import {
  bookAppointment,
  cancelAppointment,
  findAvailableSlots,
  rescheduleAppointment,
} from '../src/appointments.js';

const MORE_THAN_A_DAY_BEFORE = new Date('2026-11-09T13:00:00Z');

test('booking a slot removes it from the available slots', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });

  assert.equal(appointment.status, 'booked');
  assert.equal(appointment.clinicId, 'c1');
  assert.ok(!findAvailableSlots(store, 'c1').some((s) => s.id === 's1'));
});

test('cancelling an appointment frees its slot', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  cancelAppointment(store, appointment.id);

  assert.equal(appointment.status, 'cancelled');
  assert.ok(findAvailableSlots(store, 'c1').some((s) => s.id === 's1'));
});

test('booking an unknown slot is refused', () => {
  const store = createStore();
  assert.throws(() => bookAppointment(store, { patientId: 'p1', slotId: 'nope' }), /Unknown slot/);
});

test('booking an already booked slot is refused', () => {
  const store = createStore();
  bookAppointment(store, { patientId: 'p1', slotId: 's1' });

  assert.throws(
    () => bookAppointment(store, { patientId: 'p2', slotId: 's1' }),
    { message: 'Slot no longer available' },
  );
});

test('rescheduling moves a booked appointment and preserves its ID', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });

  const rescheduled = rescheduleAppointment(store, appointment.id, 's2', MORE_THAN_A_DAY_BEFORE);

  assert.equal(rescheduled.id, appointment.id);
  assert.equal(rescheduled.slotId, 's2');
  assert.equal(rescheduled.start, '2026-11-10T15:00:00Z');
  assert.ok(findAvailableSlots(store, 'c1').some((slot) => slot.id === 's1'));
  assert.ok(!findAvailableSlots(store, 'c1').some((slot) => slot.id === 's2'));
});

test('rescheduling to an occupied slot is refused', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  bookAppointment(store, { patientId: 'p2', slotId: 's2' });

  assert.throws(
    () => rescheduleAppointment(store, appointment.id, 's2', MORE_THAN_A_DAY_BEFORE),
    { message: 'Slot no longer available' },
  );
  assert.equal(appointment.slotId, 's1');
});

test('rescheduling to a slot at another clinic is refused', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });

  assert.throws(
    () => rescheduleAppointment(store, appointment.id, 's4', MORE_THAN_A_DAY_BEFORE),
    /same clinic/i,
  );
  assert.equal(appointment.slotId, 's1');
});

test('online rescheduling less than 24 hours before the appointment is refused', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  const lessThanADayBefore = new Date('2026-11-09T14:00:01Z');

  assert.throws(
    () => rescheduleAppointment(store, appointment.id, 's2', lessThanADayBefore),
    /call the clinic/i,
  );
  assert.equal(appointment.slotId, 's1');
});

test('online rescheduling exactly 24 hours before the appointment is allowed', () => {
  const store = createStore();
  const appointment = bookAppointment(store, { patientId: 'p1', slotId: 's1' });
  const exactlyADayBefore = new Date('2026-11-09T14:00:00Z');

  rescheduleAppointment(store, appointment.id, 's2', exactlyADayBefore);

  assert.equal(appointment.slotId, 's2');
});
