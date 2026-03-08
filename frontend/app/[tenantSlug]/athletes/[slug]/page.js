// filepath: frontend/app/athletes/[slug]/page.js

import { notFound } from "next/navigation";
import AthleteView from "./AthleteView";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function hydrateMedia(athlete, tenantSlug) {
  const resolve = (filename) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    return `${API_BASE}/uploads/tenants/${tenantSlug}/images/${filename}`;
  };

  return {
    ...athlete,
    headshotUrl: resolve(athlete.headshotUrl),
    actionPhotos: (athlete.actionPhotos || []).map(resolve),
    videos: (athlete.videos || []).map((v) =>
      v.startsWith("http")
        ? v
        : `${API_BASE}/uploads/tenants/${tenantSlug}/videos/${v}`
    ),
  };
}

async function getAthlete(tenantSlug, slug) {
  const res = await fetch(`${API_BASE}/${tenantSlug}/athletes/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AthleteDetailPage({ params }) {
  const { tenantSlug, slug } = await params;

  const athlete = await getAthlete(tenantSlug, slug);

  if (!athlete || !athlete.isActive) {
    notFound();
  }

  const hydratedAthlete = hydrateMedia(athlete, tenantSlug);

  return (
    <AthleteView
      athlete={hydratedAthlete}
      API_BASE={API_BASE}
    />
  );
}