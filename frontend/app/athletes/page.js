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
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold">Athletes</h1>
        <p className="mt-3 text-gray-700">
          Athlete profiles provide colleges and sponsors with detailed
          information about AHSRA athletes who choose to participate.
        </p>
      </section>

      {/* Page-Level Sponsor Zone */}
      <SponsorZone
        contentType="ATHLETE"
        contentId={null}
        slots={4}
      />

      {activeAthletes.length === 0 ? (
        <p>No athletes available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
          {activeAthletes.map((a, index) => (
            <div key={a.slug} className="space-y-3">
              <Link
                href={`/athletes/${a.slug}`}
                className="border bg-white p-3 hover:shadow transition space-y-3 block"
              >
                {a.headshotUrl && (
                  <img
                    src={resolveImage(a.headshotUrl)}
                    alt={`${a.firstName} ${a.lastName}`}
                    className="w-full h-auto object-contain bg-gray-100 rounded"
                  />
                )}

                <h3 className="font-semibold text-base leading-tight">
                  {a.firstName} {a.lastName}
                </h3>

                <div className="text-sm text-gray-700 space-y-1">
                  {a.grade && <div>Grade {a.grade}</div>}
                  {a.events?.length > 0 && (
                    <div className="text-xs text-gray-600 leading-snug">
                      {a.events.map(formatEvent).join(", ")}
                    </div>
                  )}
                </div>
              </Link>

              {/* Athlete-Level Sponsor Zone (Direct + Backfill) */}
              <SponsorZone
                contentType="ATHLETE"
                contentId={a.id}
                slots={1}
              />
            </div>
          ))}
        </div>
      )}

      <section className="max-w-4xl pt-6 border-t">
        <p className="text-sm text-gray-600">
          Athlete profiles are optional and designed to support college
          recruiting and sponsorship visibility.
        </p>
      </section>
    </main>
  );
}
