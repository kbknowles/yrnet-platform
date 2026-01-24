import Link from "next/link";
import EventAnnouncements from "../../../components/EventAnnouncements";
import AddToCalendar from "../../../components/AddToCalendar";

async function getEvent(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EventPage({ params }) {
  const { slug } = params;
  const event = await getEvent(slug);

  if (!event) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-4">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <p className="text-gray-700">
          This event may not be published yet or the link is incorrect.
        </p>
        <Link href="/schedule" className="text-ahsra-blue underline">
          ← Back to Schedule
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <section className="border-b pb-6 space-y-2">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-gray-700">
          {new Date(event.startDate).toLocaleDateString()} –{" "}
          {new Date(event.endDate).toLocaleDateString()}
        </p>
      </section>

      {/* Location */}
      {event.location && (
        <section className="space-y-1">
          <h2 className="text-xl font-semibold">Location</h2>
          <p className="font-medium">{event.location.name}</p>
          <p className="text-gray-700">
            {event.location.streetAddress}
            <br />
            {event.location.city}, {event.location.state}{" "}
            {event.location.zip}
          </p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${event.location.streetAddress}, ${event.location.city}, ${event.location.state} ${event.location.zip}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-ahsra-blue underline"
          >
            View on Map
          </a>

          {event.location.notes && (
            <p className="mt-2 text-sm text-gray-600">
              {event.location.notes}
            </p>
          )}
        </section>
      )}

      {/* Call-In Information */}
      {event.callInPolicy && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Call-In Information</h2>

          <div className="rounded border bg-white p-4 text-sm space-y-1">
            <p>
              <span className="font-medium">Platform:</span>{" "}
              {event.callInPolicy.platform}
            </p>

            <p>
              <span className="font-medium">Entries Open:</span>{" "}
              {new Date(event.callInPolicy.entryOpen).toLocaleString()}
            </p>

            <p>
              <span className="font-medium">Entries Close:</span>{" "}
              {new Date(event.callInPolicy.entryClose).toLocaleString()}
            </p>

            {event.callInPolicy.lateOpen && event.callInPolicy.lateClose && (
              <p className="text-red-700">
                Late entries accepted until{" "}
                {new Date(event.callInPolicy.lateClose).toLocaleString()}
              </p>
            )}

            {event.callInPolicy.notes && (
              <p className="text-gray-600 mt-2">
                {event.callInPolicy.notes}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Event Contacts */}
      {event.contacts?.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Event Contacts</h2>

          <ul className="space-y-2">
            {event.contacts.map((contact) => (
              <li
                key={contact.id}
                className="rounded border bg-white p-3 text-sm"
              >
                <span className="font-medium capitalize">
                  {contact.contactRole}:
                </span>{" "}
                {contact.officerRole}
              </li>
            ))}
          </ul>

          <p className="text-xs text-gray-500">
            Emails are routed to current season officers.
          </p>
        </section>
      )}

      {/* Announcements */}
      {event.announcements?.length > 0 && (
        <EventAnnouncements announcements={event.announcements} />
      )}

      {/* Schedule */}
      {event.scheduleItems?.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            Rodeo Weekend Schedule
          </h2>
          <ul className="space-y-3">
            {event.scheduleItems.map((item) => (
              <li
                key={item.id}
                className="rounded border bg-white p-3"
              >
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                  {item.startTime && ` @ ${item.startTime}`}
                </div>
                {item.notes && (
                  <div className="text-sm text-gray-600 mt-1">
                    {item.notes}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Actions */}
      <section className="flex flex-col sm:flex-row gap-4">
        <AddToCalendar event={event} />

        <Link
          href="/schedule"
          className="inline-flex items-center justify-center rounded border px-5 py-2 text-sm font-medium"
        >
          Back to Schedule
        </Link>
      </section>
    </main>
  );
}
