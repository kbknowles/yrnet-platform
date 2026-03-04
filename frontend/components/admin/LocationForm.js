// filepath: frontend/components/admin/LocationForm.js

"use client";

import { useState } from "react";

export default function LocationForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    venueInfo: {},
  });

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
      venueInfo: {},
    });

    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 max-w-xl">
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

      <button className="bg-primary text-white rounded px-4 py-2">
        Add Location
      </button>
    </form>
  );
}
