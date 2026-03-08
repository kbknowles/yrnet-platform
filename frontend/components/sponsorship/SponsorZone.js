// filepath: frontend/components/sponsorship/SponsorZone.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

/*
  Resolve image URLs for sponsor assets.

  Handles:
  - Full external URLs
  - Relative paths returned from API
  - Ensures uploads resolve against API base
*/
function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const clean = url.replace(/^\/+/, "");
  return `${API_BASE}/${clean}`;
}

/*
  SponsorZone
  --------------------------------------------------
  Dynamic sponsorship placement resolver.

  Props:
  - tenantSlug   → required for multi-tenant isolation
  - contentType  → page context (EVENT, SEASON, PAGE, etc.)
  - contentId    → specific record id
  - levels       → sponsor levels to resolve
  - slots        → number of sponsor slots to fill

  Resolution logic:
  1. Fetch sponsorship assignments
  2. Prefer direct matches
  3. Backfill remaining slots
  4. Avoid duplicate sponsors
*/

export default function SponsorZone({
  tenantSlug,
  contentType,
  contentId,
  levels = ["PREMIER", "FEATURED"],
  slots = 4,
}) {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    if (!tenantSlug) return;

    async function load() {
      try {
        const params = new URLSearchParams();

        /* tenant isolation */
        params.append("tenant", tenantSlug);

        if (contentType) params.append("contentType", contentType);
        if (contentId) params.append("contentId", contentId);

        if (levels?.length) {
          params.append("levels", levels.join(","));
        }

        params.append("slots", slots);

        const res = await fetch(
          `${API_BASE}/api/sponsorships/resolve?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!res.ok) return;

        const data = await res.json();

        const direct = Array.isArray(data.direct) ? data.direct : [];
        const backfill = Array.isArray(data.backfill) ? data.backfill : [];

        const final = [];
        const seen = new Set();

        /*
          Prefer direct sponsorships first
        */
        for (const d of direct) {
          if (final.length >= slots) break;
          if (!d?.sponsor) continue;
          if (seen.has(d.sponsor.id)) continue;

          seen.add(d.sponsor.id);
          final.push(d.sponsor);
        }

        /*
          Backfill remaining slots
        */
        if (final.length < slots) {
          for (const b of backfill) {
            if (final.length >= slots) break;
            if (!b?.sponsor) continue;
            if (seen.has(b.sponsor.id)) continue;

            seen.add(b.sponsor.id);
            final.push(b.sponsor);
          }
        }

        setSponsors(final);
      } catch (err) {
        console.error("SponsorZone failed:", err);
      }
    }

    load();
  }, [tenantSlug, contentType, contentId, levels, slots]);

  /*
    Layout logic
  */
  const gridClasses =
    slots === 1
      ? "grid grid-cols-1"
      : "grid grid-cols-2 md:grid-cols-4 gap-4";

  return (
    <section className="py-6">

      {sponsors.length > 0 ? (
        <div className={gridClasses}>

          {sponsors.map((s) => (
            <a
              key={s.id}
              href={s.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-white border rounded flex items-center justify-center overflow-hidden ${
                slots === 1 ? "h-40" : "h-28"
              }`}
            >
              {s.bannerUrl ? (
                <img
                  src={resolveImage(s.bannerUrl)}
                  alt={s.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : s.logoUrl ? (
                <img
                  src={resolveImage(s.logoUrl)}
                  alt={s.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="font-semibold text-center">
                  {s.name}
                </div>
              )}
            </a>
          ))}

        </div>
      ) : (
        /*
          Empty slot placeholder for unsold inventory
        */
        <div className="bg-slate-100 border border-dashed rounded p-6 text-center">
          <div className="font-semibold text-lg mb-2">
            Sponsorship Available
          </div>
          <div className="text-sm text-slate-600">
            This placement is available.
          </div>
        </div>
      )}

    </section>
  );
}