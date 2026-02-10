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
        const sorted = [...data].sort((a, b) => {
          const aDate = new Date(a.publishAt || a.createdAt);
          const bDate = new Date(b.publishAt || b.createdAt);
          return bDate - aDate;
        });
        setAnnouncements(sorted);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Announcements</h1>

      {announcements.length === 0 && (
        <p className="text-slate-600">No current announcements.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {announcements.map((a) => {
          const posterSrc = a.imageUrl && `${API_BASE}${a.imageUrl}`;

          // ALL announcements link to event if present
          const href = a.event?.slug
            ? `/schedule/${a.event.slug}`
            : "/schedule";

          return (
            <Link
              key={a.id}
              href={href}
              className="bg-white border rounded shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
            >
              {/* POSTER CARD */}
              {a.mode === "POSTER" && posterSrc ? (
                <>
                  <div className="p-3 border-b font-medium text-sm">
                    {a.title}
                  </div>

                  {a.imageUrl.endsWith(".pdf") ? (
                    <div className="flex-1 flex items-center justify-center p-6 text-ahsra-blue underline text-sm">
                      View Poster (PDF)
                    </div>
                  ) : (
                    <img
                      src={posterSrc}
                      alt={a.title}
                      className="w-full h-[260px] object-contain bg-white"
                    />
                  )}

                  {a.content && (
                    <div className="p-4 border-t text-sm whitespace-pre-line">
                      {a.content}
                    </div>
                  )}
                </>
              ) : (
                /* STANDARD CARD */
                <div className="p-4 flex flex-col gap-3 h-full">
                  <h2 className="font-semibold text-base">
                    {a.title}
                  </h2>

                  <div className="text-sm whitespace-pre-line text-slate-800 flex-1">
                    {a.content}
                  </div>

                  <div className="text-sm text-ahsra-blue underline">
                    View event details →
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
