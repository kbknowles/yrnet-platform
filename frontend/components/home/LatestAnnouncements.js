// filepath: frontend/components/home/LatestAnnouncements.js
"use client";

import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";

export default function LatestAnnouncements({ announcements = [] }) {
  const tenantSlug = useTenantSlug();

  const sorted = [...announcements].sort((a, b) => {
    if (a.priority === "important" && b.priority !== "important") return -1;
    if (a.priority !== "important" && b.priority === "important") return 1;

    const aDate = new Date(a.publishAt || a.createdAt);
    const bDate = new Date(b.publishAt || b.createdAt);

    return bDate - aDate;
  });

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Announcements</h2>

      <div className="space-y-3">
        {sorted.map((a) => (
          <div
            key={a.id}
            className={`rounded border p-4 ${
              a.priority === "important"
                ? "border-red-700 bg-red-50"
                : "bg-white"
            }`}
          >
            <div className="font-semibold">{a.title}</div>

            <div className="text-sm text-gray-600 mt-1">
              {a.content}
            </div>

            {a.slug && (
              <Link
                href={`/${tenantSlug}/announcements/${a.slug}`}
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                Read More →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}