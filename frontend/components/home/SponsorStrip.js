// filepath: frontend/components/home/SponsorStrip.js
"use client";

import { useEffect, useState } from "react";

export default function SponsorStrip({ sponsors = [] }) {
  const [index, setIndex] = useState(0);

  const visibleCount = 4;

  useEffect(() => {
    if (sponsors.length <= visibleCount) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + visibleCount >= sponsors.length ? 0 : prev + visibleCount
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [sponsors.length]);

  const visibleSponsors = sponsors.slice(index, index + visibleCount);

  return (
    <section className="py-12 bg-white">
      <h2 className="text-center text-lg font-semibold mb-6">
        Our Sponsors
      </h2>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all">
        {visibleSponsors.map((s) => (
          <div
            key={s.id}
            className="h-24 flex items-center justify-center border rounded bg-gray-50"
          >
            {s.logoUrl ? (
              <img
                src={s.logoUrl}
                alt={s.name}
                className="max-h-16 max-w-full object-contain"
              />
            ) : (
              <span className="text-sm font-medium">{s.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
