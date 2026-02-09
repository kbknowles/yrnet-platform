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
              className="border bg-white p-3 hover:shadow transition flex flex-col"
            >
              {/* Image */}
              <div className="w-full aspect-square bg-gray-100 rounded overflow-hidden">
                {a.headshotUrl && (
                  <img
                    src={a.headshotUrl}
                    alt={`${a.firstName} ${a.lastName}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-base mt-2 leading-tight">
                {a.firstName} {a.lastName}
              </h3>

              {a.bio && (
                <p className="text-sm mt-1 line-clamp-2">
                  {a.bio}
                </p>
              )}
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
