"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/announcements`).then((r) => r.json()),
      fetch(`${API_BASE}/api/sponsors/active`).then((r) => r.json()),
    ])
      .then(([annData, sponsorData]) => {
        setAnnouncements(annData || []);
        setSponsors(sponsorData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading…</p>;

  const items = [];

  announcements.forEach((a, index) => {
    items.push({ type: "announcement", data: a });

    if ((index + 1) % 3 === 0 && sponsors.length > 0) {
      const sponsor = sponsors[index % sponsors.length];
      items.push({ type: "sponsor", data: sponsor });
    }
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Announcements</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => {
          if (item.type === "sponsor") {
            const s = item.data;

            return (
              <a
                key={`sponsor-${i}`}
                href={s.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-900 bg-white rounded shadow-sm p-6 flex items-center justify-center hover:shadow-md transition"
              >
                {s.logoUrl ? (
                  <img
                    src={`${API_BASE}${s.logoUrl}`}
                    alt={s.name}
                    className="max-h-16 object-contain"
                  />
                ) : (
                  <span className="text-ahsra-blue font-semibold text-lg text-center">
                    {s.name}
                  </span>
                )}
              </a>
            );
          }

          const a = item.data;
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
              <div className="p-3 border-b font-medium text-sm truncate">
                {a.title}
              </div>

              {a.mode === "POSTER" && imageSrc && (
                <img
                  src={imageSrc}
                  alt={a.title}
                  className="w-full h-[240px] object-contain bg-white"
                />
              )}

              {a.content && (
                <div className="p-4 text-sm whitespace-pre-line text-slate-800 flex-1">
                  {a.content}
                </div>
              )}

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
