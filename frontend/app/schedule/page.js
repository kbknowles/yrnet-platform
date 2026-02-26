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

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Fix: treat ISO dates as DATE-ONLY using YYYY-MM-DD, then set end-of-day locally.
// This prevents UTC midnight (Z) from shifting into the prior local day.
function endOfDayFromISO(dateVal) {
  if (!dateVal) return null;

  const raw = typeof dateVal === "string" ? dateVal : new Date(dateVal).toISOString();
  const ymd = raw.slice(0, 10); // "YYYY-MM-DD"
  const [y, m, d] = ymd.split("-").map(Number);

  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

function sortSchedule(events) {
  const now = new Date();
  const today = startOfToday();

  return [...events].sort((a, b) => {
    const aStart = new Date(a.startDate);
    const aEnd = endOfDayFromISO(a.endDate || a.startDate);
    const bStart = new Date(b.startDate);
    const bEnd = endOfDayFromISO(b.endDate || b.startDate);

    const aIsCurrent = aStart <= now && aEnd >= today;
    const bIsCurrent = bStart <= now && bEnd >= today;

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
  const today = startOfToday();
  const start = new Date(e.startDate);
  const end = endOfDayFromISO(e.endDate || e.startDate);

  if (start <= now && end >= today) return "CURRENT";
  if (start > now) return "UPCOMING";
  return "PAST";
}

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/schedule`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const today = startOfToday();

        // Visibility keyed off END DATE (end-of-day local, based on YYYY-MM-DD)
        const visible = (Array.isArray(data) ? data : []).filter((e) => {
          const eventEnd = endOfDayFromISO(e.endDate || e.startDate);
          return eventEnd && eventEnd >= today;
        });

        setEvents(sortSchedule(visible));
      });
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
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="bg-ahsra-blue/95 border-b-4 border-ahsra-red py-20 px-4 relative">
        {/* subtle red accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-ahsra-blue" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-white/90 tracking-tight">
            2026 Schedule
          </h1>

          <p className="text-lg text-white opacity-90 max-w-2xl mx-auto">
            View upcoming rodeos, download to your calendar, and plan your season.
          </p>

          {nextEvent && (
            <div className="mt-10 space-y-4">
              <div className="text-xl uppercase tracking-wide text-slate-900 font-bold">
                Next Rodeo
              </div>

              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                {nextEvent.name}
              </h2>

              <p className="text-white opacity-90">
                {formatMMDDYYYY(nextEvent.startDate)}
                {nextEvent.endDate && ` – ${formatMMDDYYYY(nextEvent.endDate)}`}
                {nextEvent.location && ` · ${nextEvent.location.name}`}
              </p>

              <Link
                href={`/events/${nextEvent.slug}`}
                className="inline-block bg-ahsra-red text-white px-8 py-3 rounded-md text-sm font-semibold hover:opacity-90 transition"
              >
                View Event Details
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-14 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT — LIST */}
          <div className="lg:col-span-2 space-y-6">
            {events.map((e) => {
              const status = getStatus(e);

              const badgeStyles =
                status === "CURRENT"
                  ? "bg-green-100 text-green-800"
                  : status === "UPCOMING"
                  ? "bg-ahsra-red/10 text-ahsra-red"
                  : "bg-gray-200 text-gray-600";

              return (
                <div
                  key={e.id}
                  data-slug={e.slug}
                  className={`bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition ${
                    selectedSlug === e.slug ? "ring-2 ring-ahsra-red" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <Link
                      href={`/events/${e.slug}`}
                      className="text-xl font-semibold text-ahsra-red hover:underline"
                    >
                      {e.name}
                    </Link>

                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${badgeStyles}`}>
                      {status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-700">
                    {formatMMDDYYYY(e.startDate)}
                    {e.endDate && ` – ${formatMMDDYYYY(e.endDate)}`}
                    {e.location && ` · ${e.location.name}`}
                  </p>

                  <div className="flex gap-6 text-sm mt-4">
                    <a
                      href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        e.name
                      )}&dates=${new Date(e.startDate)
                        .toISOString()
                        .replace(/[-:]/g, "")
                        .split(".")[0]}/${new Date(e.endDate || e.startDate)
                        .toISOString()
                        .replace(/[-:]/g, "")
                        .split(".")[0]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-ahsra-blue hover:text-ahsra-red"
                    >
                      Add to Google
                    </a>

                    <a
                      href={`/api/calendar/${e.slug}.ics`}
                      className="underline text-ahsra-blue hover:text-ahsra-red"
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
              <div className="text-sm uppercase tracking-wide text-gray-600 mb-3">
                Season Partner
              </div>
              <SponsorZone contentType="SEASON" contentId={1} slots={1} />
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                height={500}
                eventColor="#8B1E2D"
                eventClick={(info) => {
                  setSelectedSlug(info.event.id);
                  document.querySelector(`[data-slug="${info.event.id}"]`)?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}