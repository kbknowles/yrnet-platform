// filepath: frontend/app/admin/announcements.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  async function load() {
    const res = await fetch(`${API_BASE}/api/admin/announcements`);
    const data = await res.json();
    setAnnouncements(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const method = active.id ? "PUT" : "POST";
    const url = active.id
      ? `${API_BASE}/api/admin/announcements/${active.id}`
      : `${API_BASE}/api/admin/announcements`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });

    setActive(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete announcement?")) return;
    await fetch(`${API_BASE}/api/admin/announcements/${id}`, {
      method: "DELETE",
    });
    load();
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
              <th className="p-3">Order</th>
              <th className="p-3">Published</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{a.title}</td>
                <td className="p-3 capitalize">{a.type}</td>
                <td className="p-3 text-center">{a.sortOrder}</td>
                <td className="p-3 text-center">
                  {a.published ? "✓" : "—"}
                </td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => setActive(a)}
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
          <div className="bg-white w-full max-w-lg rounded shadow-lg p-6 space-y-4">
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
              rows={5}
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

              <input
                type="number"
                className="border rounded p-2"
                value={active.sortOrder}
                onChange={(e) =>
                  setActive({
                    ...active,
                    sortOrder: Number(e.target.value),
                  })
                }
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active.published}
                  onChange={(e) =>
                    setActive({
                      ...active,
                      published: e.target.checked,
                    })
                  }
                />
                Published
              </label>
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
