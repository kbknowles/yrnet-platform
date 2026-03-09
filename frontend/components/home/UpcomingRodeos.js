// filepath: frontend/components/home/UpcomingRodeos.js
"use client";

import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";

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

export default function UpcomingRodeos({ rodeos = [] }) {
  const tenantSlug = useTenantSlug();

  const today = startOfToday();

  const sorted = Array.isArray(rodeos)
    ? sortSchedule(
        rodeos.filter((r) => {
          const eventEnd = endOfDayFromISO(r.endDate || r.startDate);
          return eventEnd && eventEnd >= today;
        })
      )
    : [];

  const visible = sorted.slice(0, 3);

  return (
    <section className="hero">
      <h2 className="text-xl font-semibold mb-4">Our Schedule</h2>

      <ul className="space-y-3">
        {visible.map((rodeo) => (
          <li key={rodeo.id} className="border rounded p-3 bg-transparent">
            <div className="font-medium">{rodeo.name}</div>

            <div className="text-sm">
              {rodeo.startDate
                ? new Date(rodeo.startDate).toLocaleDateString()
                : ""}
            </div>

            {rodeo.slug && (
              <Link
                href={`/${tenantSlug}/rodeos/${rodeo.slug}`}
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                View Details →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}