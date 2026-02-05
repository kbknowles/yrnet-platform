import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getAthlete(id) {
  const res = await fetch(`${API_BASE}/api/athletes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AthleteDetailPage(props) {
  const params = await props.params; // ✅ REQUIRED IN NEXT 15+
  const athlete = await getAthlete(params.id);

  if (!athlete || !athlete.isActive) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-xl font-semibold">Athlete not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      {/* HEADER */}
      <section className="grid md:grid-cols-3 gap-8 items-start">
        <div>
          {athlete.headshotUrl && (
            <Image
              src={athlete.headshotUrl}
              alt={`${athlete.firstName} ${athlete.lastName}`}
              width={400}
              height={400}
              className="rounded object-cover"
            />
          )}
        </div>

        <div className="md:col-span-2 space-y-3">
          <h1 className="text-3xl font-bold">
            {athlete.firstName} {athlete.lastName}
          </h1>

          <div className="text-sm text-gray-700 space-y-1">
            {athlete.school && (
              <div>
                <strong>School:</strong> {athlete.school}
              </div>
            )}
            {athlete.grade && (
              <div>
                <strong>Grade:</strong> {athlete.grade}
              </div>
            )}
            {athlete.hometown && (
              <div>
                <strong>Hometown:</strong> {athlete.hometown}
              </div>
            )}
          </div>

          {athlete.events?.length > 0 && (
            <div>
              <strong>Events:</strong>{" "}
              {athlete.events.map((e) => e.replaceAll("_", " ")).join(", ")}
            </div>
          )}
        </div>
      </section>

      {/* BIO */}
      {athlete.bio && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Athlete Bio</h2>
          <p className="leading-relaxed">{athlete.bio}</p>
        </section>
      )}

      {/* ACTION PHOTO */}
      {athlete.actionPhotoUrl && (
        <section>
          <Image
            src={athlete.actionPhotoUrl}
            alt="Action photo"
            width={900}
            height={500}
            className="rounded object-cover w-full"
          />
        </section>
      )}

      {/* AWARDS */}
      {Array.isArray(athlete.awards) && athlete.awards.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Awards & Achievements
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {athlete.awards.map((a, i) => (
              <li key={i}>
                {a.title}
                {a.year && ` (${a.year})`}
                {a.event && ` — ${a.event}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FUTURE GOALS */}
      {athlete.futureGoals && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Future Goals</h2>
          <p>{athlete.futureGoals}</p>
        </section>
      )}

      {/* SPONSORS */}
      {Array.isArray(athlete.sponsors) && athlete.sponsors.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Sponsors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {athlete.sponsors.map((s, i) => (
              <a
                key={i}
                href={s.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="border p-3 flex items-center justify-center bg-white"
              >
                {s.logoUrl ? (
                  <img
                    src={s.logoUrl}
                    alt={s.name}
                    className="max-h-16"
                  />
                ) : (
                  <span>{s.name}</span>
                )}
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
