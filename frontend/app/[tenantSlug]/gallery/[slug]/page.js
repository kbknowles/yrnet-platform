// filepath: frontend/app/[tenantSlug]/gallery/[slug]/page.js

import GalleryView from "./GalleryView";

export default async function GalleryAlbumPage({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const { tenantSlug, slug } = params;

  const res = await fetch(
    `${API_BASE}/${tenantSlug}/gallery/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-8">Album not found.</div>;
  }

  const album = await res.json();

  function resolveImage(filename) {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;

    const clean = filename.replace(/^\/+/, "");
    return `${API_BASE}/uploads/tenants/${tenantSlug}/gallery/${clean}`;
  }

  const images =
    Array.isArray(album?.images)
      ? album.images.map((img) => ({
          ...img,
          imageUrl: resolveImage(img.imageUrl),
        }))
      : [];

  const hydratedAlbum = {
    ...album,
    images,
  };

  return (
    <GalleryView
      album={hydratedAlbum}
      API_BASE={API_BASE}
    />
  );
}