// Booking, cancelling and rescheduling appointments.

import { refreshAppointmentReminder } from './reminders.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function assertSlotAvailable(store, slotId, appointmentId) {
  const occupied = store.appointments.some(
    (appointment) =>
      appointment.slotId === slotId &&
      appointment.status === 'booked' &&
      appointment.id !== appointmentId,
  );
  if (occupied) throw new Error('Slot no longer available');
}

export function bookAppointment(store, { patientId, slotId }) {
  const slot = store.slots.find((s) => s.id === slotId);
  if (!slot) throw new Error(`Unknown slot ${slotId}`);
  assertSlotAvailable(store, slotId);

  const appointment = {
    id: `a${store.nextId++}`,
    patientId,
    slotId,
    clinicId: slot.clinicId,
    start: slot.start,
    status: 'booked',
  };
  store.appointments.push(appointment);
  return appointment;
}

export function cancelAppointment(store, appointmentId) {
  const appointment = store.appointments.find((a) => a.id === appointmentId);
  if (!appointment) throw new Error(`Unknown appointment ${appointmentId}`);

  appointment.status = 'cancelled';
  return appointment;
}

export function rescheduleAppointment(store, appointmentId, slotId, now = new Date()) {
  const appointment = store.appointments.find((candidate) => candidate.id === appointmentId);
  if (!appointment) throw new Error(`Unknown appointment ${appointmentId}`);
  if (appointment.status !== 'booked') {
    throw new Error('Only booked appointments can be rescheduled');
  }
  if (new Date(appointment.start) - now < DAY_MS) {
    throw new Error(
      'Online rescheduling is unavailable less than 24 hours before the appointment; please call the clinic',
    );
  }

  const slot = store.slots.find((candidate) => candidate.id === slotId);
  if (!slot) throw new Error(`Unknown slot ${slotId}`);
  if (slot.clinicId !== appointment.clinicId) {
    throw new Error('Appointments can only be rescheduled within the same clinic');
  }
  assertSlotAvailable(store, slotId, appointment.id);

  appointment.slotId = slot.id;
  appointment.start = slot.start;
  refreshAppointmentReminder(store, appointment, now);
  return appointment;
}

// Slots at a clinic that nobody has booked (cancelled appointments free their slot).
export function findAvailableSlots(store, clinicId) {
  const taken = new Set(
    store.appointments.filter((a) => a.status === 'booked').map((a) => a.slotId),
  );
  return store.slots.filter((s) => s.clinicId === clinicId && !taken.has(s.id));
}
