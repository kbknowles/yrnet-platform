"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function SponsorCard({ sponsor }) {
  return (
    <a
      href={sponsor.website || "/sponsors"}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white border border-gray-900 rounded p-4 flex items-center justify-center h-28"
    >
      {sponsor.logoUrl ? (
        <img
          src={resolveImage(sponsor.logoUrl)}
          alt={sponsor.name}
          className="max-h-20 max-w-full object-contain"
        />
      ) : (
        <div className="text-center">
          <div className="text-ahsra-blue font-semibold text-lg">
            {sponsor.name}
          </div>
          {sponsor.description && (
            <div className="text-xs mt-1 text-gray-600">
              {sponsor.description}
            </div>
          )}
        </div>
      )}
    </a>
  );
}

function PlaceholderCard({ label }) {
  return (
    <a
      href="/sponsors"
      className="bg-white border-2 border-dashed border-gray-400 rounded p-4 flex items-center justify-center h-28 text-center"
    >
      <div>
        <div className="font-semibold text-ahsra-blue">{label}</div>
        <div className="text-xs text-gray-500 mt-1">
          Click to learn about sponsorships
        </div>
      </div>
    </a>
  );
}

export default function SponsorZone({
  contentType,
  contentId,
  levels = [],
  slots = 4,
  stickySession = true,
}) {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    async function loadSponsors() {
      try {
        const levelParam =
          levels.length > 0 ? `&levels=${levels.join(",")}` : "";

        const res = await fetch(
          `${API_BASE}/api/sponsorships/resolve?contentType=${contentType}&contentId=${contentId ?? ""}${levelParam}`
        );

        if (!res.ok) return;

        const data = await res.json();

        // NEW RESPONSE SHAPE
        const sponsorships = data?.sponsorships || [];

        let final = sponsorships
          .map((s) => s.sponsor)
          .filter(Boolean)
          .slice(0, slots);

        while (final.length < slots) {
          final.push(null);
        }

        if (stickySession) {
          const key = `sponsorZone_${contentType}_${contentId}`;
          const existing = sessionStorage.getItem(key);
          if (existing) {
            setSponsors(JSON.parse(existing));
            return;
          } else {
            sessionStorage.setItem(key, JSON.stringify(final));
          }
        }

        setSponsors(final);
      } catch (err) {
        console.error("SponsorZone load failed", err);
      }
    }

    if (contentType) {
      loadSponsors();
    }
  }, [contentType, contentId, levels, slots, stickySession]);

  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section className="space-y-2">
      <h3 className="text-lg font-semibold text-center">
        Support Our Sponsors
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 py-2 gap-4">
        {sponsors.map((s, index) =>
          s ? (
            <SponsorCard key={index} sponsor={s} />
          ) : (
            <PlaceholderCard
              key={index}
              label={
                index === 1
                  ? "Support Our Athletes"
                  : "Sponsorship Available"
              }
            />
          )
        )}
      </div>
    </section>
  );
}
