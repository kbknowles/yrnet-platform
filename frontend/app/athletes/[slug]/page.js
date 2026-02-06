import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function normalizeImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

async function getAthlete(slug) {
  const res = await fetch(`${API_BASE}/api/athletes/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AthleteDetailPage(props) {
  const params = await props.params;
  const athlete = await getAthlete(params.slug);

  if (!athlete) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-xl font-semibold">Athlete not found</h1>
      </main>
    );
  }

  const headshot = normalizeImageUrl(athlete.headshotUrl);
  const actionPhoto = normalizeImageUrl(athlete.actionPhotoUrl);

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <section className="grid md:grid-cols-3 gap-8">
        {headshot && (
          <Image
            src={headshot}
            alt={`${athlete.firstName} ${athlete.lastName}`}
            width={400}
            height={400}
            className="rounded object-cover"
          />
        )}

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">
            {athlete.firstName} {athlete.lastName}
          </h1>

          {athlete.events?.length > 0 && (
            <p className="mt-2">
              <strong>Events:</strong>{" "}
              {athlete.events.map(e => e.replaceAll("_", " ")).join(", ")}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
