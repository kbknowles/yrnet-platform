"use client";

import { useState } from "react";

export default function SeasonForm({ onCreated }) {
  const [form, setForm] = useState({
    year: "",
    startDate: "",
    endDate: "",
    active: false,
  });

  async function submit(e) {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/seasons`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (res.ok) {
      setForm({ year: "", startDate: "", endDate: "", active: false });
      onCreated();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 border p-4 rounded bg-white">
      <input
        className="w-full border p-2"
        placeholder="Season Year (e.g. 2025–2026)"
        value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })}
        required
      />

      <input
        type="date" min="2020-01-01"
        className="w-full border p-2"
        value={form.startDate}
        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        required
      />

      <input
        type="date" min="2020-01-01"
        className="w-full border p-2"
        value={form.endDate}
        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        required
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
        Active season
      </label>

      <button className="bg-ahsra-blue text-white px-4 py-2 rounded">
        Create Season
      </button>
    </form>
  );
}
