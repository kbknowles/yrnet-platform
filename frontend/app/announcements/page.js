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
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Announcements</h1>

      {announcements.map((a) => {
        const posterSrc =
          a.imageUrl && `${API_BASE}${a.imageUrl}`;

        return (
          <article
            key={a.id}
            className="bg-white border rounded shadow-sm overflow-hidden"
          >
            {a.mode === "POSTER" && posterSrc ? (
              <Link href={`/announcements/${a.id}`}>
                {a.imageUrl.endsWith(".pdf") ? (
                  <div className="p-6 text-center text-ahsra-blue underline">
                    View Poster (PDF)
                  </div>
                ) : (
                  <img
                    src={posterSrc}
                    alt={a.title}
                    className="w-full object-contain"
                  />
                )}
              </Link>
            ) : (
              <div className="p-6">
                <h2 className="font-semibold">{a.title}</h2>
                <p className="mt-2 whitespace-pre-line">{a.content}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
