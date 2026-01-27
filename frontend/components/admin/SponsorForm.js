// filepath: frontend/components/admin/SponsorForm.js

"use client";

import { useState } from "react";

export default function SponsorForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    website: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/sponsors`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    setForm({ name: "", logoUrl: "", website: "" });
    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 max-w-xl">
      <input
        className="border rounded p-2"
        placeholder="Sponsor Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        className="border rounded p-2"
        placeholder="Logo URL"
        value={form.logoUrl}
        onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
      />
      <input
        className="border rounded p-2"
        placeholder="Website"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />

      <button className="bg-ahsra-blue text-white rounded px-4 py-2">
        Add Sponsor
      </button>
    </form>
  );
}
