// filepath: frontend/app/announcements/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/announcements`)
      .then((r) => r.json())
      .then((data) => {
        setAnnouncements(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Announcements</h1>

      {announcements.length === 0 && (
        <p className="text-slate-600">No current announcements.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((a) => {
          const imageSrc = a.imageUrl
            ? `${API_BASE}${a.imageUrl}`
            : null;

          const eventHref =
            a.event?.slug ? `/events/${a.event.slug}` : null;

          const Wrapper = ({ children }) =>
            eventHref ? (
              <Link
                href={eventHref}
                className="bg-white border rounded shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
              >
                {children}
              </Link>
            ) : (
              <div className="bg-white border rounded shadow-sm overflow-hidden flex flex-col">
                {children}
              </div>
            );

          return (
            <Wrapper key={a.id}>
              {/* TITLE */}
              <div className="p-3 border-b font-medium text-sm truncate">
                {a.title}
              </div>

              {/* IMAGE (POSTER MODE) */}
              {a.mode === "POSTER" && imageSrc && (
                <img
                  src={imageSrc}
                  alt={a.title}
                  className="w-full h-[240px] object-contain bg-white"
                />
              )}

              {/* CONTENT */}
              {a.content && (
                <div className="p-4 text-sm whitespace-pre-line text-slate-800 flex-1">
                  {a.content}
                </div>
              )}

              {/* FOOTER LINK */}
              {eventHref && (
                <div className="p-3 text-sm text-ahsra-blue underline">
                  View event details →
                </div>
              )}
            </Wrapper>
          );
        })}
      </div>
    </main>
  );
}
