// Booking and cancelling appointments.

export function bookAppointment(store, { patientId, slotId }) {
  const slot = store.slots.find((s) => s.id === slotId);
  if (!slot) throw new Error(`Unknown slot ${slotId}`);
  if (store.appointments.some((a) => a.slotId === slotId && a.status === 'booked')) {
    throw new Error('Slot no longer available');
  }

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

// Slots at a clinic that nobody has booked (cancelled appointments free their slot).
export function findAvailableSlots(store, clinicId) {
  const taken = new Set(
    store.appointments.filter((a) => a.status === 'booked').map((a) => a.slotId),
  );
  return store.slots.filter((s) => s.clinicId === clinicId && !taken.has(s.id));
}
