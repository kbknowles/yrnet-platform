// filepath: frontpage/components/home/GalleryCarousel.js
"use client";

import Image from "next/image";
import { useTenantSlug } from "hooks/useTenantSlug";
import { resolveTenantMedia } from "lib/media";

export default function GalleryCarousel({ albums = [] }) {
  const tenantSlug = useTenantSlug();

  const album = albums?.[0];
  const images = album?.images || [];

  if (!images.length) return null;

  function resolveGalleryImage(filename) {
    if (!filename) return "";

    return resolveTenantMedia({
      tenantSlug,
      folder: "gallery",
      filename,
    });
  }

  return (
    <div className="bg-gray-100 overflow-x-auto">
      <div className="flex gap-4 pb-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="min-w-[240px] bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative h-44 w-full">
              <Image
                src={resolveGalleryImage(img.imageUrl)}
                alt={img.caption || album?.title || "Gallery Image"}
                fill
                sizes="(max-width:768px) 50vw, 240px"
                className="object-cover"
                unoptimized
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