// filepath: frontend/app/admin/events/[slug]/schedule/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminEventSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [event, setEvent] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      try {
        const res = await fetch(
          `${API_BASE}/api/events/${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setEvent(data);
        setItems(data.scheduleItems || []);
      } catch (err) {
        console.error("Failed to load schedule", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!event?.id) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/event-schedule-items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event.id,
            ...form,
          }),
        }
      );

      if (!res.ok) return;

      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]);

      setForm({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to save schedule item", err);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/event-schedule-items/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) return;

      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  if (!event) {
    return (
      <div className="p-6">
        <p className="mb-4">Event not found.</p>
        <Link href="/admin/events" className="underline">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Schedule — {event.name}
        </h1>
        <Link
          href={`/admin/events/${event.slug}`}
          className="text-sm underline"
        >
          Back to Event
        </Link>
      </div>

      {/* CREATE FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded p-6 space-y-4"
      >
        <h2 className="font-medium">Add Schedule Item</h2>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
            required
          />

          <input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          />

          <input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm({ ...form, endTime: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add Item
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-slate-600 text-sm">
            No schedule items yet.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4 flex justify-between items-start bg-white"
          >
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-slate-600">
                {item.date &&
                  new Date(item.date).toLocaleDateString("en-US")}
                {item.startTime && ` • ${item.startTime}`}
                {item.endTime && ` – ${item.endTime}`}
              </div>
              {item.notes && (
                <div className="text-sm mt-2 whitespace-pre-line">
                  {item.notes}
                </div>
              )}
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="text-sm text-red-600 underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
