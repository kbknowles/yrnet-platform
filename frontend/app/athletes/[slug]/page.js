import Image from "next/image";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

async function getAthlete(slug) {
  const res = await fetch(`${API_BASE}/api/athletes/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AthleteDetailPage(props) {
  const { slug } = await props.params;
  const athlete = await getAthlete(slug);

  if (!athlete || !athlete.isActive) {
    notFound();
  }

  const sponsors =
    athlete.athleteSponsors?.map((link) => link.sponsor) || [];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">

      {/* Header Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {athlete.headshotUrl && (
          <div className="w-full aspect-square border rounded bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src={resolveImage(athlete.headshotUrl)}
              alt={`${athlete.firstName} ${athlete.lastName}`}
              width={300}
              height={300}
              unoptimized
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        <div className="md:col-span-3 space-y-3">
          <h1 className="text-3xl font-bold">
            {athlete.firstName} {athlete.lastName}
          </h1>

          {athlete.school && <p><strong>School:</strong> {athlete.school}</p>}
          {athlete.grade && <p><strong>Grade:</strong> {athlete.grade}</p>}
          {athlete.hometown && <p><strong>Hometown:</strong> {athlete.hometown}</p>}

          {athlete.events?.length > 0 && (
            <p>
              <strong>Events:</strong>{" "}
              {athlete.events.map(e => e.replaceAll("_", " ")).join(", ")}
            </p>
          )}
        </div>
      </section>

      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Athlete Sponsors
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sponsors.slice(0, 4).map((s) => (
              <a
                key={s.id}
                href={s.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-900 bg-white rounded p-4 flex items-center justify-center"
              >
                {s.logoUrl ? (
                  <Image
                    src={resolveImage(s.logoUrl)}
                    alt={s.name}
                    width={200}
                    height={100}
                    unoptimized
                    className="max-h-16 object-contain"
                  />
                ) : (
                  <span className="text-ahsra-blue font-semibold text-center">
                    {s.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Bio */}
      {athlete.bio && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Athlete Bio</h2>
          <p>{athlete.bio}</p>
        </section>
      )}

      {/* Future Goals */}
      {athlete.futureGoals && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Future Goals</h2>
          <p>{athlete.futureGoals}</p>
        </section>
      )}

      {/* Action Photo */}
      {athlete.actionPhotoUrl && (
        <section>
          <h2 className="text-xl font-semibold mb-3">In Action</h2>
          <div className="w-full max-h-[420px] aspect-[16/9] border rounded bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src={resolveImage(athlete.actionPhotoUrl)}
              alt="Action shot"
              width={900}
              height={500}
              unoptimized
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </section>
      )}
    </main>
  );
}
