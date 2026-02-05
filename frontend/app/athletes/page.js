const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getAthletes() {
  const res = await fetch(`${API_BASE}/api/admin/athletes`, { cache: "no-store" });
  return res.json();
}

export default async function AthleteSpotlightPage() {
  const athletes = await getAthletes();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
      {athletes.filter(a => a.isActive).map(a => (
        <div key={a.id} className="border p-4 bg-white">
          {a.headshotUrl && <img src={a.headshotUrl} />}
          <h3 className="font-bold mt-2">{a.firstName} {a.lastName}</h3>
          <p className="text-sm">{a.bio}</p>
        </div>
      ))}
    </main>
  );
}
