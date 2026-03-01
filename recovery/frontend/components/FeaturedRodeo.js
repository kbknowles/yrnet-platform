import Link from "next/link";
import AddToCalendar from "./AddToCalendar";

export default function FeaturedRodeo({ event }) {
  if (!event) return null;

  return (
    <section className="rounded-2xl border bg-white p-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
            Next Rodeo
          </span>
          <h2 className="text-xl md:text-2xl font-bold">{event.name}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(event.startDate).toLocaleDateString()} –{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm mt-1">
            {event.location?.name} · {event.location?.city}, {event.location?.state}
          </p>
        </div>

        <Link
          href={`/schedule/${event.slug}`}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          View Details
        </Link>
      </div>

      <AddToCalendar event={event} />
    </section>
  );
}
