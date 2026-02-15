import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "../../../lib/formatDate";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getEvent(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/events/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function EventPage({ params }) {
  const { slug } = await params;

  if (!slug) notFound();

  const event = await getEvent(slug);

  if (!event) notFound();

  const location = event.location;

  const fullAddress =
    location?.streetAddress &&
    location?.city &&
    location?.state &&
    location?.zip
      ? `${location.streetAddress}, ${location.city}, ${location.state} ${location.zip}`
      : null;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <section>
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-gray-600">
          {formatDate(event.startDate)}
          {event.endDate && ` – ${formatDate(event.endDate)}`}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {event.generalInfo && (
            <div>
              <h2 className="font-semibold mb-2">General Info</h2>
              <p className="whitespace-pre-line text-sm">
                {event.generalInfo}
              </p>
            </div>
          )}

          {location && (
            <div>
              <h2 className="font-semibold mb-2">Location</h2>
              <p className="text-sm">
                {location.name}
                {fullAddress && (
                  <>
                    <br />
                    {fullAddress}
                  </>
                )}
              </p>

              {fullAddress && (
                <div className="mt-3 h-[220px] border rounded overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      fullAddress
                    )}&output=embed`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Link href="/schedule" className="underline">
        Back to schedule
      </Link>
    </main>
  );
}
