// filepath: frontend/app/gallery/[slug]/page.js

import Image from "next/image";
import AlbumSlideshow from "../../../components/gallery/AlbumSlideshow";
import SponsorZone from "../../../components/sponsorship/SponsorZone";

export default async function GalleryAlbumPage({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const isDev = process.env.NODE_ENV !== "production";

  const { slug } = await params;

  const res = await fetch(
    `${API_BASE}/api/gallery/albums/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-8">Album not found.</div>;
  }

  const album = await res.json();

  return (
    <GalleryClient
      album={album}
      API_BASE={API_BASE}
      isDev={isDev}
    />
  );
}

/* =========================
   CLIENT WRAPPER
========================= */

"use client";

import { useState } from "react";

function GalleryClient({ album, API_BASE, isDev }) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const images = album.images.map((img) => ({
    ...img,
    imageUrl: `${API_BASE}${img.imageUrl}`,
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">{album.title}</h1>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            onClick={() => {
              setStartIndex(i);
              setOpen(true);
            }}
            className="relative aspect-square bg-gray-100 rounded overflow-hidden cursor-pointer"
          >
            <Image
              src={img.imageUrl}
              alt={img.caption || album.title}
              fill
              className="object-cover"
              unoptimized={isDev}
            />
          </div>
        ))}
      </div>

      {/* Modal Slideshow */}
      {open && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            ✕
          </button>

          <div className="w-[90vw] max-w-5xl">
            <AlbumSlideshow
              images={images}
              initialIndex={startIndex}
            />
          </div>
        </div>
      )}

      {/* Sponsor at bottom */}
      <SponsorZone
        contentType="GALLERY"
        contentId={album.id}
        zone="FOOTER"
        slots={4}
      />
    </main>
  );
}
