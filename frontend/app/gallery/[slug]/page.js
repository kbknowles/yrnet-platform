// filepath: frontend/app/gallery/[slug]/page.js

import Image from "next/image";

export default async function GalleryAlbumPage({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const isDev = process.env.NODE_ENV !== "production";

  // Next.js App Router: params is async
  const { slug } = await params;

  const res = await fetch(
    `${API_BASE}/api/gallery/albums/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-8">Album not found.</div>;
  }

  const album = await res.json();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{album.title}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {album.images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square bg-gray-100 rounded overflow-hidden"
          >
            <Image
              src={`${API_BASE}${img.imageUrl}`}
              alt={img.caption || album.title}
              fill
              className="object-cover"
              unoptimized={isDev}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
