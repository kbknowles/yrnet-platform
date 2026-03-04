// filepath: frontend/app/gallery/page.js

import Link from "next/link";
import Image from "next/image";
import SponsorZone from "components/sponsorship/SponsorZone";
import { headers } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getTenantSlugFromHost(host) {
  const hostname = (host || "").split(":")[0];
  const parts = hostname.split(".");
  if (parts.length >= 3) return parts[0];
  return "demo";
}

export default async function GalleryIndexPage() {
  const h = await headers();
  const tenantSlug = getTenantSlugFromHost(h.get("host"));

  const isDev = process.env.NODE_ENV !== "production";

  const res = await fetch(`${API_BASE}/api/${tenantSlug}/gallery`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="p-8">Failed to load gallery.</div>;
  }

  const albums = await res.json();

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="bg-primary/95 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-heading md:text-5xl lg:text-6xl">
            Photo Gallery
          </h1>

          <div className="w-24 h-1 bg-accent mx-auto" />

          <p className="mx-auto text-white/90 mb-6 text-lg font-normal text-body lg:text-xl sm:px-16 xl:px-48">
            <span className="block">
              Explore highlights from Rodeos across the seasons
            </span>
            <span className="block">
              Athletes, Action shots, Awards, and Unforgettable moments.
            </span>
          </p>
        </div>
      </section>

      {/* ALBUM GRID */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        {!Array.isArray(albums) || albums.length === 0 ? (
          <p className="text-center text-gray-600">Gallery coming soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {albums.map((album) => {
              const cover = album.images?.[0];
              const imageCount = album.images?.length || 0;

              return (
                <Link
                  key={album.id}
                  href={`/gallery/${album.slug}`}
                  className="group relative block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <div className="relative h-56 bg-gray-200">
                    {cover?.imageUrl && (
                      <Image
                        src={
                          cover.imageUrl.startsWith("http")
                            ? cover.imageUrl
                            : `${API_BASE}${cover.imageUrl}`
                        }
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        unoptimized={isDev}
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

          <SponsorZone
            contentType="SEASON"
            contentId={null}
            levels={["PREMIER", "FEATURED"]}
            slots={4}
          />
        </div>
      </section>
    </main>
  );
}