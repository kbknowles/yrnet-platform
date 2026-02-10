// filepath: frontend/app/events/[slug]/page.js
import Link from "next/link";
import { formatDate } from "../../../lib/formatDate";
import MediaSwiper from "../../../components/MediaSwiper";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getEvent(slug) {
  const res = await fetch(
    `${API_BASE}/api/events/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function EventPage({ params }) {
  const { slug } = params;
  const event = await getEvent(slug);

  if (!event) return <div className="p-10">Event not found</div>;

  const posters =
    event.announcements?.filter(
      (a) => a.mode === "POSTER" && a.imageUrl
    ) || [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <section>
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-gray-600">
          {formatDate(event.startDate)}
          {event.endDate && ` – ${formatDate(event.endDate)}`}
        </p>
      </section>

      {posters.length > 0 && (
        <MediaSwiper items={posters} />
      )}

      <Link href="/schedule" className="underline">
        Back to schedule
      </Link>
    </main>
  );
}
