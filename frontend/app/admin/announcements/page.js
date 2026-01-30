// filepath: frontend/app/admin/announcements.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  async function loadAll() {
    setLoading(true);

    const [aRes, eRes, sRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/announcements`),
      fetch(`${API_BASE}/api/admin/events`),
      fetch(`${API_BASE}/api/admin/seasons`),
    ]);

    const [aData, eData, sData] = await Promise.all([
      aRes.json(),
      eRes.json(),
      sRes.json(),
    ]);

    setAnnouncements(aData);
    setEvents(eData);
    setSeasons(sData);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function save() {
    const payload = {
      ...active,
      eventId: active.eventId || null,
      seasonId: active.seasonId || null,
      extras:
        typeof active.extras === "string" && active.extras.trim()
          ? JSON.parse(active.extras)
          : null,
    };

    const method = active.id ? "PUT" : "POST";
    const url = active.id
      ? `${API_BASE}/api/admin/announcements/${active.id}`
      : `${API_BASE}/api/admin/announcements`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setActive(null);
    loadAll();
  }

  async function remove(id) {
    if (!confirm("Delete announcement?")) return;
    await fetch(`${API_BASE}/api/admin/announcements/${id}`, {
      method: "DELETE",
    });
    loadAll();
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <button
          onClick={() =>
            setActive({
              title: "",
              content: "",
              type: "general",
              sortOrder: 0,
              published: false,
              eventId: "",
              seasonId: "",
              publishAt: "",
              expireAt: "",
              extras: "",
            })
          }
          className="bg-ahsra-blue text-white px-4 py-2 rounded"
        >
          + New Announcement
        </button>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Event</th>
              <th className="p-3">Season</th>
              <th className="p-3">Published</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{a.title}</td>
                <td className="p-3 capitalize">{a.type}</td>
                <td className="p-3">
                  {events.find((e) => e.id === a.eventId)?.name || "—"}
                </td>
                <td className="p-3">
                  {seasons.find((s) => s.id === a.seasonId)?.name || "—"}
                </td>
                <td className="p-3 text-center">
                  {a.published ? "✓" : "—"}
                </td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() =>
                      setActive({
                        ...a,
                        eventId: a.eventId ?? "",
                        seasonId: a.seasonId ?? "",
                        publishAt: a.publishAt
                          ? a.publishAt.slice(0, 16)
                          : "",
                        expireAt: a.expireAt
                          ? a.expireAt.slice(0, 16)
                          : "",
                        extras: a.extras
                          ? JSON.stringify(a.extras, null, 2)
                          : "",
                      })
                    }
                    className="text-ahsra-blue"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(a.id)}
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
          <div className="bg-white w-full max-w-2xl rounded shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              {active.id ? "Edit Announcement" : "New Announcement"}
            </h2>

            <input
              className="w-full border rounded p-2"
              placeholder="Title"
              value={active.title}
              onChange={(e) =>
                setActive({ ...active, title: e.target.value })
              }
            />

            <textarea
              className="w-full border rounded p-2"
              rows={4}
              placeholder="Content"
              value={active.content}
              onChange={(e) =>
                setActive({ ...active, content: e.target.value })
              }
            />

            <div className="grid grid-cols-3 gap-4">
              <select
                className="border rounded p-2"
                value={active.type}
                onChange={(e) =>
                  setActive({ ...active, type: e.target.value })
                }
              >
                <option value="general">General</option>
                <option value="entry">Entry</option>
                <option value="stall">Stall</option>
                <option value="reminder">Reminder</option>
              </select>

              <select
                className="border rounded p-2"
                value={active.eventId}
                onChange={(e) =>
                  setActive({ ...active, eventId: e.target.value })
                }
              >
                <option value="">All Events</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>

              <select
                className="border rounded p-2"
                value={active.seasonId}
                onChange={(e) =>
                  setActive({ ...active, seasonId: e.target.value })
                }
              >
                <option value="">All Seasons</option>
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="datetime-local"
                className="border rounded p-2"
                value={active.publishAt}
                onChange={(e) =>
                  setActive({ ...active, publishAt: e.target.value })
                }
              />

              <input
                type="datetime-local"
                className="border rounded p-2"
                value={active.expireAt}
                onChange={(e) =>
                  setActive({ ...active, expireAt: e.target.value })
                }
              />
            </div>

            <textarea
              className="w-full border rounded p-2 font-mono text-xs"
              rows={4}
              placeholder="Extras (JSON)"
              value={active.extras}
              onChange={(e) =>
                setActive({ ...active, extras: e.target.value })
              }
            />

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
