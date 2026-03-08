// filepath: frontend/components/home/RodeoGallery.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/*
  RodeoGallery
  --------------------------------------------------
  Displays a preview grid from the most recent album.

  Logic:
  1. Accept albums array from homepage data.
  2. Sort albums newest first.
  3. Select the most recent album.
  4. Sort its images newest first.
  5. Display the latest 4 images as a preview grid.
  6. All images link to the full album page.
*/

export default function RodeoGallery({ albums = [] }) {
  const tenantSlug = useTenantSlug();

  const safeAlbums = Array.isArray(albums) ? albums : [];
  if (!safeAlbums.length) return null;

  /*
    Sort albums by createdAt (newest first)
  */
  const sortedAlbums = [...safeAlbums].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const latestAlbum = sortedAlbums[0];

  const images = Array.isArray(latestAlbum?.images)
    ? latestAlbum.images
    : [];

  if (!images.length) return null;

  /*
    Sort images newest first and show the latest four
  */
  const latestImages = [...images]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  /*
    Resolve gallery image path.

    Stored DB value = filename only
    Final URL = tenant-scoped uploads directory
  */
  function resolveGalleryImage(filename, imageId) {
    if (!filename) return "";
    if (filename.startsWith("http")) return filename;

    const clean = filename.replace(/^\/+/, "");

    return `${API_BASE}/uploads/tenants/${tenantSlug}/gallery/${imageId}/${clean}`;
  }

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {latestAlbum.title || "Event Gallery"}
          </h2>

          <Link
            href={`/${tenantSlug}/gallery/${latestAlbum.slug}`}
            className="text-sm text-primary hover:underline"
          >
            View More →
          </Link>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latestImages.map((img) => (
            <Link
              key={img.id}
              href={`/${tenantSlug}/gallery/${latestAlbum.slug}`}
              className="bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={resolveGalleryImage(img.imageUrl, img.id)}
                  alt={img.caption || latestAlbum.title || "Gallery Image"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}