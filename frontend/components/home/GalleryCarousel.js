// filepath: frontpage/components/home/GalleryCarousel.js
"use client";

import Image from "next/image";

export default function GalleryCarousel({ albums = [] }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const album = albums[0];
  const images = album?.images || [];

  if (!images.length) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="min-w-[240px] bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative h-44 w-full">
              <Image
                src={`${API_BASE}${img.imageUrl}`}
                alt={img.caption || album.title}
                fill
                className="object-cover"
              />
            </div>

            {img.caption && (
              <div className="p-3">
                <p className="text-xs truncate">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
