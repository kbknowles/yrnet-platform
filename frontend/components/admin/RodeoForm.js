// filepath: frontend/components/admin/RodeoForm.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import authFetch from "../../utils/authFetch";

export default function RodeoForm({ rodeo, onCreated, onCancel }) {
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [seasons, setSeasons] = useState([]);
  const [locations, setLocations] = useState([]);
  const [ready, setReady] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    startDate: "",
    endDate: "",
    seasonId: "",
    locationId: "",
    status: "draft",
  });

  const isEdit = Boolean(rodeo?.id);

  /* LOAD META FIRST */
  useEffect(() => {
    if (!tenantSlug) return;

    async function loadMeta() {
      const [sRes, lRes] = await Promise.all([
        authFetch(`/${tenantSlug}/admin/seasons`),
        authFetch(`/${tenantSlug}/admin/locations`),
      ]);

      const [s, l] = await Promise.all([sRes.json(), lRes.json()]);

      setSeasons(Array.isArray(s) ? s : []);
      setLocations(Array.isArray(l) ? l : []);
      setReady(true);
    }

    loadMeta();
  }, [tenantSlug]);

  /* PREFILL AFTER DATA IS READY */
  useEffect(() => {
    if (!rodeo || !ready) return;

    const seasonId = rodeo.seasonId ?? rodeo.season?.id ?? "";
    const locationId = rodeo.locationId ?? rodeo.location?.id ?? "";

    setForm({
      name: rodeo.name || "",
      slug: rodeo.slug || "",
      startDate: rodeo.startDate?.slice(0, 10) || "",
      endDate: rodeo.endDate?.slice(0, 10) || "",
      seasonId: seasonId ? String(seasonId) : "",
      locationId: locationId ? String(locationId) : "",
      status: rodeo.status || "draft",
    });
  }, [rodeo, ready]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tenantSlug) return;

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `/${tenantSlug}/admin/rodeos/${rodeo.id}`
      : `/${tenantSlug}/admin/rodeos`;

    await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        seasonId: form.seasonId ? Number(form.seasonId) : null,
        locationId: form.locationId ? Number(form.locationId) : null,
      }),
    });

    setForm({
      name: "",
      slug: "",
      startDate: "",
      endDate: "",
      seasonId: "",
      locationId: "",
      status: "draft",
    });

    onCreated?.();
  }

  return (
    <form className="grid md:grid-cols-2 gap-4 max-w-3xl" onSubmit={handleSubmit}>
      {/* LEFT */}
      <div className="space-y-3">
        <input
          className="border rounded p-2 w-full"
          placeholder="Rodeo Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="border rounded p-2 w-full"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />

        <input
          type="date"
          className="border rounded p-2 w-full"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
          required
        />

        <input
          type="date"
          className="border rounded p-2 w-full"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
          required
        />
      </div>

      {/* RIGHT */}
      <div className="space-y-3">
        <select
          className="border rounded p-2 w-full"
          value={form.seasonId}
          onChange={(e) =>
            setForm({ ...form, seasonId: e.target.value })
          }
          required
        >
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={String(s.id)}>
              {s.year}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 w-full"
          value={form.locationId}
          onChange={(e) =>
            setForm({ ...form, locationId: e.target.value })
          }
          required
        >
          <option value="">Select Location</option>
          {locations.map((l) => (
            <option key={l.id} value={String(l.id)}>
              {l.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 w-full"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* ACTIONS */}
      <div className="md:col-span-2 flex gap-3 pt-2">
        <button className="bg-primary text-white px-4 py-2 rounded">
          Save Rodeo
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}