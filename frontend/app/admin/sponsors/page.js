// frontend/app/admin/sponsors/page.js

"use client";

import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    website: "",
    active: true,
  });

  async function loadSponsors() {
    const res = await fetch(`${API_BASE}/api/admin/sponsors`);
    const data = await res.json();
    setSponsors(data);
  }

  useEffect(() => {
    loadSponsors();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(`${API_BASE}/api/admin/sponsors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      logoUrl: "",
      website: "",
      active: true,
    });

    loadSponsors();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-ahsra-blue">
        Manage Sponsors
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
        <input
          className="border rounded p-2"
          placeholder="Sponsor Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          className="border rounded p-2"
          placeholder="Logo URL"
          value={form.logoUrl}
          onChange={(e) =>
            setForm({ ...form, logoUrl: e.target.value })
          }
        />

        <input
          className="border rounded p-2"
          placeholder="Website URL"
          value={form.website}
          onChange={(e) =>
            setForm({ ...form, website: e.target.value })
          }
        />

        <button className="rounded bg-ahsra-blue px-4 py-2 text-white">
          Add Sponsor
        </button>
      </form>

      {/* List */}
      <section className="space-y-2">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="rounded border bg-white p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{sponsor.name}</div>
              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  {sponsor.website}
                </a>
              )}
            </div>

            {!sponsor.active && (
              <span className="text-sm text-red-600 font-medium">
                Inactive
              </span>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
