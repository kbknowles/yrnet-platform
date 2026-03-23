// filepath: frontend/components/home/RodeoGallery.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";
import { resolveTenantMedia } from "lib/media";
import { getBasePath } from "../../utils/getBasePath";

export default function RodeoGallery({ albums = [] }) {
  const tenantSlug = useTenantSlug();
  const basePath = getBasePath(tenantSlug);

  const safeAlbums = Array.isArray(albums) ? albums : [];

  if (!safeAlbums.length) return null;

  const sortedAlbums = [...safeAlbums].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const latestAlbum = sortedAlbums[0];
  const images = Array.isArray(latestAlbum?.images) ? latestAlbum.images : [];

  if (!images.length) return null;

  const latestImages = [...images]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {latestAlbum.title || "Event Gallery"}
          </h2>

          <Link
            href={`${basePath}/gallery/${latestAlbum.slug}`}
            className="text-sm text-primary hover:underline"
          >
            View More →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latestImages.map((img) => (
            <Link
              key={img.id}
              href={`${basePath}/gallery/${latestAlbum.slug}`}
              className="bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={resolveTenantMedia({
                    tenantSlug,
                    folder: "gallery",
                    filename: img.imageUrl
                  })}
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