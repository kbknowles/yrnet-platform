// filepath: frontend/app/schedule/[slug]/page.js

import Link from "next/link";
import { formatDate } from "../../../lib/formatDate";

async function getEvent(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${encodeURIComponent(slug)}`,
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

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      {/* =====================
          WORK IN PROGRESS NOTICE
         ===================== */}
      <div className="rounded border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
        <strong>Work in progress:</strong> This event page is still being built.
        More details and features will be added.
      </div>

      {/* =====================
          EVENT HEADER
         ===================== */}
      <section className="space-y-2">
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
      </section>

      {/* =====================
          LOCATION
         ===================== */}
      {location && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Location</h2>

          <div className="space-y-1 text-sm">
            {location.name && (
              <div className="font-medium">{location.name}</div>
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

      {/* =====================
          EVENT INFO
         ===================== */}
      {event.generalInfo && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Event Information</h2>
          <p className="whitespace-pre-line">{event.generalInfo}</p>
        </section>
      )}

      {/* =====================
          SCHEDULE
         ===================== */}
      {event.scheduleItems?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Schedule</h2>

          <div className="space-y-3">
            {event.scheduleItems.map((item) => (
              <div key={item.id} className="border rounded p-4 space-y-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(item.startTime)}
                  {item.endTime && ` – ${formatDate(item.endTime)}`}
                </div>
                {item.description && (
                  <div className="text-sm">{item.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================
          ANNOUNCEMENTS
         ===================== */}
      {event.announcements?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Announcements</h2>

          <div className="space-y-3">
            {event.announcements.map((a) => (
              <div key={a.id} className="border rounded p-4">
                <div className="font-medium">{a.title}</div>
                <div className="text-sm whitespace-pre-line">
                  {a.content}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================
          CONTACTS
         ===================== */}
      {event.contacts?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Contacts</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {event.contacts.map((c) => (
              <div key={c.id} className="border rounded p-4 space-y-1">
                <div className="font-medium">{c.name}</div>
                {c.role && (
                  <div className="text-sm text-gray-600">{c.role}</div>
                )}
                {c.phone && (
                  <div className="text-sm">
                    <a href={`tel:${c.phone}`} className="underline">
                      {c.phone}
                    </a>
                  </div>
                )}
                {c.email && (
                  <div className="text-sm">
                    <a href={`mailto:${c.email}`} className="underline">
                      {c.email}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================
          FOOTER
         ===================== */}
      <div>
        <Link href="/schedule" className="underline">
          Back to schedule
        </Link>
      </div>
    </main>
  );
}
