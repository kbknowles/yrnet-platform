// filepath: frontend/app/schedule/[slug]/page.js

import Link from "next/link";
import { formatDate } from "../../../lib/formatDate";

async function getEvent(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${encodeURIComponent(
        slug
      )}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return <div className="p-10">Event not found</div>;
  }

  const location = event.location;

  const fullAddress =
    location?.streetAddress &&
    location?.city &&
    location?.state &&
    location?.zip
      ? `${location.streetAddress}, ${location.city}, ${location.state} ${location.zip}`
      : null;

  const announcements = [...(event.announcements || [])].sort(
    (a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
      new Date(b.publishAt || b.createdAt) -
        new Date(a.publishAt || a.createdAt)
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* =====================
          HEADER
         ===================== */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-gray-600">
          {formatDate(event.startDate)}
          {event.endDate && ` – ${formatDate(event.endDate)}`}
        </p>
        {event.season && (
          <p className="text-sm text-gray-700">
            Season: <strong>{event.season.name}</strong>
          </p>
        )}
      </header>

      {/* =====================
          TWO COLUMN LAYOUT
         ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* =====================
            LEFT COLUMN
           ===================== */}
        <div className="lg:col-span-2 space-y-8">
          {/* Schedule */}
          {event.scheduleItems?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Schedule</h2>
              <div className="space-y-3">
                {event.scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded p-4 space-y-1"
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(item.startTime)}
                      {item.endTime &&
                        ` – ${formatDate(item.endTime)}`}
                    </div>
                    {item.description && (
                      <div className="text-sm">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* General Info */}
          {event.generalInfo && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">
                General Information
              </h2>
              <p className="whitespace-pre-line">
                {event.generalInfo}
              </p>
            </section>
          )}

          {/* Location */}
          {location && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Location</h2>
              <div className="space-y-1 text-sm">
                {location.name && (
                  <div className="font-medium">
                    {location.name}
                  </div>
                )}
                {fullAddress && <div>{fullAddress}</div>}
              </div>

              {fullAddress && (
                <>
                  <div className="w-full h-[300px] rounded overflow-hidden border">
                    <iframe
                      width="100%"
                      height="100%"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        fullAddress
                      )}&output=embed`}
                    />
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      fullAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline"
                  >
                    Get Directions
                  </a>
                </>
              )}
            </section>
          )}
        </div>

        {/* =====================
            RIGHT COLUMN
           ===================== */}
        <aside className="space-y-6">
          {/* Quick Facts */}
          <section className="border rounded p-4 bg-slate-50 space-y-2 sticky top-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide">
              Quick Facts
            </h3>
            <div className="text-sm space-y-1">
              <div>
                <strong>Dates:</strong>{" "}
                {formatDate(event.startDate)}
              </div>
              {location?.city && (
                <div>
                  <strong>City:</strong> {location.city}
                </div>
              )}
              {event.status && (
                <div>
                  <strong>Status:</strong> {event.status}
                </div>
              )}
            </div>
          </section>

          {/* Announcements */}
          {announcements.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                Announcements
              </h2>

              <div className="space-y-4">
                {announcements.map((a) => {
                  const posterSrc =
                    a.imageUrl &&
                    `${process.env.NEXT_PUBLIC_API_URL}${a.imageUrl}`;

                  return (
                    <div
                      key={a.id}
                      className="border rounded bg-white overflow-hidden"
                    >
                      <div className="p-3 border-b font-medium text-sm">
                        {a.title}
                      </div>

                      {a.mode === "POSTER" && posterSrc ? (
                        <details className="group">
                          <summary className="cursor-pointer p-3 text-sm text-ahsra-blue underline">
                            View poster
                          </summary>
                          <img
                            src={posterSrc}
                            alt={a.title}
                            className="w-full max-h-[600px] object-contain bg-white"
                          />
                        </details>
                      ) : (
                        <div className="p-3 text-sm whitespace-pre-line">
                          {a.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Sponsors Placeholder */}
          <section className="border rounded p-4 text-sm text-slate-500">
            Sponsors coming soon
          </section>
        </aside>
      </div>

      {/* Footer */}
      <footer>
        <Link href="/schedule" className="underline">
          Back to schedule
        </Link>
      </footer>
    </main>
  );
}
