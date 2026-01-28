"use client";

import { useEffect, useState } from "react";

export default function EventGallery() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`)
      .then((r) => r.json())
      .then(setAlbums);
  }, []);

  if (!albums.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Rodeo Gallery</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="space-y-2">
            <img
              src={album.images[0]?.imageUrl}
              className="rounded"
            />
            <div className="font-medium">{album.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
