import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getAthletes() {
  const res = await fetch(`${API_BASE}/api/admin/athletes`, { cache: "no-store" });
  return res.json();
}

export default async function AthletesAdminPage() {
  const athletes = await getAthletes();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Athletes</h1>
        <Link href="/admin/athletes/new" className="btn-primary">
          Add Athlete
        </Link>
      </div>

      <ul className="divide-y bg-white border">
        {athletes.map((a) => (
          <li key={a.id} className="p-4 flex justify-between">
            <span>{a.firstName} {a.lastName}</span>
            <Link href={`/admin/athletes/${a.id}`} className="text-ahsra-blue">
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
