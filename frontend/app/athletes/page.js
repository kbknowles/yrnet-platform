// filepath: frontend/app/athletes/page.js

import Link from "next/link";
import SponsorZone from "../../components/sponsorship/SponsorZone";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

async function getAthletes() {
  const res = await fetch(`${API_BASE}/api/athletes`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

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
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="bg-ahsra-blue/95 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-4">
          <h1 className="text-4xl font-bold">Athletes</h1>
          <p className="max-w-2xl text-white/90">
            Athlete profiles provide colleges and sponsors with detailed
            information about AHSRA athletes who choose to participate.
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
                href={`/athletes/${a.slug}`}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition block"
              >
                {a.headshotUrl && (
                  <img
                    src={resolveImage(a.headshotUrl)}
                    alt={`${a.firstName} ${a.lastName}`}
                    className="w-full aspect-square object-cover bg-gray-100 rounded mb-4"
                  />
                )}

                <h3 className="font-semibold text-base leading-tight">
                  {a.firstName} {a.lastName}
                </h3>

                <div className="text-sm text-gray-700 mt-2 space-y-1">
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

        <div className="max-w-4xl pt-6 border-t text-sm text-gray-600">
          Athlete profiles are optional and designed to support college
          recruiting and sponsorship visibility.
        </div>
      </section>

      {/* SPONSORS */}
      <section className="bg-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Sponsors
          </h2>

          <SponsorZone
            contentType="ATHLETE"
            contentId={null}
            slots={4}
          />
        </div>
      </section>
    </main>
  );
}
