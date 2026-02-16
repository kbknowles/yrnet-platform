// filepath: frontend/app/gallery/[slug]/page.js
import Image from "next/image";
import SponsorZone from "../../../components/sponsorship/SponsorZone";
import GalleryClient from "./GalleryClient";

export default async function GalleryAlbumPage({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const isDev = process.env.NODE_ENV !== "production";

  const { slug } = await params;

  const res = await fetch(
    `${API_BASE}/api/gallery/albums/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-8">Album not found.</div>;
  }

  const album = await res.json();

  return (
    <GalleryClient
      album={album}
      API_BASE={API_BASE}
      isDev={isDev}
    />
  );
}
