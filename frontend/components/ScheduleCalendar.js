import Link from "next/link";

function isToday(date) {
  const d = new Date(date);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

export default function ScheduleCalendar({ events }) {
  const grouped = events.reduce((acc, event) => {
    const d = new Date(event.startDate);
    const key = d.toLocaleString("default", { month: "long", year: "numeric" });
    acc[key] = acc[key] || [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([month, items]) => (
        <section key={month} className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">
            {month}
          </h2>

          <div className="grid gap-4">
            {items.map(event => {
              const today = isToday(event.startDate);

              return (
                <Link
                  key={event.id}
                  href={`/schedule/${event.slug}`}
                  className={`block rounded-xl border p-4 transition
                    ${today ? "border-red-700 bg-red-50" : "bg-white hover:bg-gray-50"}
                  `}
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <div className="font-semibold">{event.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.startDate).toLocaleDateString()} –{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-sm text-right">
                      <div className="font-medium">
                        {event.location?.name}
                      </div>
                      <div className="text-gray-600">
                        {event.location?.city}, {event.location?.state}
                      </div>
                      {today && (
                        <div className="mt-1 text-xs font-semibold text-red-700">
                          TODAY
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
