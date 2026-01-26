import Link from "next/link";
import { formatDate } from "../../../lib/formatDate";

async function getEvent(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EventPage({ params }) {
  const event = await getEvent(params.slug);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{event.name}</h1>
      <p className="text-gray-600">
        {formatDate(event.startDate)} – {formatDate(event.endDate)}
      </p>

      <Link href="/schedule" className="underline">
        Back to schedule
      </Link>
    </main>
  );
}
