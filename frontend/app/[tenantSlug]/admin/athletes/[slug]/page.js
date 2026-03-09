// filepath: frontend/app/[tenantSlug]/admin/athletes/[slug]/page.js
"use client";

import { useParams } from "next/navigation";
import AthleteForm from "../AthleteForm";

export default function EditAthletePage() {
  const params = useParams();

  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug;

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  if (!slug || !tenantSlug) {
    return <div className="p-6">Loading...</div>;
  }

  return <AthleteForm slug={slug} tenantSlug={tenantSlug} mode="edit" />;
}