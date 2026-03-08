// filepath: frontend/app/[tenantSlug]/gallery/page.js

import Link from "next/link";
import Image from "next/image";
import SponsorZone from "components/sponsorship/SponsorZone";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveImage(filename, tenantSlug) {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;

  const clean = filename.replace(/^\/+/, "");
  return `${API_BASE}/uploads/tenants/${tenantSlug}/gallery/${clean}`;
}

async function getHomeData(tenantSlug) {
  const res = await fetch(`${API_BASE}/${tenantSlug}/home`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { tenant: null };
  }

  return res.json();
}

async function getAlbums(tenantSlug) {
  const res = await fetch(`${API_BASE}/${tenantSlug}/gallery`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function GalleryPage({ params }) {
  const { tenantSlug } = params;

  const [homeData, albums] = await Promise.all([
    getHomeData(tenantSlug),
    getAlbums(tenantSlug),
  ]);

  const tenant = homeData?.tenant;
  const safeAlbums = Array.isArray(albums) ? albums : [];

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="hero bg-secondary">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Photo Gallery
          </h1>

          <div className="w-24 h-1 bg-accent mx-auto" />

          <p className="mx-auto text-white/90 mb-6 text-lg lg:text-xl sm:px-16 xl:px-48">
            Explore highlights from rodeos across{" "}
            {tenant?.slug?.toUpperCase() || "our association"}.
          </p>
        </div>
      </section>

      {/* ALBUM GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {safeAlbums.length === 0 ? (
          <p>No albums available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {safeAlbums.map((album) => {
              const cover = album.images?.[0];
              const imageCount = album.images?.length || 0;

              const imageSrc = resolveImage(cover?.imageUrl, tenantSlug);

              return (
                <Link
                  key={album.slug || album.id}
                  href={`/${tenantSlug}/gallery/${album.slug}`}
                  className="group relative block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <div className="relative h-56 bg-gray-200">
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt={album.title || "Gallery Album"}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        unoptimized
                      />
                    )}

                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h2 className="font-semibold text-lg truncate">
                        {album.title}
                      </h2>

                      <p className="text-sm text-white/80">
                        {imageCount} {imageCount === 1 ? "Photo" : "Photos"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* SPONSORS */}
      <section className="bg-white/90 py-4">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Sponsors
          </h2>

          <div className="border-t-2 border-rose-700 w-20 mx-auto" />

          <SponsorZone contentType="SEASON" contentId={null} slots={4} />
        </div>
      </section>
    </main>
  );
}