// filepath: frontend/app/admin/locations/page.js
"use client";

import { useEffect, useState } from "react";

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    info: {},
  });

  async function loadLocations() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/locations`
    );
    const data = await res.json();
    setLocations(data);
  }

  useEffect(() => {
    loadLocations();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/locations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    setForm({
      name: "",
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
      info: {},
    });

    loadLocations();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-ahsra-blue">
        Manage Locations
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
        <input
          className="border rounded p-2"
          placeholder="Location Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Street Address"
          value={form.streetAddress}
          onChange={(e) =>
            setForm({ ...form, streetAddress: e.target.value })
          }
        />
        <input
          className="border rounded p-2"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="ZIP"
          value={form.zip}
          onChange={(e) => setForm({ ...form, zip: e.target.value })}
        />

        <button className="rounded bg-ahsra-blue px-4 py-2 text-white">
          Add Location
        </button>
      </form>

      <section className="space-y-2">
        {locations.map((loc) => (
          <div key={loc.id} className="rounded border bg-white p-4">
            <div className="font-semibold">{loc.name}</div>
            <div className="text-sm text-gray-600">
              {loc.city}, {loc.state}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
