// filepath: frontend/app/admin/officers.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminOfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  async function load() {
    const res = await fetch(`${API_BASE}/api/admin/officers`);
    const data = await res.json();
    setOfficers(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const method = active.id ? "PUT" : "POST";
    const url = active.id
      ? `${API_BASE}/api/admin/officers/${active.id}`
      : `${API_BASE}/api/admin/officers`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });

    setActive(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete officer?")) return;
    await fetch(`${API_BASE}/api/admin/officers/${id}`, {
      method: "DELETE",
    });
    load();
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Officers</h1>
        <button
          onClick={() =>
            setActive({
              name: "",
              title: "",
              email: "",
              phone: "",
              bio: "",
              sortOrder: 0,
            })
          }
          className="bg-ahsra-blue text-white px-4 py-2 rounded"
        >
          + New Officer
        </button>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((o) => (
              <tr key={o.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{o.name}</td>
                <td className="p-3">{o.title}</td>
                <td className="p-3 text-sm text-slate-600">
                  {o.email || "—"}
                </td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => setActive(o)}
                    className="text-ahsra-blue"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(o.id)}
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
              {active.id ? "Edit Officer" : "New Officer"}
            </h2>

            <input
              className="w-full border rounded p-2"
              placeholder="Full Name"
              value={active.name}
              onChange={(e) =>
                setActive({ ...active, name: e.target.value })
              }
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Title / Role"
              value={active.title}
              onChange={(e) =>
                setActive({ ...active, title: e.target.value })
              }
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Email"
              value={active.email || ""}
              onChange={(e) =>
                setActive({ ...active, email: e.target.value })
              }
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Phone"
              value={active.phone || ""}
              onChange={(e) =>
                setActive({ ...active, phone: e.target.value })
              }
            />

            <textarea
              className="w-full border rounded p-2"
              rows={4}
              placeholder="Bio / Notes"
              value={active.bio || ""}
              onChange={(e) =>
                setActive({ ...active, bio: e.target.value })
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
