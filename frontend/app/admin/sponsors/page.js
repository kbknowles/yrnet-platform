// filepath: frontend/app/admin/sponsors.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  async function load() {
    const res = await fetch(`${API_BASE}/api/admin/sponsors`);
    const data = await res.json();
    setSponsors(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const method = active.id ? "PUT" : "POST";
    const url = active.id
      ? `${API_BASE}/api/admin/sponsors/${active.id}`
      : `${API_BASE}/api/admin/sponsors`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });

    setActive(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete sponsor?")) return;
    await fetch(`${API_BASE}/api/admin/sponsors/${id}`, {
      method: "DELETE",
    });
    load();
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Sponsors</h1>
        <button
          onClick={() =>
            setActive({
              name: "",
              website: "",
              logoUrl: "",
              active: true,
              sortOrder: 0,
            })
          }
          className="bg-ahsra-blue text-white px-4 py-2 rounded"
        >
          + New Sponsor
        </button>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Website</th>
              <th className="p-3 text-center">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3 text-slate-600 text-sm">
                  {s.website || "—"}
                </td>
                <td className="p-3 text-center">
                  {s.active ? "✓" : "—"}
                </td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => setActive(s)}
                    className="text-ahsra-blue"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              {active.id ? "Edit Sponsor" : "New Sponsor"}
            </h2>

            <input
              className="w-full border rounded p-2"
              placeholder="Sponsor Name"
              value={active.name}
              onChange={(e) =>
                setActive({ ...active, name: e.target.value })
              }
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Website URL"
              value={active.website || ""}
              onChange={(e) =>
                setActive({ ...active, website: e.target.value })
              }
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Logo URL"
              value={active.logoUrl || ""}
              onChange={(e) =>
                setActive({ ...active, logoUrl: e.target.value })
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active.active}
                onChange={(e) =>
                  setActive({ ...active, active: e.target.checked })
                }
              />
              Active sponsor
            </label>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setActive(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-ahsra-blue text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
