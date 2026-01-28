"use client";

import Image from "next/image";

export default function GalleryCarousel({ albums = [] }) {
  if (!albums.length) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 pb-4">
        {albums.map((album) => {
          const cover =
            album.images && album.images.length > 0
              ? album.images[0].imageUrl
              : null;

          return (
            <div
              key={album.id}
              className="min-w-[260px] bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {cover ? (
                <div className="relative h-44 w-full">
                  <Image
                    src={cover}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-44 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-sm">{album.title}</h3>
                {album.season && (
                  <p className="text-xs text-gray-500 mt-1">
                    Season {album.season.year}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
