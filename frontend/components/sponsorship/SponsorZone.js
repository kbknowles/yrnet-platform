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

        const res = await fetch(
          `${API_BASE}/api/sponsorships/resolve?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!res.ok) return;

        const data = await res.json();

        const direct = data.direct || [];
        const backfill = data.backfill || [];

        let final = [];

        // direct first
        direct.forEach((d) => {
          if (final.length < slots && d?.sponsor) {
            final.push(d.sponsor);
          }
        });

        // backfill next
        backfill.forEach((b) => {
          if (final.length < slots && b?.sponsor) {
            final.push(b.sponsor);
          }
        });

        setSponsors(final);
      } catch (err) {
        console.error("SponsorZone failed:", err);
      }
    }

    load();
  }, [contentType, contentId, levels, slots]);

  const gridClasses =
    slots === 1
      ? "grid grid-cols-1 gap-4"
      : "grid grid-cols-2 md:grid-cols-4 gap-4";

  return (
    <section className="py-6">
      {sponsors.length > 0 ? (
        <div className={gridClasses}>
          {sponsors.map((s, i) => (
            <a
              key={i}
              href={s.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-white border rounded overflow-hidden ${
                slots === 1
                  ? "h-32"
                  : "p-4 flex items-center justify-center h-28"
              }`}
            >
              {s.bannerUrl ? (
                <img
                  src={resolveImage(s.bannerUrl)}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
              ) : s.logoUrl ? (
                <img
                  src={resolveImage(s.logoUrl)}
                  alt={s.name}
                  className="max-h-20 object-contain mx-auto"
                />
              ) : (
                <div className="font-semibold text-center p-4">
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
