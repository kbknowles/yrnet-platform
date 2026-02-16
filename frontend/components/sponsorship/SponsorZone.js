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
        const res = await fetch(
          `${API_BASE}/api/sponsorships/resolve?contentType=${contentType}&contentId=${contentId}&levels=${levels.join(",")}`,
          { cache: "no-store" }
        );

        if (!res.ok) return;

        const data = await res.json();

        const direct = data.direct || [];
        const backfill = data.backfill || [];

        let final = [];

        // direct first
        direct.forEach((d) => {
          if (final.length < slots) final.push(d.sponsor);
        });

        // backfill next
        backfill.forEach((b) => {
          if (final.length < slots) final.push(b.sponsor);
        });

        setSponsors(final);
      } catch (err) {
        console.error("SponsorZone failed:", err);
      }
    }

    if (contentType) load();
  }, [contentType, contentId, levels, slots]);

  return (
    <section className="py-6">
      {sponsors.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sponsors.map((s, i) => (
            <a
              key={i}
              href={s.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border rounded p-4 flex items-center justify-center h-28"
            >
              {s.logoUrl ? (
                <img
                  src={resolveImage(s.logoUrl)}
                  alt={s.name}
                  className="max-h-20 object-contain"
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
