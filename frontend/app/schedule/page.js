// filepath: frontend/app/schedule/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import SponsorZone from "../../components/sponsorship/SponsorZone";

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

function getStatus(e) {
  const now = new Date();
  const start = new Date(e.startDate);
  const end = new Date(e.endDate || e.startDate);

  if (start <= now && end >= now) return "CURRENT";
  if (start > now) return "UPCOMING";
  return "PAST";
}

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/schedule`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setEvents(sortSchedule(data)));
  }, []);

  const nextEvent = events.find(
    (e) => getStatus(e) === "CURRENT" || getStatus(e) === "UPCOMING"
  );

  const calendarEvents = events.map((e) => ({
    id: e.slug,
    title: e.name,
    start: e.startDate,
    end: e.endDate || e.startDate,
    allDay: true,
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 space-y-12 bg-slate-50">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-ahsra-blue">
          Rodeo Schedule
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View upcoming rodeos, download to your calendar, and plan your season.
        </p>
      </section>

      {/* Next Event Highlight */}
      {nextEvent && (
        <section className="bg-gray-100 border rounded-lg p-8 text-center space-y-4">
          <div className="text-sm uppercase tracking-wide text-ahsra-red font-semibold">
            Next Rodeo
          </div>
          <h2 className="text-3xl font-bold text-ahsra-blue">
            {nextEvent.name}
          </h2>
          <p className="text-gray-700">
            {formatMMDDYYYY(nextEvent.startDate)}
            {nextEvent.endDate &&
              ` – ${formatMMDDYYYY(nextEvent.endDate)}`}
          </p>
          <Link
            href={`/events/${nextEvent.slug}`}
            className="inline-block bg-ahsra-red text-white px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            View Event Details
          </Link>
        </section>
      )}

      <hr className="border-gray-200" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT — LIST */}
        <div className="lg:col-span-2 space-y-6">
          {events.map((e) => {
            const status = getStatus(e);

            const badgeStyles =
              status === "CURRENT"
                ? "bg-green-100 text-green-800"
                : status === "UPCOMING"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-200 text-gray-600";

            return (
              <div
                key={e.id}
                data-slug={e.slug}
                className={`border rounded-lg bg-white p-6 shadow-sm ${
                  selectedSlug === e.slug
                    ? "ring-2 ring-ahsra-blue"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <Link
                    href={`/events/${e.slug}`}
                    className="text-xl font-semibold text-ahsra-red hover:underline"
                  >
                    {e.name}
                  </Link>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${badgeStyles}`}
                  >
                    {status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  {formatMMDDYYYY(e.startDate)}
                  {e.endDate &&
                    ` – ${formatMMDDYYYY(e.endDate)}`}
                  {e.location &&
                    ` · ${e.location.name}`}
                </p>

                <div className="flex gap-6 text-sm mt-4">
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
                    Add to Google
                  </a>

                  <a
                    href={`/api/calendar/${e.slug}.ics`}
                    className="underline text-ahsra-blue"
                  >
                    Download .ics
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — CALENDAR + SPONSOR */}
        <div className="space-y-8 lg:sticky lg:top-24">
          <div>
            <div className="text-sm uppercase tracking-wide text-gray-500 mb-3">
              Season Partner
            </div>
            <SponsorZone
              contentType="SEASON"
              contentId={1}
              slots={1}
            />
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              height={500}
              eventColor="#8B1E2D"
              eventClick={(info) => {
                setSelectedSlug(info.event.id);
                document
                  .querySelector(
                    `[data-slug="${info.event.id}"]`
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
