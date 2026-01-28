// filepath: frontend/app/admin/events/page.js

"use client";

import { useEffect, useState } from "react";
import EventForm from "../../../components/admin/EventForm";



export default function AdminEventsPage() {
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const [events, setEvents] = useState([]);

  async function loadEvents() {
    const res = await fetch(`${API_BASE}/api/admin/events`);
    const data = await res.json();
    setEvents(data);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-ahsra-blue">
        Manage Events
      </h1>

      <EventForm onCreated={loadEvents} />

      <section className="space-y-3">
        {events.map((e) => (
          <div
            key={e.id}
            className="rounded border bg-white p-4"
          >
            <div className="font-semibold">{e.name}</div>
            <div className="text-sm text-gray-600">
              {new Date(e.startDate).toLocaleDateString()} –{" "}
              {new Date(e.endDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              {e.location?.name} • {e.season?.year}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
