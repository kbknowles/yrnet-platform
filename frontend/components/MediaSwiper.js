// filepath: frontend/components/MediaSwiper.js
"use client";

/*
  MediaSwiper
  -------------------------------------------------------
  Supports:
  - Images
  - PDFs (iframe preview)
*/

export default function MediaSwiper({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="w-full">
          {item.isPdf ? (
            <iframe
              src={item.imageUrl}
              className="w-full h-[500px] bg-white border rounded"
            />
          ) : (
            <img
              src={item.imageUrl}
              alt={item.title || "media"}
              className="w-full object-contain rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}