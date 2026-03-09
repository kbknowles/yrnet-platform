// filepath: frontend/app/admin/officers.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/* =========================
   ENUM OPTIONS
========================= */

const ROLE_OPTIONS = [
  // Adult – Executive
  { value: "PRESIDENT", label: "President" },
  { value: "VICE_PRESIDENT", label: "Vice President" },
  { value: "SECOND_VICE_PRESIDENT", label: "2nd Vice President" },
  { value: "SECRETARY", label: "Secretary" },
  { value: "TREASURER", label: "Treasurer" },
  { value: "POINTS_SECRETARY", label: "Points Secretary" },

  // Adult – Directors
  { value: "NATIONAL_DIRECTOR", label: "National Director" },
  { value: "STATE_DIRECTOR", label: "State Director" },
  { value: "REGION_DIRECTOR", label: "Region Director" },
  { value: "BOARD_MEMBER", label: "Board Member" },

  // Student
  { value: "STUDENT_PRESIDENT", label: "Student President" },
  { value: "STUDENT_VICE_PRESIDENT", label: "Student Vice President" },
  { value: "STUDENT_SECRETARY", label: "Student Secretary" },
  { value: "QUEEN", label: "Queen" },
  { value: "JH_PRINCESS", label: "JH Princess" },
];

const TYPE_OPTIONS = [
  { value: "EXECUTIVE", label: "Executive (Adult)" },
  { value: "DIRECTOR", label: "Director / Board" },
  { value: "STUDENT", label: "Student Officer" },
  { value: "STAFF", label: "Staff" },
];

/* =========================
   PAGE
========================= */

export default function AdminOfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  async function load() {
    setLoading(true);
    const [officerRes, seasonRes] = await Promise.all([
      fetch(`${API_BASE}/${tenantSlug}/admin/officers`),
      fetch(`${API_BASE}/${tenantSlug}/admin/seasons`),
    ]);

    setOfficers(await officerRes.json());
    setSeasons(await seasonRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const method = active.id ? "PUT" : "POST";
    const url = active.id
      ? `${API_BASE}/${tenantSlug}/admin/officers/${active.id}`
      : `${API_BASE}/${tenantSlug}/admin/officers`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: active.name,
        role: active.role,
        type: active.type,
        email: active.email || null,
        phone: active.phone || null,
        seasonId: parseInt(active.seasonId),
        active: active.active,
      }),
    });

    setActive(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete officer?")) return;
    await fetch(`${API_BASE}/${tenantSlug}/admin/officers/${id}`, {
      method: "DELETE",
    });
    load();
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Officers</h1>
        <button
          onClick={() =>
            setActive({
              name: "",
              role: "PRESIDENT",
              type: "EXECUTIVE",
              email: "",
              phone: "",
              seasonId: seasons.find(s => s.active)?.id || seasons[0]?.id,
              active: true,
            })
          }
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + New Officer
        </button>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Season</th>
              <th className="p-3 text-left">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {officers.map(o => (
              <tr key={o.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{o.name}</td>
                <td className="p-3">{o.role}</td>
                <td className="p-3">{o.type}</td>
                <td className="p-3">{o.season?.year}</td>
                <td className="p-3">{o.active ? "Yes" : "No"}</td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => setActive(o)}
                    className="text-primary"
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
              onChange={e => setActive({ ...active, name: e.target.value })}
            />

            <select
              className="w-full border rounded p-2"
              value={active.role}
              onChange={e => setActive({ ...active, role: e.target.value })}
            >
              {ROLE_OPTIONS.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <select
              className="w-full border rounded p-2"
              value={active.type}
              onChange={e => setActive({ ...active, type: e.target.value })}
            >
              {TYPE_OPTIONS.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <input
              className="w-full border rounded p-2"
              placeholder="Internal Email (not public)"
              value={active.email || ""}
              onChange={e => setActive({ ...active, email: e.target.value })}
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Phone (internal)"
              value={active.phone || ""}
              onChange={e => setActive({ ...active, phone: e.target.value })}
            />

            <select
              className="w-full border rounded p-2"
              value={active.seasonId}
              onChange={e =>
                setActive({ ...active, seasonId: e.target.value })
              }
            >
              {seasons.map(s => (
                <option key={s.id} value={s.id}>
                  {s.year} {s.active ? "(Current)" : ""}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active.active}
                onChange={e =>
                  setActive({ ...active, active: e.target.checked })
                }
              />
              Active
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
                className="bg-primary text-white px-4 py-2 rounded"
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
