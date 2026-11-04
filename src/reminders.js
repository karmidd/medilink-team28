// Appointment reminders.
// In production, queueReminders() runs every hour and sendDueReminders() every 5 minutes.

const HOUR_MS = 60 * 60 * 1000;
const QUEUE_WINDOW_MS = 24 * HOUR_MS; // look this far ahead when queueing
const SEND_BEFORE_MS = 3 * HOUR_MS; // reminder goes out 3 hours before the appointment

function queueReminder(store, appointment, now) {
  const startsIn = new Date(appointment.start) - now;
  const alreadyQueued = store.reminderQueue.some((r) => r.appointmentId === appointment.id);

  if (appointment.status === 'booked' && startsIn > 0 && startsIn <= QUEUE_WINDOW_MS && !alreadyQueued) {
    store.reminderQueue.push({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      sendAt: new Date(new Date(appointment.start) - SEND_BEFORE_MS).toISOString(),
      sent: false,
    });
  }
}

// Queue one reminder for each booked appointment that starts in the next 24 hours.
export function queueReminders(store, now = new Date()) {
  for (const appointment of store.appointments) {
    queueReminder(store, appointment, now);
  }
}

export function refreshAppointmentReminder(store, appointment, now = new Date()) {
  store.reminderQueue = store.reminderQueue.filter(
    (reminder) => reminder.appointmentId !== appointment.id,
  );
  queueReminder(store, appointment, now);
}

// Send every queued reminder whose time has come. `send` delivers the message (email/SMS).
export function sendDueReminders(store, send, now = new Date()) {
  for (const reminder of store.reminderQueue) {
    if (!reminder.sent && new Date(reminder.sendAt) <= now) {
      send(reminder);
      reminder.sent = true;
    }
  }
}
