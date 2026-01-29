// filepath: frontend/app/gallery/page.js

import Link from "next/link";
import Image from "next/image";

export default async function GalleryIndexPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const isDev = process.env.NODE_ENV !== "production";

  const res = await fetch(`${API_BASE}/api/gallery`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="p-8">Failed to load gallery.</div>;
  }

  const albums = await res.json();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Photo Gallery</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {albums.map((album) => {
          const cover = album.images?.[0];

          return (
            <Link
              key={album.id}
              href={`/gallery/${album.slug}`}
              className="block bg-white border rounded-lg shadow-sm overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100">
                {cover && (
                  <Image
                    src={`${API_BASE}${cover.imageUrl}`}
                    alt={album.title}
                    fill
                    className="object-cover"
                    unoptimized={isDev}
                  />
                )}
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-sm truncate">
                  {album.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
