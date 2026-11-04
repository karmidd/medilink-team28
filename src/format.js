// Text shown to patients in confirmation emails and reminders.

// Format an appointment time in the clinic's own time zone, with the zone shown,
// e.g. "Nov 10, 2026, 9:00 a.m. AST" for a Halifax clinic.
export function formatAppointmentTime(isoString, clinic) {
  if (!clinic?.timeZone) throw new Error('formatAppointmentTime needs the clinic (with its timeZone)');

  return new Date(isoString).toLocaleString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: clinic.timeZone,
    timeZoneName: 'short',
  });
}
