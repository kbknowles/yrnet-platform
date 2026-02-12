"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  async function fetchSponsors() {
    try {
      const res = await fetch(`${API_BASE}/api/sponsors`);
      const data = await res.json();
      setSponsors(data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSponsors();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sponsors</h1>
        <button
          onClick={() => setEditing({})}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Sponsor
        </button>
      </div>

      {editing && (
        <SponsorForm
          sponsor={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchSponsors();
          }}
        />
      )}

      <div className="border rounded divide-y">
        {sponsors.map((s) => (
          <div key={s.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">
                {s.tier} | {new Date(s.startDate).toLocaleDateString()} -{" "}
                {new Date(s.endDate).toLocaleDateString()}
              </div>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => setEditing(s)}
                className="px-3 py-1 border rounded"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await fetch(`${API_BASE}/api/sponsors/${s.id}`, {
                    method: "DELETE",
                  });
                  fetchSponsors();
                }}
                className="px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
