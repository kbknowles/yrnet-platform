import ScheduleCalendar from "../../components/ScheduleCalendar";
import FeaturedRodeo from "../../components/FeaturedRodeo";
import { getNextEvent } from "../../utils/getNextEvent";

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
  const nextEvent = getNextEvent(events);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-ahsra-blue">
          Rodeo Schedule
        </h1>
        <p className="text-gray-700">
          Official AHSRA rodeo dates and locations
        </p>
      </header>

      {/* Featured Next Rodeo */}
      {nextEvent && <FeaturedRodeo event={nextEvent} />}

      {/* Calendar / Empty State */}
      {events.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-gray-700">
            The schedule will be posted soon. Please check back.
          </p>
        </div>
      ) : (
        <ScheduleCalendar events={events} />
      )}
    </main>
  );
}
