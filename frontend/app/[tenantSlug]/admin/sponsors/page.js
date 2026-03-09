"use client";

import { useEffect, useState } from "react";
import SponsorForm from "components/admin/SponsorForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState(null);

  async function fetchSponsors() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${tenantSlug}/admin/sponsors`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSponsors(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load sponsors.");
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sponsors</h1>

        <button
          onClick={() => {
            setEditingId(null);
            setShowAdd(!showAdd);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {showAdd ? "Close" : "Add Sponsor"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 border p-3 rounded">{error}</div>
      )}

      {/* Add Form (Top) */}
      {showAdd && (
        <div className="border rounded p-4 bg-gray-50">
          <SponsorForm
            sponsor={null}
            onClose={() => setShowAdd(false)}
            onSaved={() => {
              setShowAdd(false);
              fetchSponsors();
            }}
          />
        </div>
      )}

      {/* Sponsor List */}
      <div className="border rounded divide-y">
        {sponsors.map((s) => (
          <div key={s.id}>
            <div className="p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-600">
                  {s.website || "No website provided"}
                </div>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setEditingId(editingId === s.id ? null : s.id);
                  }}
                  className="px-3 py-1 border rounded"
                >
                  {editingId === s.id ? "Close" : "Edit"}
                </button>

                <button
                  onClick={async () => {
                    if (!confirm("Delete this sponsor?")) return;
                    await fetch(
                      `${API_BASE}/${tenantSlug}/admin/sponsors/${s.id}`,
                      { method: "DELETE" }
                    );
                    fetchSponsors();
                  }}
                  className="px-3 py-1 border rounded text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === s.id && (
              <div className="px-4 pb-6 bg-gray-50">
                <SponsorForm
                  sponsor={s}
                  onClose={() => setEditingId(null)}
                  onSaved={() => {
                    setEditingId(null);
                    fetchSponsors();
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
