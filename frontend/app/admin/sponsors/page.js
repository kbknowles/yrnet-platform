"use client";

import { useEffect, useState } from "react";
import SponsorForm from "./SponsorForm";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Sponsors Admin Page
 * Sponsor = Vendor Contact Record Only
 * Sponsorship levels/dates handled in Sponsorship module
 */
export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  async function fetchSponsors() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/sponsors`);
      if (!res.ok) throw new Error("Failed to fetch sponsors");

      const data = await res.json();
      setSponsors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error", err);
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
          onClick={() =>
            setEditing({
              name: "",
              website: "",
              description: "",
              contactName: "",
              contactEmail: "",
              contactPhone: "",
              internalNotes: "",
            })
          }
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Sponsor
        </button>
      </div>

      {error && (
        <div className="text-red-600 border p-3 rounded">
          {error}
        </div>
      )}

      {/* Sponsor Form (Create / Edit) */}
      {editing && (
        <SponsorForm
          sponsor={editing}
          onClose={() => setEditing(null)}
          onSaved={(savedSponsor) => {
            // Stay in edit mode after save so logo upload works
            setEditing(savedSponsor);
            fetchSponsors();
          }}
        />
      )}

      {/* Empty State */}
      {sponsors.length === 0 && !error && (
        <div className="border p-4 rounded text-gray-600">
          No sponsors found.
        </div>
      )}

      {/* Sponsor List */}
      {sponsors.length > 0 && (
        <div className="border rounded divide-y">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{s.name}</div>

                {/* Vendor-level info only */}
                <div className="text-sm text-gray-600">
                  {s.website || "No website provided"}
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
                    if (!confirm("Delete this sponsor?")) return;

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
      )}
    </div>
  );
}
