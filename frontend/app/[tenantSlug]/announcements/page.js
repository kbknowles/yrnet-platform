// filepath: frontend/app/[tenantSlug]/announcements/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementsPage() {
  const tenantSlug = useTenantSlug();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantSlug) return;

    async function loadAnnouncements() {
      try {
        const res = await fetch(
          `${API_BASE}/api/${tenantSlug}/announcements`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          setAnnouncements([]);
          return;
        }

        const data = await res.json();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load announcements:", err);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncements();
  }, [tenantSlug]);

  const sorted = [...announcements].sort((a, b) => {
    if (a.priority === "important" && b.priority !== "important") return -1;
    if (a.priority !== "important" && b.priority === "important") return 1;

    const aDate = new Date(a.publishAt || a.createdAt);
    const bDate = new Date(b.publishAt || b.createdAt);

    return bDate - aDate;
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Announcements</h1>

      {loading && (
        <p className="text-sm text-gray-600">Loading announcements...</p>
      )}

      {!loading && sorted.length === 0 && (
        <p className="text-sm text-gray-600">
          No announcements have been published.
        </p>
      )}

      <div className="space-y-4">
        {sorted.map((a) => (
          <div
            key={a.id}
            className={`rounded border p-4 ${
              a.priority === "important"
                ? "border-red-700 bg-red-50"
                : "bg-white"
            }`}
          >
            <div className="font-semibold">{a.title}</div>

            {(a.publishAt || a.createdAt) && (
              <div className="text-xs text-gray-500 mt-1">
                {new Date(
                  a.publishAt || a.createdAt
                ).toLocaleDateString()}
              </div>
            )}

            <div className="text-sm text-gray-700 mt-2">
              {a.content}
            </div>

            {a.slug && (
              <Link
                href={`/${tenantSlug}/announcements/${a.slug}`}
                className="inline-block mt-3 text-sm text-primary hover:underline"
              >
                Read More →
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}