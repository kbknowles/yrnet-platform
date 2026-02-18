// filepath: frontend/components/home/EventGallery.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AlbumSlideshow from "../gallery/AlbumSlideshow";

export default function EventGallery({ albums = [] }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const isDev = process.env.NODE_ENV !== "production";

  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!albums.length) return null;

  const sortedAlbums = [...albums].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const latestAlbum = sortedAlbums[0];
  const images = latestAlbum?.images || [];

  if (!images.length) return null;

  const latestImages = [...images]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  function normalizeImageUrl(src) {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    if (!API_BASE) return src;
    return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
  }

  function openSlideshow(index) {
    setStartIndex(index);
    setIsOpen(true);
  }

  function closeSlideshow() {
    setIsOpen(false);
  }

  return (
    <>
      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {latestAlbum.title || "Event Gallery"}
            </h2>

            <Link
              href={`/gallery/${latestAlbum.slug}`}
              className="text-sm text-ahsra-blue hover:underline"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => openSlideshow(index)}
                className="bg-white rounded-lg border shadow-sm overflow-hidden cursor-pointer"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={normalizeImageUrl(img.imageUrl)}
                    alt={img.caption || latestAlbum.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    unoptimized={isDev}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isOpen && (
        <AlbumSlideshow
          images={images}
          initialIndex={startIndex}
          onClose={closeSlideshow}
        />
      )}
    </>
  );
}
