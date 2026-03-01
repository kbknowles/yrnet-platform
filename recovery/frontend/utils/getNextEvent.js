export function getNextEvent(events = []) {
  const now = new Date();
  return events
    .filter(e => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;
}
