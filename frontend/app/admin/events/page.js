// filepath: frontend/app/admin/events/page.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const EMPTY_EVENT = {
  name: "",
  slug: "",
  startDate: "",
  endDate: "",
  seasonId: "",
  locationId: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  async function loadAll() {
    const [eventsRes, seasonsRes, locationsRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/events`),
      fetch(`${API_BASE}/api/admin/seasons`),
      fetch(`${API_BASE}/api/admin/locations`),
    ]);

    setEvents(await eventsRes.json());
    setSeasons(await seasonsRes.json());
    setLocations(await locationsRes.json());
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function save() {
    const isEdit = Boolean(active.id);
    const url = isEdit
      ? `${API_BASE}/api/admin/events/${active.id}`
      : `${API_BASE}/api/admin/events`;

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...active,
        seasonId: Number(active.seasonId),
        locationId: Number(active.locationId),
      }),
    });

    setActive(null);
    loadAll();
  }

  async function remove(id) {
    if (!confirm("Delete this event?")) return;
    await fetch(`${API_BASE}/api/admin/events/${id}`, { method: "DELETE" });
    loadAll();
  }

  if (loading) return <p className="p-6">Loading events…</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Events</h1>
        <button
          onClick={() => setActive(structuredClone(EMPTY_EVENT))}
          className="bg-ahsra-blue text-white px-4 py-2 rounded"
        >
          + New Event
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Season</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Dates</th>
            <th className="border p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-2 font-medium">{e.name}</td>
              <td className="p-2">{e.season?.year || e.season?.name}</td>
              <td className="p-2">{e.location?.name}</td>
              <td className="p-2">
                {e.startDate.slice(0, 10)} → {e.endDate.slice(0, 10)}
              </td>
              <td className="p-2 text-right space-x-3">
                <button
                  onClick={() =>
                    setActive({
                      id: e.id,
                      name: e.name,
                      slug: e.slug,
                      startDate: e.startDate.slice(0, 10),
                      endDate: e.endDate.slice(0, 10),
                      seasonId: e.seasonId,
                      locationId: e.locationId,
                    })
                  }
                  className="text-ahsra-blue"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(e.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              {active.id ? "Edit Event" : "New Event"}
            </h2>

            <input
              className="w-full border p-2"
              placeholder="Event Name"
              value={active.name}
              onChange={(e) =>
                setActive({ ...active, name: e.target.value })
              }
            />

            <input
              className="w-full border p-2"
              placeholder="Slug"
              value={active.slug}
              onChange={(e) =>
                setActive({ ...active, slug: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                className="border p-2"
                value={active.seasonId}
                onChange={(e) =>
                  setActive({ ...active, seasonId: e.target.value })
                }
              >
                <option value="">Select Season</option>
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.year || s.name}
                  </option>
                ))}
              </select>

              <select
                className="border p-2"
                value={active.locationId}
                onChange={(e) =>
                  setActive({ ...active, locationId: e.target.value })
                }
              >
                <option value="">Select Location</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="border p-2"
                value={active.startDate}
                onChange={(e) =>
                  setActive({ ...active, startDate: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-2"
                value={active.endDate}
                onChange={(e) =>
                  setActive({ ...active, endDate: e.target.value })
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
