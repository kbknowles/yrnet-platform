// filepath: frontend/app/schedule/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function formatMMDDYYYY(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/schedule`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setEvents);
  }, []);

  const calendarEvents = events.map((e) => ({
    id: e.slug,
    title: e.name,
    start: e.startDate,
    end: e.endDate || e.startDate,
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Rodeo Schedule</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — LIST */}
        <div className="lg:col-span-2 space-y-4">
          {events.map((e) => (
            <div
              key={e.id}
              data-slug={e.slug}
              className={`border rounded-lg bg-white p-5 ${
                selectedSlug === e.slug ? "ring-2 ring-ahsra-blue" : ""
              }`}
            >
              <Link
                href={`/events/${e.slug}`}
                className="text-lg font-bold text-ahsra-red hover:underline"
              >
                {e.name}
              </Link>

              <p className="text-sm text-gray-600">
                {formatMMDDYYYY(e.startDate)}
                {e.endDate && ` – ${formatMMDDYYYY(e.endDate)}`}
              </p>

              <div className="flex gap-4 text-sm mt-2">
                <a
                  href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    e.name
                  )}&dates=${new Date(e.startDate)
                    .toISOString()
                    .replace(/[-:]/g, "")
                    .split(".")[0]}/${new Date(
                    e.endDate || e.startDate
                  )
                    .toISOString()
                    .replace(/[-:]/g, "")
                    .split(".")[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-ahsra-blue"
                >
                  Google
                </a>

                <a
                  href={`/api/calendar/${e.slug}.ics`}
                  className="underline text-ahsra-blue"
                >
                  .ics
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — CALENDAR */}
        <div className="bg-white border rounded-lg p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            height="auto"
            eventClick={(info) => {
              setSelectedSlug(info.event.id);
              document
                .querySelector(`[data-slug="${info.event.id}"]`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />
        </div>
      </div>
    </main>
  );
}
