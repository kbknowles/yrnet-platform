"use client";

import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "";

export default function SponsorStrip({ sponsors = [] }) {
  const [index, setIndex] = useState(0);

  const visibleCount = 4;

  useEffect(() => {
    if (!sponsors || sponsors.length <= visibleCount) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + visibleCount >= sponsors.length ? 0 : prev + visibleCount
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [sponsors]);

  function fullImagePath(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  }

  if (!sponsors || sponsors.length === 0) return null;

  const visibleSponsors = sponsors.slice(index, index + visibleCount);

  return (
    <section className="py-12 bg-white">
      <h2 className="text-center text-lg font-semibold mb-6">
        Our Sponsors
      </h2>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 transition-opacity duration-500">
        {visibleSponsors.map((s) => (
          <div
            key={s.id}
            className="h-24 flex items-center justify-center border rounded bg-gray-50"
          >
            {s.logoUrl ? (
              <a
                href={s.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full"
              >
                <img
                  src={fullImagePath(s.logoUrl)}
                  alt={s.name}
                  className="max-h-16 max-w-full object-contain"
                />
              </a>
            ) : (
              <span className="text-sm font-medium">
                {s.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
