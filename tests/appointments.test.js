import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.js';
import { bookAppointment, cancelAppointment, findAvailableSlots } from '../src/appointments.js';

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
