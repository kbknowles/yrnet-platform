export async function getUpcomingEvents(limit = 3) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/schedule`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const events = await res.json();
  const today = new Date();

  return events
    .filter(e => new Date(e.startDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, limit);
}
