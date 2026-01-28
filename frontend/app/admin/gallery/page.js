// frontend/app/admin/gallery/page.js
"use client";

import { useEffect, useState } from "react";



export default function AdminGalleryPage() {
const API_BASE= process.env.NEXT_PUBLIC_API_URL;

const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/gallery`)
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
