import Link from "next/link";

async function getSchedule() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/schedule`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load schedule");
  }

  return res.json();
}

export default async function SchedulePage() {
  const events = await getSchedule();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Rodeo Schedule</h1>

      <div className="grid gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/schedule/${event.slug}`}
            className="border rounded-lg p-5 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">{event.name}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleDateString()} –{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">{event.location.name}</p>
                <p className="text-gray-600">
                  {event.location.city}, {event.location.state}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
