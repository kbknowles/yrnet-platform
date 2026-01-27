// filepath: frontend/components/admin/OfficerForm.js

"use client";

import { useState } from "react";

export default function OfficerForm({ seasons, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    type: "adult",
    emailAlias: "",
    phone: "",
    seasonId: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/officers`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          seasonId: Number(form.seasonId),
        }),
      }
    );

    setForm({
      name: "",
      role: "",
      type: "adult",
      emailAlias: "",
      phone: "",
      seasonId: "",
    });

    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 max-w-xl">
      <input
        className="border rounded p-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        className="border rounded p-2"
        placeholder="Role"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        required
      />
      <select
        className="border rounded p-2"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="adult">Adult</option>
        <option value="student">Student</option>
        <option value="queen">Queen</option>
      </select>

      <select
        className="border rounded p-2"
        value={form.seasonId}
        onChange={(e) => setForm({ ...form, seasonId: e.target.value })}
        required
      >
        <option value="">Select Season</option>
        {seasons.map((s) => (
          <option key={s.id} value={s.id}>
            {s.year}
          </option>
        ))}
      </select>

      <button className="bg-ahsra-blue text-white rounded px-4 py-2">
        Add Officer
      </button>
    </form>
  );
}
