// frontend/app/admin/gallery/page.js
"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/admin/gallery`)
      .then((r) => r.json())
      .then(setAlbums)
      .catch(console.error);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Gallery Albums</h1>

      <ul className="space-y-3">
        {albums.map((a) => (
          <li key={a.id} className="p-4 border rounded bg-white">
            {a.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
