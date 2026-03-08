// filepath: frontend/app/[tenantSlug]/rodeos/[slug]/page.js

import Link from "next/link";
import { formatDate } from "lib/formatDate";
import MediaSwiper from "components/MediaSwiper";
import SponsorZone from "components/sponsorship/SponsorZone";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/*
  Convert plain URLs inside text into clickable links.
*/
function autoLink(text) {
  if (!text) return "";

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-rose-700 underline break-all">${url}</a>`
  );
}

/*
  Fetch rodeo from API.
*/
async function getRodeo(tenantSlug, slug) {
  if (!slug) return null;

  const res = await fetch(
    `${API_BASE}/${tenantSlug}/rodeos/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  return res.json();
}

export default async function RodeoPage({ params }) {
  /*
    Next.js 16 dynamic params must be awaited.
  */
  const { tenantSlug, slug } = await params;

  const rodeo = await getRodeo(tenantSlug, slug);

  if (!rodeo) {
    return <div className="p-10">Rodeo not found</div>;
  }

  const location = rodeo.location;

  const fullAddress =
    location?.streetAddress &&
    location?.city &&
    location?.state &&
    location?.zip
      ? `${location.streetAddress}, ${location.city}, ${location.state} ${location.zip}`
      : null;

  const announcements =
    rodeo.announcements?.slice().sort((a, b) => a.sortOrder - b.sortOrder) ||
    [];

  const posters = announcements.filter(
    (a) => a.mode === "POSTER" && a.imageUrl
  );

  const standardAnnouncements = announcements.filter(
    (a) => a.mode !== "POSTER"
  );

  return (
    <main className="bg-gray-50">

      {/* HERO */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 space-y-4">

          <h1 className="text-white text-4xl font-bold">{rodeo.name}</h1>

          <p className="text-lg text-gray-300">
            {formatDate(rodeo.startDate)}
            {rodeo.endDate && ` – ${formatDate(rodeo.endDate)}`}
          </p>

          {location?.name && (
            <p className="text-sm text-gray-300">
              {location.name}
            </p>
          )}

          <div className="flex flex-wrap gap-4 pt-4">

            <Link
              href={`/${tenantSlug}/schedule`}
              className="bg-rose-700 hover:bg-rose-800 text-white px-5 py-2 rounded-md text-sm font-medium"
            >
              Back to Schedule
            </Link>

            {fullAddress && (
              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(
                  fullAddress
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 hover:border-white px-5 py-2 rounded-md text-sm font-medium"
              >
                Get Directions
              </a>
            )}

          </div>

        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-12 space-y-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {rodeo.generalInfo && (
              <div className="bg-white rounded-lg shadow-sm border p-6">

                <h2 className="text-lg font-semibold mb-3 border-l-4 border-rose-700 pl-3">
                  General Information
                </h2>

                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: autoLink(rodeo.generalInfo),
                  }}
                />

              </div>
            )}

            {location && (
              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">

                <div>
                  <h2 className="text-lg font-semibold mb-3 border-l-4 border-rose-700 pl-3">
                    Location
                  </h2>

                  <p className="text-sm">
                    {location.name}
                    <br />
                    {fullAddress}
                  </p>
                </div>

                {fullAddress && (
                  <div className="space-y-3">

                    <div className="h-[260px] border rounded-md overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        loading="lazy"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          fullAddress
                        )}&output=embed`}
                      />
                    </div>

                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(
                        fullAddress
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-rose-700 hover:underline"
                    >
                      Open in Google Maps
                    </a>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-8">

            {posters.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <MediaSwiper items={posters} />
              </div>
            )}

            {standardAnnouncements.length > 0 && (
              <div className="space-y-5">

                <h2 className="text-xl font-semibold">
                  Announcements
                </h2>

                {standardAnnouncements.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white border rounded-lg shadow-sm p-6 border-l-4 border-rose-700"
                  >

                    {a.title && (
                      <div className="font-semibold mb-2">
                        {a.title}
                      </div>
                    )}

                    {a.content && (
                      <div
                        className="text-sm leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{
                          __html: autoLink(a.content),
                        }}
                      />
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </section>

      {/* SPONSORS */}
      <section className="bg-white/90 py-4">
        <div className="max-w-7xl mx-auto px-4 space-y-6">

          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Sponsors
          </h2>

          <div className="border-t-2 border-rose-700 w-20 mx-auto" />

          <SponsorZone
            tenantSlug={tenantSlug}
            contentType="SEASON"
            contentId={null}
            slots={4}
          />

        </div>
      </section>

    </main>
  );
}