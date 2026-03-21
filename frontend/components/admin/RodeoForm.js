// filepath: frontend/components/admin/EventForm.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import authFetch from "../../utils/authFetch";

export default function EventForm({ onCreated }) {
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [seasons, setSeasons] = useState([]);
  const [locations, setLocations] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    startDate: "",
    endDate: "",
    seasonId: "",
    locationId: "",
  });

  useEffect(() => {
    loadMeta();
  }, [tenantSlug]);

  async function loadMeta() {
    if (!tenantSlug) return;

    const [sRes, lRes] = await Promise.all([
      authFetch(`/${tenantSlug}/admin/seasons`),
      authFetch(`/${tenantSlug}/admin/locations`),
    ]);

    const [s, l] = await Promise.all([sRes.json(), lRes.json()]);

    setSeasons(Array.isArray(s) ? s : []);
    setLocations(Array.isArray(l) ? l : []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tenantSlug) return;

    await authFetch(`/${tenantSlug}/admin/rodeos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    });

    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
      <input
        className="border rounded p-2"
        placeholder="Event Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        required
      />

      <input
        className="border rounded p-2"
        placeholder="Slug"
        value={form.slug}
        onChange={(e) =>
          setForm({ ...form, slug: e.target.value })
        }
        required
      />

      <input
        type="date"
        className="border rounded p-2"
        value={form.startDate}
        onChange={(e) =>
          setForm({ ...form, startDate: e.target.value })
        }
        required
      />

      <input
        type="date"
        className="border rounded p-2"
        value={form.endDate}
        onChange={(e) =>
          setForm({ ...form, endDate: e.target.value })
        }
        required
      />

      <select
        className="border rounded p-2"
        value={form.seasonId}
        onChange={(e) =>
          setForm({ ...form, seasonId: e.target.value })
        }
        required
      >
        <option value="">Select Season</option>
        {seasons.map((s) => (
          <option key={s.id} value={s.id}>
            {s.year}
          </option>
        ))}
      </select>

      <select
        className="border rounded p-2"
        value={form.locationId}
        onChange={(e) =>
          setForm({ ...form, locationId: e.target.value })
        }
        required
      >
        <option value="">Select Location</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      <button className="rounded bg-primary px-4 py-2 text-white">
        Add Event
      </button>
    </form>
  );
}