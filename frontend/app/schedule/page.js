"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function formatMMDDYYYY(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function sortSchedule(events) {
  const now = new Date();

  return [...events].sort((a, b) => {
    const aStart = new Date(a.startDate);
    const aEnd = new Date(a.endDate || a.startDate);
    const bStart = new Date(b.startDate);
    const bEnd = new Date(b.endDate || b.startDate);

    const aIsCurrent = aStart <= now && aEnd >= now;
    const bIsCurrent = bStart <= now && bEnd >= now;

    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;

    const aIsFuture = aStart > now;
    const bIsFuture = bStart > now;

    if (aIsFuture && bIsFuture) return aStart - bStart;
    if (!aIsFuture && !bIsFuture) return bStart - aStart;

    return aIsFuture ? -1 : 1;
  });
}

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetch(`${API_BASE}/api/schedule`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setEvents(sortSchedule(data)));
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);

    const clicked = events.find((e) => {
      const start = new Date(e.startDate);
      const end = new Date(e.endDate || e.startDate);
      return date >= start && date <= end;
    });

    if (clicked) {
      setSelectedSlug(clicked.slug);
      document
        .querySelector(`[data-slug="${clicked.slug}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileClassName={({ date }) => {
              const hasEvent = events.some((e) => {
                const start = new Date(e.startDate);
                const end = new Date(e.endDate || e.startDate);
                return date >= start && date <= end;
              });
              return hasEvent ? "highlighted-day" : null;
            }}
          />

          <style jsx global>{`
            .react-calendar__tile.highlighted-day {
              background: #1e3a8a;
              color: white !important;
              border-radius: 8px;
              font-weight: 600;
            }
            .react-calendar__tile.highlighted-day:enabled:hover {
              background: #b91c1c;
              color: white !important;
            }
          `}</style>
        </div>
      </div>
    </main>
  );
}
