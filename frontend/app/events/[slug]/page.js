// filepath: frontend/app/events/[slug]/page.js

import Link from "next/link";
import { formatDate } from "../../../lib/formatDate";
import MediaSwiper from "../../../components/MediaSwiper";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getEvent(slug) {
  if (!slug) return null;

  const res = await fetch(
    `${API_BASE}/api/events/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
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

  const announcements =
    event.announcements
      ?.slice()
      .sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const posters = announcements.filter(
    (a) => a.mode === "POSTER" && a.imageUrl
  );

  const standardAnnouncements = announcements.filter(
    (a) => a.mode !== "POSTER"
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* HEADER */}
      <section>
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-gray-600">
          {formatDate(event.startDate)}
          {event.endDate && ` – ${formatDate(event.endDate)}`}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-1 space-y-6">
          {event.generalInfo && (
            <div>
              <h2 className="font-semibold mb-2">General Info</h2>
              <p className="whitespace-pre-line text-sm">
                {event.generalInfo}
              </p>
            </div>
          )}

          {location && (
            <div>
              <h2 className="font-semibold mb-2">Location</h2>
              <p className="text-sm">
                {location.name}
                <br />
                {fullAddress}
              </p>

              {fullAddress && (
                <div className="mt-3 h-[220px] border rounded overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      fullAddress
                    )}&output=embed`}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          {posters.length > 0 && (
            <MediaSwiper items={posters} />
          )}

          {standardAnnouncements.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Announcements</h2>

              {standardAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className="border rounded p-4 bg-white"
                >
                  {a.title && (
                    <div className="font-medium mb-1">
                      {a.title}
                    </div>
                  )}
                  {a.content && (
                    <div className="text-sm whitespace-pre-line">
                      {a.content}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      <Link href="/schedule" className="underline">
        Back to schedule
      </Link>
    </main>
  );
}
