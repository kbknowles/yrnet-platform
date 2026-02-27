// filepath: frontend/app/admin/announcements/page.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const EMPTY = {
  title: "",
  content: "",
  mode: "STANDARD",
  imageUrl: "",
  sortOrder: 0,
  published: false,
  eventId: "",
  seasonId: "",
  publishAt: "",
  expireAt: "",
  extras: "",
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [a, e, s] = await Promise.all([
      fetch(`${API_BASE}/api/admin/announcements`).then((r) => r.json()),
      fetch(`${API_BASE}/api/admin/events`).then((r) => r.json()),
      fetch(`${API_BASE}/api/admin/seasons`).then((r) => r.json()),
    ]);
    setAnnouncements(a || []);
    setEvents(e || []);
    setSeasons(s || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function save() {
    const payload = {
      ...active,
      eventId: active.eventId ? Number(active.eventId) : null,
      seasonId: active.seasonId ? Number(active.seasonId) : null,
      sortOrder: Number(active.sortOrder) || 0,
      content: active.content || "", // HTML supported
      published: Boolean(active.published),
      publishAt: active.publishAt ? new Date(active.publishAt) : null,
      expireAt: active.expireAt ? new Date(active.expireAt) : null,
      extras:
        active.extras && active.extras.trim()
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
    if (!id) return;
    if (!confirm("Delete this announcement?")) return;

    await fetch(`${API_BASE}/api/admin/announcements/${id}`, {
      method: "DELETE",
    });

    setActive(null);
    loadAll();
  }

  async function uploadPoster(file) {
    if (!file) return;

    setUploading(true);
    let announcement = active;

    if (!announcement.id) {
      const res = await fetch(`${API_BASE}/api/admin/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: announcement.title || "Untitled Poster",
          content: announcement.content || "",
          mode: "POSTER",
          published: false,
        }),
      });

      announcement = await res.json();
      setActive((prev) => ({ ...prev, id: announcement.id }));
    }

    const form = new FormData();
    form.append("file", file);

    const uploadRes = await fetch(
      `${API_BASE}/api/admin/announcements/upload/${announcement.id}/poster`,
      { method: "POST", body: form }
    );

    const data = await uploadRes.json();

    await fetch(`${API_BASE}/api/admin/announcements/${announcement.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...announcement,
        imageUrl: data.imageUrl,
      }),
    });

    setActive((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    setUploading(false);
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <button
          onClick={() => setActive({ ...EMPTY })}
          className="bg-ahsra-blue text-white px-4 py-2 rounded"
        >
          + New Announcement
        </button>
      </div>

      <table className="w-full bg-white text-sm border">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3">Mode</th>
            <th className="p-3">Published</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-3">{a.title}</td>
              <td className="p-3 text-center">{a.mode}</td>
              <td className="p-3 text-center">{a.published ? "✓" : "—"}</td>
              <td className="p-3 text-right space-x-3">
                <button
                  onClick={() =>
                    setActive({
                      ...a,
                      eventId: a.eventId ?? "",
                      seasonId: a.seasonId ?? "",
                      publishAt: a.publishAt?.slice(0, 16) || "",
                      expireAt: a.expireAt?.slice(0, 16) || "",
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

      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded p-6 space-y-4">
            <h2 className="font-semibold">
              {active.id ? "Edit Announcement" : "New Announcement"}
            </h2>

            <input
              className="w-full border p-2 rounded"
              placeholder="Title"
              value={active.title}
              onChange={(e) =>
                setActive({ ...active, title: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                className="border p-2 rounded"
                value={active.mode}
                onChange={(e) =>
                  setActive({ ...active, mode: e.target.value })
                }
              >
                <option value="STANDARD">Standard</option>
                <option value="POSTER">Poster</option>
              </select>

              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Sort order"
                value={active.sortOrder}
                onChange={(e) =>
                  setActive({ ...active, sortOrder: e.target.value })
                }
              />
            </div>

            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              placeholder={
                active.mode === "POSTER"
                  ? "Internal description"
                  : "Content (HTML allowed for links)"
              }
              value={active.content}
              onChange={(e) =>
                setActive({ ...active, content: e.target.value })
              }
            />

            {active.mode === "POSTER" && (
              <>
                {active.imageUrl && (
                  <p className="text-sm text-green-600">
                    Uploaded: {active.imageUrl}
                  </p>
                )}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  disabled={uploading}
                  onChange={(e) => uploadPoster(e.target.files?.[0])}
                />
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <select
                className="border p-2 rounded"
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
                className="border p-2 rounded"
                value={active.seasonId}
                onChange={(e) =>
                  setActive({ ...active, seasonId: e.target.value })
                }
              >
                <option value="">All Seasons</option>
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active.published}
                  onChange={(e) =>
                    setActive({ ...active, published: e.target.checked })
                  }
                />
                Published
              </label>

              <input
                type="datetime-local"
                className="border p-2 rounded"
                value={active.publishAt}
                onChange={(e) =>
                  setActive({ ...active, publishAt: e.target.value })
                }
              />

              <input
                type="datetime-local"
                className="border p-2 rounded"
                value={active.expireAt}
                onChange={(e) =>
                  setActive({ ...active, expireAt: e.target.value })
                }
              />
            </div>

            <textarea
              className="w-full border p-2 rounded font-mono text-xs"
              rows={3}
              placeholder="Extras (JSON)"
              value={active.extras}
              onChange={(e) =>
                setActive({ ...active, extras: e.target.value })
              }
            />

            <div className="flex justify-between pt-4">
              <button
                onClick={() => remove(active.id)}
                className="text-red-600"
              >
                Delete
              </button>
              <div className="space-x-3">
                <button
                  onClick={() => setActive(null)}
                  className="border px-4 py-2 rounded"
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
        </div>
      )}
    </div>
  );
}