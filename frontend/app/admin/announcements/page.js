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
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [a, e, s] = await Promise.all([
      fetch(`${API_BASE}/api/admin/announcements`).then((r) => r.json()),
      fetch(`${API_BASE}/api/admin/events`).then((r) => r.json()),
      fetch(`${API_BASE}/api/admin/seasons`).then((r) => r.json()),
    ]);
    setAnnouncements(a);
    setEvents(e);
    setSeasons(s);
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
        active.extras && active.extras.trim()
          ? JSON.parse(active.extras)
          : null,
    };

    const method = active.id ? "PUT" : "POST";
    const url = active.id
      ? `${API_BASE}/api/admin/announcements/${active.id}`
      : `${API_BASE}/api/admin/announcements`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const saved = await res.json();

    setActive(null);
    loadAll();
  }

  async function uploadPoster(file, id) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(
      `${API_BASE}/api/admin/announcements/upload/${id}/poster`,
      { method: "POST", body: form }
    );

    const data = await res.json();
    setUploading(false);

    setActive((prev) => ({ ...prev, imageUrl: data.imageUrl }));
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
              <td className="p-3 text-right">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded p-6 space-y-4">
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

            {active.mode === "STANDARD" ? (
              <textarea
                className="w-full border p-2 rounded"
                rows={4}
                value={active.content}
                onChange={(e) =>
                  setActive({ ...active, content: e.target.value })
                }
              />
            ) : (
              <>
                {active.imageUrl && (
                  <p className="text-sm text-green-600">
                    Uploaded: {active.imageUrl}
                  </p>
                )}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  disabled={!active.id || uploading}
                  onChange={(e) =>
                    uploadPoster(e.target.files[0], active.id)
                  }
                />
                {!active.id && (
                  <p className="text-xs text-red-600">
                    Save first, then upload poster
                  </p>
                )}
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
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
      )}
    </div>
  );
}
