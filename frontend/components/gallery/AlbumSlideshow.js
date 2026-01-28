"use client";

import { useState } from "react";

export default function AlbumSlideshow({ images }) {
  const [index, setIndex] = useState(0);

  if (!images?.length) return null;

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={images[index].imageUrl}
          className="rounded w-full"
        />

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 bg-black/50 text-white px-3 py-1 rounded"
        >
          ‹
        </button>

        <button
          onClick={next}
          className="absolute right-2 top-1/2 bg-black/50 text-white px-3 py-1 rounded"
        >
          ›
        </button>
      </div>

      {images[index].caption && (
        <p className="text-sm text-gray-600 text-center">
          {images[index].caption}
        </p>
      )}
    </div>
  );
}
