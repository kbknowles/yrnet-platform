async function getEvent(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function EventPage({ params }) {
  const event = await getEvent(params.slug);

  if (!event) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Event not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{event.name}</h1>

      <p className="text-gray-700">
        {new Date(event.startDate).toLocaleDateString()} –{" "}
        {new Date(event.endDate).toLocaleDateString()}
      </p>

      <section>
        <h2 className="font-semibold text-lg">Location</h2>
        <p>{event.location.name}</p>
        <p>
          {event.location.streetAddress}<br />
          {event.location.city}, {event.location.state} {event.location.zip}
        </p>
        {event.location.notes && (
          <p className="mt-2 text-sm text-gray-600">
            {event.location.notes}
          </p>
        )}
      </section>

      {event.generalInfo && (
        <section>
          <h2 className="font-semibold text-lg">General Info</h2>
          <p className="whitespace-pre-line">{event.generalInfo}</p>
        </section>
      )}

      {event.scheduleItems.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg">Schedule</h2>
          <ul className="space-y-2">
            {event.scheduleItems.map((item) => (
              <li key={item.id} className="text-sm">
                <strong>{item.label}</strong> –{" "}
                {new Date(item.date).toLocaleDateString()}
                {item.startTime && ` @ ${item.startTime}`}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
