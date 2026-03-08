// filepath: frontend/components/home/UpcomingRodeos.js
"use client";

import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";

export default function UpcomingRodeos({ rodeos = [] }) {
  const tenantSlug = useTenantSlug();

  /*
    The API already returns rodeos in the correct order.
    Just show the first three.
  */
  const visible = Array.isArray(rodeos) ? rodeos.slice(0, 3) : [];

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