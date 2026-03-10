// filepath: frontend/components/home/SponsorStrip.js
"use client";

import { useEffect, useState } from "react";
import { useTenantSlug } from "hooks/useTenantSlug";
import { resolveTenantMedia } from "lib/media";

export default function SponsorStrip({ sponsors = [] }) {
  const tenantSlug = useTenantSlug();
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

  function resolveSponsorImage(filename) {
    if (!filename) return null;

    return resolveTenantMedia({
      tenantSlug,
      folder: "sponsors",
      filename,
    });
  }

  if (!sponsors || sponsors.length === 0) return null;

  const visibleSponsors = sponsors.slice(index, index + visibleCount);

  return (
    <section className="py-12 bg-white">

      <h2 className="text-center text-lg font-semibold mb-6">
        Our Sponsors
      </h2>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 transition-opacity duration-500">
        {visibleSponsors.map((s) => {
          const src = resolveSponsorImage(s.logoUrl);

          return (
            <div
              key={s.id}
              className="h-28 flex items-center justify-center rounded border-2 border-gray-500 bg-white"
            >
              {src ? (
                <a
                  href={s.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full px-4"
                >
                  <img
                    src={src}
                    alt={s.name}
                    className="max-h-20 max-w-full object-contain"
                  />
                </a>
              ) : (
                <a
                  href={s.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full px-4 text-center"
                >
                  <span className="text-lg md:text-xl font-semibold tracking-wide text-primary">
                    {s.name}
                  </span>
                </a>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}