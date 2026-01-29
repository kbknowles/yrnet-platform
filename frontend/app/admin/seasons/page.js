// filepath: frontend/app/admin/seasons/page.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const EMPTY_SEASON = {
  name: "",
  slug: "",
  startYear: "",
  endYear: "",
  isActive: false,
};

export default function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  async function load() {
    const res = await fetch(`${API_BASE}/api/admin/seasons`);
    setSeasons(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function normalizePayload(s) {
    return {
      name: s.name,
      slug: s.slug,
      startYear: Number(s.startYear),
      endYear: Number(s.endYear),
      isActive: Boolean(s.isActive),
    };
  }

  async function save() {
    const isEdit = Boolean(active.id);
    const url = isEdit
      ? `${API_BASE}/api/admin/seasons/${active.id}`
      : `${API_BASE}/api/admin/seasons`;

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizePayload(active)),
    });

    setActive(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete season?")) return;
    await fetch(`${API_BASE}/api/admin/seasons/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Seasons</h1>
        <button
          onClick={() => setActive(structuredClone(EMPTY_SEASON))}
          className="bg-ahsra-blue text-white px-4 py-2 rounded"
        >
          + New Season
        </button>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Years</th>
              <th className="p-3 text-left">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.slug}</td>
                <td className="p-3">
                  {s.startYear}–{s.endYear}
                </td>
                <td className="p-3">
                  {s.isActive ? "Yes" : "No"}
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

      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              {active.id ? "Edit Season" : "New Season"}
            </h2>

            <input
              className="w-full border rounded p-2"
              placeholder="Season Name"
              value={active.name}
              onChange={(e) =>
                setActive({ ...active, name: e.target.value })
              }
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Slug"
              value={active.slug}
              onChange={(e) =>
                setActive({ ...active, slug: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                className="border rounded p-2"
                placeholder="Start Year"
                value={active.startYear}
                onChange={(e) =>
                  setActive({ ...active, startYear: e.target.value })
                }
              />
              <input
                className="border rounded p-2"
                placeholder="End Year"
                value={active.endYear}
                onChange={(e) =>
                  setActive({ ...active, endYear: e.target.value })
                }
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active.isActive}
                onChange={(e) =>
                  setActive({ ...active, isActive: e.target.checked })
                }
              />
              Active Season
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
