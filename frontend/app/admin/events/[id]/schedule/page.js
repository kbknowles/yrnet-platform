"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function EventSchedulePage({ params }) {
  const eventId = params.id;
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  async function loadItems() {
    const res = await fetch(
      `${API_BASE}/api/admin/event-schedule/${eventId}`
    );
    setItems(await res.json());
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(`${API_BASE}/api/admin/event-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, eventId }),
    });

    setForm({ title: "", startTime: "", endTime: "", notes: "" });
    loadItems();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Event Schedule</h1>

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
        <input
          type="datetime-local"
          className="border rounded p-2"
          value={form.endTime}
          onChange={(e) =>
            setForm({ ...form, endTime: e.target.value })
          }
        />
        <textarea
          className="border rounded p-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />
        <button className="bg-ahsra-blue text-white rounded px-4 py-2">
          Add Schedule Item
        </button>
      </form>

      <section className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="border rounded p-3 bg-white">
            <div className="font-medium">{i.title}</div>
            <div className="text-sm text-gray-600">
              {new Date(i.startTime).toLocaleString()}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
