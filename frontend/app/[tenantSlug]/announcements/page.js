// filepath: frontend/app/[tenantSlug]/announcements/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTenantSlug } from "hooks/useTenantSlug";
import { resolveTenantMedia } from "lib/media";

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
          `${API_BASE}/${tenantSlug}/announcements`,
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
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold">Announcements</h1>

      {loading && (
        <p className="text-sm text-gray-600">Loading announcements...</p>
      )}

      {!loading && sorted.length === 0 && (
        <p className="text-sm text-gray-600">
          No announcements have been published.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {sorted.map((a) => {
          const poster =
            a.imageUrl &&
            resolveTenantMedia({
              tenantSlug,
              folder: "announcements",
              filename: a.imageUrl,
              recordId: a.id,
            });

          return (
            <div
              key={a.id}
              className={`rounded-lg border shadow-sm overflow-hidden ${
                a.priority === "important"
                  ? "border-red-700"
                  : "border-gray-200"
              }`}
            >
              {poster && (
                <div className="relative w-full h-64 bg-gray-200">
                  <Image
                    src={poster}
                    alt={a.title || "Announcement"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="p-5 space-y-3">
                <div className="font-semibold text-lg">{a.title}</div>

                {(a.publishAt || a.createdAt) && (
                  <div className="text-xs text-gray-500">
                    {new Date(
                      a.publishAt || a.createdAt
                    ).toLocaleDateString()}
                  </div>
                )}

                {a.content && (
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {a.content}
                  </div>
                )}

                {a.slug && (
                  <Link
                    href={`/${tenantSlug}/announcements/${a.slug}`}
                    className="inline-block text-sm text-primary hover:underline"
                  >
                    Read More →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}