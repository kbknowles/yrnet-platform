// filepath: frontend/app/schedule/page.js

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

  const seasonLabel =
    events.length > 0 && events[0].season?.year
      ? `${events[0].season.year} `
      : "";

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold">
        {seasonLabel}Rodeo Schedule
      </h1>

      {events.length === 0 ? (
        <div className="border rounded p-8 text-center bg-white">
          Schedule coming soon.
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/schedule/${event.slug}`}
              className="block border rounded-lg bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* LEFT */}
                <div className="space-y-1">
                  <h2 className="text-lg text-ahsra-red font-bold">
                    {event.season?.name && (
                      <span className="text-gray-500 font-normal">
                        {event.season.name} ·{" "}
                      </span>
                    )}
                    {event.name}
                  </h2>

                  <p className="text-sm text-gray-600">
                    {formatDate(event.startDate)}
                    {event.endDate && ` – ${formatDate(event.endDate)}`}
                  </p>

                  {event.location && (
                    <p className="text-sm text-gray-500">
                      {event.location.city}, {event.location.state}
                    </p>
                  )}
                </div>

                {/* RIGHT */}
                <div className="text-sm font-medium text-ahsra-blue">
                  View Details →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
