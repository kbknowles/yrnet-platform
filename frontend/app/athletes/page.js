// filepath: frontend/app/athletes/page.js

import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getAthletes() {
  const res = await fetch(`${API_BASE}/api/athletes`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

/* Convert ENUM_LIKE values to readable labels */
function formatEvent(label) {
  return label
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function AthletesPage() {
  const athletes = await getAthletes();

  const activeAthletes = athletes
    .filter((a) => a.isActive && a.slug)
    .sort((a, b) => {
      const last = a.lastName.localeCompare(b.lastName);
      if (last !== 0) return last;
      return a.firstName.localeCompare(b.firstName);
    });

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold">Athletes</h1>
        <p className="mt-3 text-gray-700">
          Athlete profiles provide colleges and sponsors with detailed
          information about AHSRA athletes who choose to participate.
        </p>
      </section>

      {/* Grid */}
      {activeAthletes.length === 0 ? (
        <p>No athletes available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {activeAthletes.map((a) => (
            <Link
              key={a.slug}
              href={`/athletes/${a.slug}`}
              className="border bg-white p-3 hover:shadow transition space-y-2"
            >
              {/* Image (full image, scaled down — no crop) */}
              <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {a.headshotUrl && (
                  <img
                    src={a.headshotUrl}
                    alt={`${a.firstName} ${a.lastName}`}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              {/* Name */}
              <h3 className="font-semibold text-base leading-tight">
                {a.firstName} {a.lastName}
              </h3>

              {/* Meta */}
              <div className="text-sm text-gray-700 space-y-1">
                {a.grade && <div>Grade {a.grade}</div>}

                {a.events?.length > 0 && (
                  <div className="text-xs text-gray-600 leading-snug">
                    {a.events.map(formatEvent).join(", ")}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Participation Note */}
      <section className="max-w-4xl pt-6 border-t">
        <p className="text-sm text-gray-600">
          Athlete profiles are an optional service designed to support college
          recruiting and sponsorship visibility. Not all AHSRA athletes
          maintain an athlete profile.
        </p>
      </section>
    </main>
  );
}
