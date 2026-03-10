// filepath: frontend/app/[tenantSlug]/athletes/page.js

import Link from "next/link";
import SponsorZone from "components/sponsorship/SponsorZone";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveAthleteImage(filename, tenantSlug) {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;

  const clean = filename.replace(/^\/+/, "");

  return `${API_BASE}/uploads/tenants/${tenantSlug}/images/${clean}`;
}

async function getHomeData(tenantSlug) {
  const res = await fetch(`${API_BASE}/${tenantSlug}/home`, {
    cache: "no-store",
  });

  if (!res.ok) return { tenant: null };

  return res.json();
}

async function getAthletes(tenantSlug) {
  const res = await fetch(`${API_BASE}/${tenantSlug}/athletes`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

function formatEvent(label) {
  if (!label) return "";

  return label
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function AthletesPage({ params }) {
  const { tenantSlug } = await params;

  const [homeData, athletes] = await Promise.all([
    getHomeData(tenantSlug),
    getAthletes(tenantSlug),
  ]);

  const tenant = homeData?.tenant;

  const safeAthletes = Array.isArray(athletes) ? athletes : [];

  const activeAthletes = safeAthletes
    .filter((a) => a?.isActive && a?.slug)
    .sort((a, b) => {
      const last = (a.lastName || "").localeCompare(b.lastName || "");
      if (last !== 0) return last;
      return (a.firstName || "").localeCompare(b.firstName || "");
    });

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="hero bg-secondary">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Athletes
          </h1>

          <div className="w-24 h-1 bg-accent mx-auto" />

          <p className="mx-auto text-white/90 mb-6 text-lg lg:text-xl sm:px-16 xl:px-48">
            Discover the student athletes building their rodeo legacy through{" "}
            {tenant?.slug?.toUpperCase() || "our association"}.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {activeAthletes.length === 0 ? (
          <p>No athletes available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeAthletes.map((a) => (
              <Link
                key={a.slug}
                href={`/${tenantSlug}/athletes/${a.slug}`}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition block"
              >
                {a.headshotUrl && (
                  <div className="w-full aspect-square bg-gray-100 rounded mb-4 overflow-hidden">
                    <img
                      src={resolveAthleteImage(a.headshotUrl, tenantSlug)}
                      alt={`${a.firstName} ${a.lastName}`}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                )}

                <h3 className="font-semibold text-base leading-tight">
                  {a.firstName} {a.lastName}
                </h3>

                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  {a.grade && <div>Grade {a.grade}</div>}

                  {Array.isArray(a.events) && a.events.length > 0 && (
                    <div className="text-xs text-gray-600 leading-snug">
                      {a.events.map(formatEvent).join(", ")}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="max-w-4xl pt-6 border-t text-sm text-gray-600">
          Athlete profiles are optional and designed to support college
          recruiting and sponsorship visibility.
        </div>
      </section>

      {/* SPONSORS */}
      <section className="bg-white/90 py-4">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Sponsors
          </h2>

          <div className="border-t-2 border-rose-700 w-20 mx-auto" />

          <SponsorZone   tenantSlug={tenantSlug} contentType="SEASON" contentId={null} slots={4} />
        </div>
      </section>
    </main>
  );
}