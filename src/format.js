// Text shown to patients in confirmation emails and reminders.

export function formatAppointmentTime(isoString) {
  return new Date(isoString).toLocaleString('en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Toronto',
  });
}
