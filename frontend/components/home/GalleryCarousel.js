// filepath: frontpage/components/home/GalleryCarousel.js
"use client";

import { useState } from "react";
import Image from "next/image";
import AlbumSlideshow from "../gallery/AlbumSlideshow";

export default function GalleryCarousel({ albums = [] }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const album = albums[0];
  const images = album?.images || [];

  if (!images.length) return null;

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
      <div className="bg-gray-100 overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {images.map((img, index) => (
            <div
              key={img.id}
              onClick={() => openSlideshow(index)}
              className="min-w-[240px] bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={normalizeImageUrl(img.imageUrl)}
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
