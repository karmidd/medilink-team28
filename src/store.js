// In-memory sample data for the MediLink prototype.
// createStore() returns a fresh copy every time, so tests never share state.

export function createStore() {
  return {
    clinics: [
      { id: 'c1', name: 'Clinique Plateau', timeZone: 'America/Toronto' },
      { id: 'c2', name: 'Halifax Family Dental', timeZone: 'America/Halifax' },
    ],
    patients: [
      { id: 'p1', name: 'Amira Haddad', email: 'amira@example.com' },
      { id: 'p2', name: 'Lucas Gagnon', email: 'lucas@example.com' },
      { id: 'p3', name: 'Priya Nair', email: 'priya@example.com' },
    ],
    // Times are stored in UTC.
    slots: [
      { id: 's1', clinicId: 'c1', practitioner: 'Dr. Tremblay', start: '2026-11-10T14:00:00Z' },
      { id: 's2', clinicId: 'c1', practitioner: 'Dr. Tremblay', start: '2026-11-10T15:00:00Z' },
      { id: 's3', clinicId: 'c1', practitioner: 'Dr. Okafor', start: '2026-11-11T13:30:00Z' },
      { id: 's4', clinicId: 'c2', practitioner: 'Dr. MacLeod', start: '2026-11-10T13:00:00Z' },
      { id: 's5', clinicId: 'c2', practitioner: 'Dr. MacLeod', start: '2026-11-10T14:00:00Z' },
    ],
    appointments: [],
    reminderQueue: [],
    nextId: 1,
  };
}
