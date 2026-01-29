// filepath: frontend/app/gallery/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function GalleryPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch(`${API_BASE}/api/gallery`, {
          cache: "no-store",
        });
        const data = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error("Gallery load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  if (loading) {
    return <p className="p-6">Loading gallery…</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Event Gallery</h1>

      {albums.length === 0 ? (
        <p className="text-gray-600">No gallery albums available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((album) => {
            const cover =
              album.images && album.images.length > 0
                ? album.images[0].imageUrl
                : null;

            return (
              <Link
                key={album.id}
                href={`/gallery/${album.id}`}
                className="group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {cover ? (
                    <img
                      src={`${API_BASE}${cover}`}
                      alt={album.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-semibold">{album.title}</h2>
                  {album.season && (
                    <p className="text-sm text-gray-500 mt-1">
                      Season {album.season.year}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
