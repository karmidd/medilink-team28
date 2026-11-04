// Appointment reminders.
// In production, queueReminders() runs every hour and sendDueReminders() every 5 minutes.

const HOUR_MS = 60 * 60 * 1000;
const QUEUE_WINDOW_MS = 24 * HOUR_MS; // look this far ahead when queueing
const SEND_BEFORE_MS = 3 * HOUR_MS; // reminder goes out 3 hours before the appointment

export const REMINDER_CHANNELS = ['email', 'sms', 'none'];

// Patients without a saved preference get email.
function channelOf(store, patientId) {
  const patient = store.patients.find((p) => p.id === patientId);
  return patient?.reminderChannel ?? 'email';
}

function queueReminder(store, appointment, now) {
  const startsIn = new Date(appointment.start) - now;
  const alreadyQueued = store.reminderQueue.some((r) => r.appointmentId === appointment.id);
  const channel = channelOf(store, appointment.patientId);

  if (
    appointment.status === 'booked' &&
    startsIn > 0 &&
    startsIn <= QUEUE_WINDOW_MS &&
    !alreadyQueued &&
    channel !== 'none'
  ) {
    store.reminderQueue.push({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      channel,
      sendAt: new Date(new Date(appointment.start) - SEND_BEFORE_MS).toISOString(),
      sent: false,
    });
  }
}

// Queue one reminder for each booked appointment that starts in the next 24 hours,
// unless the patient chose no reminders.
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

// Send every queued reminder whose time has come. `send` delivers the message on reminder.channel.
export function sendDueReminders(store, send, now = new Date()) {
  for (const reminder of store.reminderQueue) {
    if (!reminder.sent && new Date(reminder.sendAt) <= now) {
      send(reminder);
      reminder.sent = true;
    }
  }
}

// Save how a patient wants reminders. Reminders not sent yet follow the new choice:
// they switch channel, or are dropped for 'none'. Reminders already sent are left as they were.
export function setReminderChannel(store, patientId, channel) {
  if (!REMINDER_CHANNELS.includes(channel)) throw new Error(`Unknown reminder channel ${channel}`);
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) throw new Error(`Unknown patient ${patientId}`);

  patient.reminderChannel = channel;
  const unsent = (r) => r.patientId === patientId && !r.sent;
  if (channel === 'none') {
    store.reminderQueue = store.reminderQueue.filter((r) => !unsent(r));
  } else {
    for (const reminder of store.reminderQueue.filter(unsent)) reminder.channel = channel;
  }
  return patient;
}
