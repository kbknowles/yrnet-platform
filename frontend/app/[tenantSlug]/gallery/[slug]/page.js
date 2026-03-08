// filepath: frontend/app/[tenantSlug]/gallery/[slug]/page.js

import GalleryView from "./GalleryView";

export default async function GalleryAlbumPage({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const { tenantSlug, slug } = await params;

  const res = await fetch(
    `${API_BASE}/${tenantSlug}/gallery/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-8">Album not found.</div>;
  }

  const album = await res.json();

  // convert filenames to full URLs
  const images =
    album?.images?.map((img) => ({
      ...img,
      imageUrl: img.imageUrl
        ? `${API_BASE}/uploads/tenants/${tenantSlug}/gallery/${img.imageUrl}`
        : null,
    })) || [];

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