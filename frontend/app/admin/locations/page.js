// filepath: frontend/app/admin/locations.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  async function load() {
    const res = await fetch(`${API_BASE}/api/admin/locations`);
    const data = await res.json();
    setLocations(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const method = active.id ? "PUT" : "POST";
    const url = active.id
      ? `${API_BASE}/api/admin/locations/${active.id}`
      : `${API_BASE}/api/admin/locations`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });

    setActive(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete location?")) return;
    await fetch(`${API_BASE}/api/admin/locations/${id}`, {
      method: "DELETE",
    });
    load();
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Locations</h1>
        <button
          onClick={() =>
            setActive({
              name: "",
              city: "",
              state: "AL",
              address: "",
              venueInfo: {
                stalls: "",
                hookups: "",
                parking: "",
                notes: "",
              },
            })
          }
          className="bg-ahsra-blue text-white px-4 py-2 rounded"
        >
          + New Location
        </button>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l) => (
              <tr key={l.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{l.name}</td>
                <td className="p-3">{l.city}</td>
                <td className="p-3">{l.state}</td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => setActive(l)}
                    className="text-ahsra-blue"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(l.id)}
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
          <div className="bg-white w-full max-w-xl rounded shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              {active.id ? "Edit Location" : "New Location"}
            </h2>

            <input
              className="w-full border rounded p-2"
              placeholder="Location Name"
              value={active.name}
              onChange={(e) =>
                setActive({ ...active, name: e.target.value })
              }
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Street Address"
              value={active.address || ""}
              onChange={(e) =>
                setActive({ ...active, address: e.target.value })
              }
            />

            <div className="grid grid-cols-3 gap-4">
              <input
                className="border rounded p-2"
                placeholder="City"
                value={active.city}
                onChange={(e) =>
                  setActive({ ...active, city: e.target.value })
                }
              />
              <input
                className="border rounded p-2"
                placeholder="State"
                value={active.state}
                onChange={(e) =>
                  setActive({ ...active, state: e.target.value })
                }
              />
            </div>

            <div className="border rounded p-4 bg-slate-50 space-y-3">
              <h3 className="font-medium text-sm">Venue Info</h3>

              <input
                className="w-full border rounded p-2"
                placeholder="Stalls"
                value={active.venueInfo?.stalls || ""}
                onChange={(e) =>
                  setActive({
                    ...active,
                    venueInfo: {
                      ...active.venueInfo,
                      stalls: e.target.value,
                    },
                  })
                }
              />

              <input
                className="w-full border rounded p-2"
                placeholder="Hookups"
                value={active.venueInfo?.hookups || ""}
                onChange={(e) =>
                  setActive({
                    ...active,
                    venueInfo: {
                      ...active.venueInfo,
                      hookups: e.target.value,
                    },
                  })
                }
              />

              <input
                className="w-full border rounded p-2"
                placeholder="Parking"
                value={active.venueInfo?.parking || ""}
                onChange={(e) =>
                  setActive({
                    ...active,
                    venueInfo: {
                      ...active.venueInfo,
                      parking: e.target.value,
                    },
                  })
                }
              />

              <textarea
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Notes"
                value={active.venueInfo?.notes || ""}
                onChange={(e) =>
                  setActive({
                    ...active,
                    venueInfo: {
                      ...active.venueInfo,
                      notes: e.target.value,
                    },
                  })
                }
              />
            </div>

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
