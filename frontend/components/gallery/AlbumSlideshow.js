"use client";

import { useState, useEffect } from "react";
import { resolveTenantMedia } from "lib/media";

function resolveSrc(src, tenantSlug) {
  if (!src) return "";

  return resolveTenantMedia({
    tenantSlug,
    folder: "gallery",
    filename: src,
  });
}

export default function AlbumSlideshow({
  images = [],
  initialIndex = 0,
  tenantSlug,
}) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  if (!images.length) return null;

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  const current = images[index];

  return (
    <div className="space-y-4 relative">
      <div className="relative">
        <img
          src={resolveSrc(current.imageUrl, tenantSlug)}
          alt={current.caption || "Image"}
          className="rounded w-full max-h-[80vh] object-contain"
        />

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
        >
          ‹
        </button>

        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
        >
          ›
        </button>
      </div>

      {current.caption && (
        <p className="text-sm text-gray-600 text-center">
          {current.caption}
        </p>
      )}
    </div>
  );
}