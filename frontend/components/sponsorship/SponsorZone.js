// filepath: frontend/components/sponsorship/SponsorZone.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export default function SponsorZone({
  contentType,
  contentId,
  levels = ["PREMIER", "FEATURED"],
  slots = 4,
}) {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams();

        if (contentType) params.append("contentType", contentType);
        if (contentId) params.append("contentId", contentId);
        if (levels?.length) params.append("levels", levels.join(","));
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

        // 1️⃣ Add direct matches first
        for (const d of direct) {
          if (final.length >= slots) break;
          if (!d?.sponsor) continue;
          if (seen.has(d.sponsor.id)) continue;

          seen.add(d.sponsor.id);
          final.push(d.sponsor);
        }

        // 2️⃣ Only backfill if needed
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
  }, [contentType, contentId, levels, slots]);

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
        <div className="bg-slate-100 border border-dashed rounded p-6 text-center">
          <div className="font-semibold text-lg mb-2">
            Sponsorship Available
          </div>
          <div className="text-sm text-slate-600">
            This placement is available. Contact AHSRA to become a featured sponsor.
          </div>
        </div>
      )}
    </section>
  );
}
