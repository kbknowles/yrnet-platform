// filepath: frontend/app/gallery/[slug]/GalleryView.js

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AlbumSlideshow from "../../../components/gallery/AlbumSlideshow";
import SponsorZone from "../../../components/sponsorship/SponsorZone";

export default function GalleryView({ album, API_BASE, isDev }) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const images = album.images.map((img) => ({
    ...img,
    imageUrl: `${API_BASE}${img.imageUrl}`,
  }));

  const imageCount = images.length;

  // ESC to close
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
      <section className="bg-ahsra-blue/95 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3">
          <h1 className="text-4xl font-bold">{album.title}</h1>
          <p className="text-white/90">
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
                unoptimized={isDev}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
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
            <AlbumSlideshow
              images={images}
              initialIndex={startIndex}
            />
          </div>
        </div>
      )}


   {/* SPONSORS */}
      <section className="bg-white/90 py-4">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Sponsors
          </h2>

          <div className="border-t-2 border-rose-700 w-20 mx-auto" />

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
