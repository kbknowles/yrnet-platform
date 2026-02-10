// filepath: frontend/app/schedule/[slug]/page.js

"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "../../../lib/formatDate";

import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/* =========================
   DATA
========================= */

async function getEvent(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/schedule/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/* =========================
   PAGE
========================= */

export default function EventPage({ params }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const slug = params.slug;
  const [event, setEvent] = useState(null);

  if (!event) {
    throw getEvent(slug).then(setEvent);
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
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        const aDate = new Date(a.publishAt || a.createdAt);
        const bDate = new Date(b.publishAt || b.createdAt);
        return bDate - aDate;
      }) || [];

  const posters = announcements.filter(
    (a) => a.mode === "POSTER" && a.imageUrl
  );

  /* =========================
     RENDER
  ========================= */

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

      {/* TWO COLUMN LAYOUT */}
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
          <h2 className="text-xl font-semibold">Announcements</h2>

          {/* POSTER GRID */}
          {posters.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posters.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setOpen(true);
                  }}
                  className="border rounded overflow-hidden bg-white"
                >
                  <img
                    src={`${API_BASE}${p.imageUrl}`}
                    alt={p.title}
                    className="w-full h-[220px] object-contain"
                  />
                  <div className="p-2 text-sm font-medium truncate">
                    {p.title}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STANDARD ANNOUNCEMENTS */}
          {announcements
            .filter((a) => a.mode !== "POSTER")
            .map((a) => (
              <div
                key={a.id}
                className="border rounded p-4 bg-white"
              >
                <div className="font-medium">{a.title}</div>
                <div className="text-sm whitespace-pre-line">
                  {a.content}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* POSTER MODAL */}
      {open && (
        <PosterModal
          posters={posters}
          startIndex={activeIndex}
          onClose={() => setOpen(false)}
        />
      )}

      <div>
        <Link href="/schedule" className="underline">
          Back to schedule
        </Link>
      </div>
    </main>
  );
}

/* =========================
   POSTER MODAL
========================= */

function PosterModal({ posters, startIndex, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl z-50"
      >
        ✕
      </button>

      <Swiper
        modules={[Zoom, Navigation]}
        zoom
        navigation
        initialSlide={startIndex}
        slidesPerView={1}
        className="w-full h-full"
      >
        {posters.map((p) => (
          <SwiperSlide key={p.id}>
            <div className="swiper-zoom-container flex items-center justify-center h-full">
              <img
                src={`${API_BASE}${p.imageUrl}`}
                alt={p.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
