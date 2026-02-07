// filepath: frontend/app/athletes/page.js

import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getAthletes() {
  const res = await fetch(`${API_BASE}/api/admin/athletes`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function AthleteSpotlightPage() {
  const athletes = await getAthletes();

  const activeAthletes = athletes.filter((a) => a.isActive);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Athlete Spotlights</h1>

      {activeAthletes.length === 0 && (
        <p>No athletes available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeAthletes.map((a) => (
          <Link
            key={a.slug}
            href={`/athletes/${a.slug}`}
            className="border bg-white p-4 hover:shadow transition"
          >
            {a.headshotUrl && (
              <img
                src={a.headshotUrl}
                alt={`${a.firstName} ${a.lastName}`}
                className="w-full h-64 object-cover rounded"
              />
            )}

            <h3 className="font-bold text-lg mt-3">
              {a.firstName} {a.lastName}
            </h3>

            {a.bio && (
              <p className="text-sm mt-2 line-clamp-3">
                {a.bio}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
