import Link from "next/link";
import { formatDate } from "../../lib/formatDate";

async function getSchedule() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/schedule`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SchedulePage() {
  const events = await getSchedule();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold">Rodeo Schedule</h1>

      {events.length === 0 ? (
        <div className="border p-6 text-center bg-white">
          Schedule coming soon.
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/schedule/${event.slug}`}
              className="border rounded p-4 bg-white"
            >
              <h2 className="font-semibold">{event.name}</h2>
              <p className="text-sm text-gray-600">
                {formatDate(event.startDate)} – {formatDate(event.endDate)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
