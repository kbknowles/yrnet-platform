export async function getUpcomingEvents(limit = 3) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const events = await res.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize

  return events
    .filter(e => e.startDate && new Date(e.startDate) >= today)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    )
    .slice(0, limit);
}
