// filepath: frontend/app/[tenantSlug]/admin/rodeos/[slug]/schedule/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RodeoSchedulePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const params = useParams();

  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    notes: "",
  });

  async function loadItems() {
    if (!slug || !tenantSlug) return;

    try {
      const res = await fetch(
        `${API_BASE}/${tenantSlug}/admin/rodeo-schedule-items?slug=${encodeURIComponent(
          slug
        )}`,
        { cache: "no-store" }
      );

      if (!res.ok) return;

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    if (slug && tenantSlug) loadItems();
  }, [slug, tenantSlug]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!slug || !tenantSlug) return;

    await fetch(`${API_BASE}/${tenantSlug}/admin/rodeo-schedule-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug,
        label: form.title,
        date: form.startTime,
        startTime: form.startTime,
        notes: form.notes,
      }),
    });

    setForm({
      title: "",
      startTime: "",
      notes: "",
    });

    loadItems();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">
        Rodeo Schedule: {slug}
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          className="border rounded p-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <input
          type="datetime-local"
          className="border rounded p-2"
          value={form.startTime}
          onChange={(e) =>
            setForm({ ...form, startTime: e.target.value })
          }
          required
        />

        <textarea
          className="border rounded p-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        <button className="bg-primary text-white rounded px-4 py-2">
          Add Schedule Item
        </button>
      </form>

      <section className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="border rounded p-3 bg-white">
            <div className="font-medium">{i.label}</div>
            <div className="text-sm text-gray-600">
              {new Date(i.date).toLocaleString()}
            </div>
            {i.notes && (
              <div className="text-xs text-gray-500 mt-1">
                {i.notes}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}