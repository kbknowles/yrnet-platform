// filepath: frontend/app/admin/events/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function formatMMDDYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/events`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to fetch events");
          setEvents([]);
          return;
        }

        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load events", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-black text-white rounded text-sm"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 && (
        <p className="text-slate-600 text-sm">No events found.</p>
      )}

      {events.length > 0 && (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Season</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {event.name}
                    <div className="text-xs text-slate-500">
                      /events/{event.slug}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {formatMMDDYYYY(event.startDate)}
                    {event.endDate &&
                      ` – ${formatMMDDYYYY(event.endDate)}`}
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {event.season?.year ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        event.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/events/${event.slug}`}
                      className="underline"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/admin/events/${event.slug}/schedule`}
                      className="underline"
                    >
                      Schedule
                    </Link>

                    <Link
                      href={`/events/${event.slug}`}
                      target="_blank"
                      className="underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
