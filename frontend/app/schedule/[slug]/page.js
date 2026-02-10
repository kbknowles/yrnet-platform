"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "../../../lib/formatDate";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchEvent(slug) {
  const res = await fetch(
    `${API_BASE}/api/schedule/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default function EventPage({ params }) {
  const { slug } = params;

  const [event, setEvent] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetchEvent(slug).then(setEvent);
  }, [slug]);

  if (!event) return <div className="p-10">Loading…</div>;

  const location = event.location;

  const fullAddress =
    location?.streetAddress &&
    location?.city &&
    location?.state &&
    location?.zip
      ? `${location.streetAddress}, ${location.city}, ${location.state} ${location.zip}`
      : null;

  const posters =
    event.announcements
      ?.filter((a) => a.mode === "POSTER" && a.imageUrl)
      ?.sort(
        (a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
          new Date(b.publishAt || b.createdAt) -
            new Date(a.publishAt || a.createdAt)
      ) || [];

  const open = typeof activeIndex === "number";
  const current = posters[activeIndex];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-gray-600">
          {formatDate(event.startDate)}
          {event.endDate && ` – ${formatDate(event.endDate)}`}
        </p>
      </header>

      {/* TWO COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {event.generalInfo && (
            <section>
              <h2 className="text-xl font-semibold mb-2">General Info</h2>
              <p className="whitespace-pre-line">{event.generalInfo}</p>
            </section>
          )}

          {location && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Location</h2>

              {location.name && <div>{location.name}</div>}
              {fullAddress && <div>{fullAddress}</div>}

              {fullAddress && (
                <div className="w-full h-[260px] border rounded overflow-hidden">
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
            </section>
          )}
        </div>

        {/* RIGHT */}
        <aside className="space-y-6">
          {/* QUICK FACTS */}
          <section className="border rounded p-4 bg-slate-50">
            <h3 className="font-semibold text-sm uppercase mb-2">
              Quick Facts
            </h3>
            <div className="text-sm space-y-1">
              <div>
                <strong>Date:</strong> {formatDate(event.startDate)}
              </div>
              {location?.city && (
                <div>
                  <strong>City:</strong> {location.city}
                </div>
              )}
            </div>
          </section>

          {/* POSTER THUMBNAILS */}
          {posters.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Announcements</h2>

              <div className="grid grid-cols-2 gap-3">
                {posters.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => setActiveIndex(i)}
                    className="border rounded overflow-hidden"
                  >
                    <img
                      src={`${API_BASE}${a.imageUrl}`}
                      alt={a.title}
                      className="w-full h-[160px] object-contain bg-white"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {/* MODAL OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            ×
          </button>

          {activeIndex > 0 && (
            <button
              onClick={() => setActiveIndex(activeIndex - 1)}
              className="absolute left-4 text-white text-3xl"
            >
              ‹
            </button>
          )}

          {activeIndex < posters.length - 1 && (
            <button
              onClick={() => setActiveIndex(activeIndex + 1)}
              className="absolute right-4 text-white text-3xl"
            >
              ›
            </button>
          )}

          <div className="max-w-full max-h-full overflow-auto">
            <img
              src={`${API_BASE}${current.imageUrl}`}
              alt={current.title}
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}

      <footer>
        <Link href="/schedule" className="underline">
          Back to schedule
        </Link>
      </footer>
    </main>
  );
}
