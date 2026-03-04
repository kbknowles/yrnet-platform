// filepath: frontend/app/[tenantSlug]/page.js

import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function safeFetch(url) {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    let errText = "";
    try {
      errText = await res.text();
    } catch {}
    throw new Error(`Fetch failed ${res.status}: ${errText}`);
  }

  return res.json();
}

export default async function HomePage(props) {
  const params = await props.params;   // ✅ unwrap async params
  const tenantSlug = params?.tenantSlug;

  if (!tenantSlug) {
    notFound();
  }

  const [homeData, announcements, galleryAlbums] = await Promise.all([
    safeFetch(`${API_BASE}/api/${tenantSlug}/home`),
    safeFetch(`${API_BASE}/api/${tenantSlug}/announcements?published=true`),
    safeFetch(`${API_BASE}/api/${tenantSlug}/gallery`).catch(() => []),
  ]);

  const rodeos = homeData?.upcomingRodeos || homeData?.rodeos || [];

  return (
    <>
      <pre>{JSON.stringify({ rodeos, announcements }, null, 2)}</pre>
    </>
  );
}