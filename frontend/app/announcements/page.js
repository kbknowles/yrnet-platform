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
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Announcements</h1>

      {announcements.length === 0 && (
        <p className="text-slate-600">No current announcements.</p>
      )}

      {announcements.map((a) => {
        const posterSrc = a.imageUrl && `${API_BASE}${a.imageUrl}`;

        const href = a.event?.slug
          ? `/schedule/${a.event.slug}`
          : "/announcements";

        return (
          <article
            key={a.id}
            className="bg-white border rounded shadow-sm overflow-hidden"
          >
            {/* POSTER */}
            {a.mode === "POSTER" && posterSrc ? (
              <>
                <div className="p-4 border-b font-medium">
                  {a.title}
                </div>

                <Link href={href}>
                  {a.imageUrl.endsWith(".pdf") ? (
                    <div className="p-10 flex justify-center bg-slate-50">
                      <span className="text-sm text-ahsra-blue underline">
                        View Poster (PDF)
                      </span>
                    </div>
                  ) : (
                    <img
                      src={posterSrc}
                      alt={a.title}
                      className="w-full max-h-[600px] object-contain bg-white"
                    />
                  )}
                </Link>

                {a.content && (
                  <div className="p-6 border-t whitespace-pre-line">
                    {a.content}
                  </div>
                )}
              </>
            ) : (
              /* STANDARD */
              <div className="p-6 space-y-3">
                <h2 className="font-semibold text-lg">{a.title}</h2>

                <div className="whitespace-pre-line text-slate-800">
                  {a.content}
                </div>

                {a.event?.slug && (
                  <Link
                    href={`/schedule/${a.event.slug}`}
                    className="text-sm text-ahsra-blue underline"
                  >
                    View event details →
                  </Link>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
