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

  function tierBorder(tier) {
    switch (tier) {
      case "TITLE":
        return "border-yellow-500";
      case "GOLD":
        return "border-yellow-400";
      case "SILVER":
        return "border-gray-400";
      case "BRONZE":
        return "border-ahsra-blue";
      case "ATHLETE":
        return "border-gray-300";
      default:
        return "border-gray-200";
    }
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
            className={`h-28 flex items-center justify-center border-2 rounded bg-white ${tierBorder(
              s.tier
            )}`}
          >
            {s.logoUrl ? (
              <a
                href={s.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full px-4"
              >
                <img
                  src={fullImagePath(s.logoUrl)}
                  alt={s.name}
                  className="max-h-16 max-w-full object-contain"
                />
              </a>
            ) : (
              <a
                href={s.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full px-4 text-center"
              >
                <span className="text-lg md:text-xl font-semibold tracking-wide text-ahsra-blue">
                  {s.name}
                </span>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
