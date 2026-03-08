// filepath: frontend/components/home/UpcomingRodeos.js
"use client";

import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";

export default function UpcomingRodeos({ rodeos = [] }) {
  const tenantSlug = useTenantSlug();

  /*
    Show the NEXT three upcoming rodeos.
    - Remove past rodeos
    - Sort by soonest date
  */
  const today = new Date();

  const sorted = Array.isArray(rodeos)
    ? [...rodeos]
        .filter((r) => r.startDate && new Date(r.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
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