// filepath: frontend/app/schedule/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import SponsorZone from "components/sponsorship/SponsorZone";
import { formatDate } from "lib/formatDate";
import { useTenantSlug } from "hooks/useTenantSlug";
import { getBasePath } from "../../../utils/getBasePath";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function endOfDayFromISO(dateVal) {
  if (!dateVal) return null;

  const raw =
    typeof dateVal === "string"
      ? dateVal
      : new Date(dateVal).toISOString();

  const ymd = raw.slice(0, 10);
  const [y, m, d] = ymd.split("-").map(Number);

  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

function sortSchedule(events) {
  const now = new Date();
  const today = startOfToday();

  return [...events].sort((a, b) => {
    const aStart = endOfDayFromISO(a.startDate);
    const aEnd = endOfDayFromISO(a.endDate || a.startDate);
    const bStart = endOfDayFromISO(b.startDate);
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
  const start = endOfDayFromISO(e.startDate);
  const end = endOfDayFromISO(e.endDate || e.startDate);

  if (start <= now && end >= today) return "CURRENT";
  if (start > now) return "UPCOMING";
  return "PAST";
}

export default function SchedulePage() {
  const tenantSlug = useTenantSlug();
  const basePath = getBasePath(tenantSlug);

  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [seasonName, setSeasonName] = useState("Season Schedule");

  useEffect(() => {
    if (!tenantSlug) return;

    fetch(`${API_BASE}/${tenantSlug}/schedule`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => {
        const today = startOfToday();

        if (data?.season?.year) {
          setSeasonName(data.season.year);
        }

        const visible = (Array.isArray(data?.events) ? data.events : []).filter(
          (e) => {
            const eventEnd = endOfDayFromISO(e.endDate || e.startDate);
            return eventEnd && eventEnd >= today;
          }
        );

        setEvents(sortSchedule(visible));
      })
      .catch(() => {});
  }, [tenantSlug]);

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
    <main className="bg-gray-50">
      {/* PAGE HEADER */}
      <section className="bg-secondary text-white/90">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-white/90 tracking-tight">
            {seasonName}
          </h1>

          <div className="w-24 h-1 bg-accent mx-auto" />

          <p className="text-lg text-white opacity-90 max-w-2xl mx-auto">
            View upcoming rodeos, download to your calendar, and plan your
            season.
          </p>

          {nextEvent && (
            <div className="mt-8 space-y-3">
              <div className="text-xl uppercase tracking-wide text-slate-900 font-bold">
                Next Rodeo
              </div>

              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                {nextEvent.name}
              </h2>

              <p className="text-white opacity-90">
                {formatDate(nextEvent.startDate)}
                {nextEvent.endDate && ` – ${formatDate(nextEvent.endDate)}`}
                {nextEvent.location && ` · ${nextEvent.location.name}`}
              </p>

              <Link
                href={`${basePath}/rodeos/${nextEvent.slug}`}
                className="inline-block bg-accent text-white px-8 py-3 rounded-md text-sm font-semibold hover:opacity-90 transition"
              >
                View Event Details
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT — LIST */}
          <div className="lg:col-span-2 space-y-6">
            {events.map((e) => {
              const status = getStatus(e);

              const badgeStyles =
                status === "CURRENT"
                  ? "bg-green-100 text-green-800"
                  : status === "UPCOMING"
                  ? "bg-accent/10 text-accent"
                  : "bg-gray-200 text-gray-600";

              return (
                <div
                  key={e.slug}
                  data-slug={e.slug}
                  className={`bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition ${
                    selectedSlug === e.slug ? "ring-2 ring-accent" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <Link
                      href={`${basePath}/rodeos/${e.slug}`}
                      className="text-xl font-semibold text-primary hover:text-accent transition"
                    >
                      {e.name}
                    </Link>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${badgeStyles}`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-700">
                    {formatDate(e.startDate)}
                    {e.endDate && ` – ${formatDate(e.endDate)}`}
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
                      className="underline text-primary hover:text-accent"
                    >
                      Add to Google
                    </a>

                    <a
                      href={`${API_BASE}/${tenantSlug}/calendar/${e.slug}.ics`}
                      className="underline text-primary hover:text-accent"
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
              <SponsorZone tenantSlug={tenantSlug} contentType="SEASON" contentId={1} slots={1} />
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                height={500}
                eventColor="var(--primary)"
                eventClick={(info) => {
                  setSelectedSlug(info.event.id);
                  document
                    .querySelector(`[data-slug="${info.event.id}"]`)
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SPONSORS */}
      <section className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-primary">
            Thank You to Our Sponsors
          </h2>

          <div className="border-t-2 border-primary w-20 mx-auto" />

          <SponsorZone
            tenantSlug={tenantSlug}
            contentType="SEASON"
            contentId={null}
            levels={["PREMIER", "FEATURED"]}
            slots={4}
          />
        </div>
      </section>
    </main>
  );
}