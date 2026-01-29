// filepath: frontend/app/admin/events/page.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newEvent, setNewEvent] = useState({
    name: "",
    slug: "",
    startDate: "",
    endDate: "",
  });

  async function loadEvents() {
    const res = await fetch(`${API_BASE}/api/admin/events`);
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function createEvent() {
    await fetch(`${API_BASE}/api/admin/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    setNewEvent({ name: "", slug: "", startDate: "", endDate: "" });
    loadEvents();
  }

  async function updateEvent(id, field, value) {
    const event = events.find((e) => e.id === id);
    await fetch(`${API_BASE}/api/admin/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, [field]: value }),
    });
  }

  async function deleteEvent(id) {
    if (!confirm("Delete this event?")) return;
    await fetch(`${API_BASE}/api/admin/events/${id}`, {
      method: "DELETE",
    });
    loadEvents();
  }

  if (loading) return <p>Loading events…</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Events</h1>

      <table className="w-full border text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Slug</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* NEW EVENT ROW */}
          <tr className="bg-green-50">
            <td className="border p-2">
              <input
                className="w-full border p-1"
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, name: e.target.value })
                }
              />
            </td>
            <td className="border p-2">
              <input
                className="w-full border p-1"
                value={newEvent.slug}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, slug: e.target.value })
                }
              />
            </td>
            <td className="border p-2">
              <input
                type="date"
                className="w-full border p-1"
                value={newEvent.startDate}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startDate: e.target.value })
                }
              />
            </td>
            <td className="border p-2">
              <input
                type="date"
                className="w-full border p-1"
                value={newEvent.endDate}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endDate: e.target.value })
                }
              />
            </td>
            <td className="border p-2 text-center">
              <button
                onClick={createEvent}
                className="bg-ahsra-blue text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </td>
          </tr>

          {/* EXISTING EVENTS */}
          {events.map((event) => (
            <tr key={event.id}>
              <td className="border p-2">
                <input
                  className="w-full border p-1"
                  defaultValue={event.name}
                  onBlur={(e) =>
                    updateEvent(event.id, "name", e.target.value)
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  className="w-full border p-1"
                  defaultValue={event.slug}
                  onBlur={(e) =>
                    updateEvent(event.id, "slug", e.target.value)
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="date"
                  className="w-full border p-1"
                  defaultValue={event.startDate?.slice(0, 10)}
                  onBlur={(e) =>
                    updateEvent(event.id, "startDate", e.target.value)
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="date"
                  className="w-full border p-1"
                  defaultValue={event.endDate?.slice(0, 10)}
                  onBlur={(e) =>
                    updateEvent(event.id, "endDate", e.target.value)
                  }
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
