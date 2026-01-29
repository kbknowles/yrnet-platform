// filepath: frontend/components/home/EventGallery.js
"use client";

import Image from "next/image";

export default function EventGallery({ albums = [] }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const isDev = process.env.NODE_ENV !== "production";

  const album = albums[0];
  const images = album?.images || [];

  if (!images.length) return null;

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6">
          {album.title || "Event Gallery"}
        </h2>

        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="min-w-[260px] bg-white rounded-lg border shadow-sm overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={`${API_BASE}${img.imageUrl}`}
                    alt={img.caption || album.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 260px"
                    className="object-cover"
                    unoptimized={isDev}
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
      </div>
    </section>
  );
}
