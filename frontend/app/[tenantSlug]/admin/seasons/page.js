// filepath: frontend/app/admin/seasons/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import authFetch from "../../../../utils/authFetch";


const EMPTY_SEASON = {
  year: "",
  startDate: "",
  endDate: "",
  active: false,
};

export default function AdminSeasonsPage() {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [authorized, setAuthorized] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push(`/${tenantSlug || ""}`);
      return;
    }
    setAuthorized(true);
  }, [tenantSlug, router]);

  async function load() {
    if (!tenantSlug) return;

    setLoading(true);

    try {
      const res = await authFetch(
        `/${tenantSlug}/admin/seasons`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        router.push(`/${tenantSlug}`);
        return;
      }

      const data = await res.json();
      setSeasons(Array.isArray(data) ? data : []);
    } catch {
      setSeasons([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) load();
  }, [tenantSlug, authorized]);

  async function save() {
    if (!active || !tenantSlug) return;

    const isEdit = Boolean(active.id);

    const url = isEdit
      ? `/${tenantSlug}/admin/seasons/${active.id}`
      : `/${tenantSlug}/admin/seasons`;

    await authFetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });

    setActive(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete season?") || !tenantSlug) return;

    const res = await authFetch(
      `/${tenantSlug}/admin/seasons/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
      return;
    }

    load();
  }

  if (!authorized) return null;
  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Seasons</h1>
        <button
          onClick={() => setActive(structuredClone(EMPTY_SEASON))}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + New Season
        </button>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3">Year</th>
              <th className="p-3">Start</th>
              <th className="p-3">End</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.year}</td>
                <td className="p-3">{s.startDate?.slice(0, 10)}</td>
                <td className="p-3">{s.endDate?.slice(0, 10)}</td>
                <td className="p-3">{s.active ? "Yes" : "No"}</td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => setActive(s)}
                    className="text-primary"
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

            {seasons.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500"
                >
                  No seasons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full p-6 rounded space-y-4">
            <h2 className="font-semibold text-lg">
              {active.id ? "Edit Season" : "New Season"}
            </h2>

            <input
              className="w-full border p-2"
              placeholder="Year (e.g. 2025–2026)"
              value={active.year}
              onChange={(e) =>
                setActive({ ...active, year: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border p-2"
              value={active.startDate?.slice(0, 10) || ""}
              onChange={(e) =>
                setActive({ ...active, startDate: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border p-2"
              value={active.endDate?.slice(0, 10) || ""}
              onChange={(e) =>
                setActive({ ...active, endDate: e.target.value })
              }
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={active.active}
                onChange={(e) =>
                  setActive({ ...active, active: e.target.checked })
                }
              />
              Active
            </label>

            <div className="flex justify-end gap-3">
              <button onClick={() => setActive(null)}>Cancel</button>
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