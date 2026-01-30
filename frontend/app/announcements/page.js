// filepath: frontend/app/announcements/page.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/announcements`);
    const data = await res.json();
    setAnnouncements(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p className="p-6">Loading announcements…</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Announcements</h1>

      {announcements.length === 0 ? (
        <p className="text-slate-600">No current announcements.</p>
      ) : (
        <div className="space-y-6">
          {announcements.map((a) => (
            <article
              key={a.id}
              className="bg-white border rounded shadow-sm p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold">{a.title}</h2>
                {a.type && (
                  <span className="text-xs uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">
                    {a.type}
                  </span>
                )}
              </div>

              <div className="mt-3 whitespace-pre-line text-slate-800">
                {a.content}
              </div>

              {(a.publishAt || a.eventId || a.seasonId) && (
                <div className="mt-4 text-xs text-slate-500 flex flex-wrap gap-4">
                  {a.publishAt && (
                    <span>
                      Posted{" "}
                      {new Date(a.publishAt).toLocaleDateString()}
                    </span>
                  )}
                  {a.eventId && <span>Event #{a.eventId}</span>}
                  {a.seasonId && <span>Season #{a.seasonId}</span>}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
