// filepath: frontend/app/athletes/[slug]/page.js

import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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

  if (!athlete) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-xl font-semibold">Athlete not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* HEADER */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {athlete.headshotUrl && (
          <div className="w-full aspect-square border rounded bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src={athlete.headshotUrl}
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

          <div className="text-sm space-y-1">
            {athlete.school && <p><strong>School:</strong> {athlete.school}</p>}
            {athlete.grade && <p><strong>Grade:</strong> {athlete.grade}</p>}
            {athlete.hometown && <p><strong>Hometown:</strong> {athlete.hometown}</p>}
          </div>

          {athlete.events?.length > 0 && (
            <p className="text-sm">
              <strong>Events:</strong>{" "}
              {athlete.events.map(e => e.replaceAll("_", " ")).join(", ")}
            </p>
          )}
        </div>
      </section>

      {athlete.bio && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Athlete Bio</h2>
          <p>{athlete.bio}</p>
        </section>
      )}

      {athlete.futureGoals && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Future Goals</h2>
          <p>{athlete.futureGoals}</p>
        </section>
      )}

      {athlete.actionPhotoUrl && (
        <section>
          <h2 className="text-xl font-semibold mb-3">In Action</h2>
          <div className="w-full max-h-[420px] aspect-[16/9] border rounded bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src={athlete.actionPhotoUrl}
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
