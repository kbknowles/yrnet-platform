"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function EventGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/gallery/albums`)
      .then((r) => r.json())
      .then((albums) => {
        if (albums.length) {
          setImages(albums[0].images || []);
        }
      });
  }, []);

  if (!images.length) return null;

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Season Highlights</h2>

        <div className="flex gap-4 overflow-x-auto">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt={img.caption || ""}
              className="h-64 rounded-lg object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
