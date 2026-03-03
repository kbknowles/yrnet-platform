// filepath: frontend/components/home/HomeHighlights.js

"use client";

import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveMedia(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return `${API_BASE}${url}`;
}

export default function HomeHighlights({ rodeos, announcements }) {
  const safeRodeos = Array.isArray(rodeos) ? rodeos : [];
  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

  const sorted = [...safeAnnouncements].sort((a, b) => {
    const aDate = new Date(a.publishAt || a.createdAt);
    const bDate = new Date(b.publishAt || b.createdAt);
    return bDate - aDate;
  });

  const featured = sorted[0];

  const featuredHref = featured?.rodeo?.slug
    ? `/rodeos/${featured.rodeo.slug}`
    : "/announcements";

  return (
    <section className="w-full mt-1">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Upcoming Rodeos */}
        <div className="bg-gray-900 text-white flex justify-center">
          <div className="w-full max-w-xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Upcoming Rodeos
            </h2>

            {safeRodeos.length === 0 ? (
              <p className="text-sm text-white/80 flex-1">
                No rodeos have been published yet.
              </p>
            ) : (
              <ul className="space-y-4 flex-1">
                {safeRodeos.map((rodeo) => (
                  <li
                    key={rodeo.id}
                    className="bg-white/10 rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium">{rodeo.name}</p>
                      <p className="text-sm text-white/80">
                        {rodeo.startDate
                          ? new Date(rodeo.startDate).toLocaleDateString()
                          : ""}
                        {rodeo.location?.name
                          ? ` · ${rodeo.location.name}`
                          : ""}
                      </p>
                    </div>

                    <Link
                      href={`/rodeos/${rodeo.slug}`}
                      className="text-sm font-medium bg-white text-ahsra-blue px-4 py-2 rounded-md"
                    >
                      View Details
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-6">
              <Link
                href="/schedule"
                className="text-sm font-medium underline underline-offset-4"
              >
                View Full Schedule →
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Announcement */}
        <div className="bg-gray-100 flex justify-center">
          <div className="w-full max-w-xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-ahsra-red">
              Announcements
            </h2>

            {featured ? (
              <div className="rounded-md shadow-sm overflow-hidden">
                {featured.mode === "POSTER" && featured.imageUrl ? (
                  <Link href={featuredHref}>
                    <img
                      src={resolveMedia(featured.imageUrl)}
                      alt={featured.title || "Announcement"}
                      className="w-full max-h-[420px] object-contain"
                    />
                  </Link>
                ) : (
                  <div className="p-4 space-y-2">
                    <p className="font-medium">{featured.title}</p>

                    {(featured.publishAt || featured.createdAt) && (
                      <p className="text-sm text-gray-600">
                        {new Date(
                          featured.publishAt || featured.createdAt
                        ).toLocaleDateString()}
                      </p>
                    )}

                    <Link
                      href={featuredHref}
                      className="inline-block text-sm font-medium bg-ahsra-red text-white px-4 py-2 rounded-md"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No current announcements.</p>
            )}

            <div className="pt-6">
              <Link
                href="/announcements"
                className="text-sm font-medium text-ahsra-red underline underline-offset-4"
              >
                View All Announcements →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}