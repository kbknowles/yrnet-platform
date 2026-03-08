// filepath: frontend/components/home/RodeoGallery.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";

export default function RodeoGallery({ albums = [] }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const isDev = process.env.NODE_ENV !== "production";
  const tenantSlug = useTenantSlug();

  if (!albums.length) return null;

  // Sort albums by createdAt (newest first)
  const sortedAlbums = [...albums].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const latestAlbum = sortedAlbums[0];
  const images = latestAlbum?.images || [];

  if (!images.length) return null;

  // Sort images by createdAt (newest first) and take top 4
  const latestImages = [...images]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  function normalizeImageUrl(src) {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    if (!API_BASE) return src;
    return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
  }

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latestImages.map((img) => (
            <Link
              key={img.id}
              href={`/${tenantSlug}/gallery/${latestAlbum.slug}`}
              className="bg-white rounded-lg border shadow-sm overflow-hidden"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}