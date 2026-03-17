// filepath: frontend/components/home/HomeHighlights.js
"use client";

/*
  HomeHighlights
  -------------------------------------------------------
  FIX:
  - Supports BOTH images and PDFs for announcements
  - PDFs render using iframe preview
  - Images render normally

  Date Fix:
  Parse YYYY-MM-DD as local date (no UTC shift)
*/

import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";
import { resolveTenantMedia } from "lib/media";

/*
  Safe local date parser (NO timezone shift)
*/
function formatLocalDate(dateStr) {
  if (!dateStr) return "";

  const ymd = dateStr.slice(0, 10);
  const [y, m, d] = ymd.split("-").map(Number);

  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString();
}

/*
  Detect PDF files
*/
function isPDF(file) {
  return file?.toLowerCase().endsWith(".pdf");
}

/*
  Resolve announcement media
*/
function resolveAnnouncementMedia(filename, tenantSlug) {
  if (!filename || !tenantSlug) return "";

  return resolveTenantMedia({
    tenantSlug,
    folder: "announcements",
    filename,
  });
}

export default function HomeHighlights({ rodeos, announcements }) {
  const tenantSlug = useTenantSlug();

  const safeRodeos = Array.isArray(rodeos) ? rodeos : [];
  const safeAnnouncements = Array.isArray(announcements)
    ? announcements
    : [];

  /*
    Sort announcements newest first
  */
  const sorted = [...safeAnnouncements].sort((a, b) => {
    const aDate = new Date(a.publishAt || a.createdAt);
    const bDate = new Date(b.publishAt || b.createdAt);
    return bDate - aDate;
  });

  const featured = sorted[0];

  const featuredHref = featured?.rodeo?.slug
    ? `/${tenantSlug}/rodeos/${featured.rodeo.slug}`
    : `/${tenantSlug}/announcements`;

  const featuredMedia =
    featured?.mode === "POSTER" && featured?.imageUrl
      ? resolveAnnouncementMedia(featured.imageUrl, tenantSlug)
      : null;

  return (
    <section className="w-full mt-1">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Upcoming Rodeos */}
        <div className="bg-gray-900 hero flex justify-center">
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
                        {formatLocalDate(rodeo.startDate)}
                        {rodeo.location?.name
                          ? ` · ${rodeo.location.name}`
                          : ""}
                      </p>
                    </div>

                    <Link
                      href={`/${tenantSlug}/rodeos/${rodeo.slug}`}
                      className="text-sm font-medium bg-white text-primary px-4 py-2 rounded-md"
                    >
                      View Details
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-6">
              <Link
                href={`/${tenantSlug}/schedule`}
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
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-accent">
              Announcements
            </h2>

            {featured ? (
              <div className="rounded-md shadow-sm overflow-hidden">

                {/* Poster / PDF Announcement */}
                {featuredMedia ? (
                  <Link href={featuredHref}>
                    {isPDF(featured.imageUrl) ? (
                      <iframe
                        src={featuredMedia}
                        className="w-full h-[420px] bg-white"
                      />
                    ) : (
                      <img
                        src={featuredMedia}
                        alt={featured.title || "Announcement"}
                        className="w-full max-h-[420px] object-contain"
                      />
                    )}
                  </Link>
                ) : (
                  /* Standard Announcement */
                  <div className="p-4 space-y-2">
                    <p className="font-medium">{featured.title}</p>

                    {(featured.publishAt || featured.createdAt) && (
                      <p className="text-sm text-gray-600">
                        {formatLocalDate(
                          featured.publishAt || featured.createdAt
                        )}
                      </p>
                    )}

                    <Link
                      href={featuredHref}
                      className="inline-block text-sm font-medium bg-accent text-white px-4 py-2 rounded-md"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No current announcements.
              </p>
            )}

            <div className="pt-6">
              <Link
                href={`/${tenantSlug}/announcements`}
                className="text-sm font-medium text-accent underline underline-offset-4"
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