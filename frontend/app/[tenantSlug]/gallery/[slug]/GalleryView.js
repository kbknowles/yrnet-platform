// filepath: frontend/app/[tenantSlug]/gallery/[slug]/GalleryView.js

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AlbumSlideshow from "components/gallery/AlbumSlideshow";
import SponsorZone from "components/sponsorship/SponsorZone";

function resolveImage(url, API_BASE) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

export default function GalleryView({ album, API_BASE }) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const images = (album.images || []).map((img) => ({
    ...img,
    imageUrl: resolveImage(img.imageUrl, API_BASE),
  }));

  const imageCount = images.length;

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="hero text-4xl md:text-5xl font-semibold tracking-tight">
            {album.title}
          </h1>

          <div className="w-24 h-1 bg-rose-700 mx-auto mt-4 mb-6" />

          <p className="text-gray-300 text-lg">
            {imageCount} {imageCount === 1 ? "Photo" : "Photos"}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {images.map((img, i) => (
            <div
              key={img.id}
              onClick={() => {
                setStartIndex(i);
                setOpen(true);
              }}
              className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            >
              <Image
                src={img.imageUrl}
                alt={img.caption || album.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                unoptimized
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <div
            className="w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AlbumSlideshow images={images} initialIndex={startIndex} />
          </div>
        </div>
      )}

      {/* SPONSORS */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl font-bold">Thank You to Our Sponsors</h2>

          <div className="w-20 h-1 bg-rose-700 mx-auto" />

          <SponsorZone
            contentType="SEASON"
            contentId={null}
            levels={["PREMIER", "FEATURED"]}
            slots={4}
          />
        </div>
      </section>
    </main>
  );
}