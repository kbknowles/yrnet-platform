// filepath: frontend/app/[tenantSlug]/admin/athletes/new/page.js

"use client";

import { useParams } from "next/navigation";
import AthleteForm from "../AthleteForm";

export default function NewAthletePage() {
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  if (!tenantSlug) {
    return <div className="p-6">Loading...</div>;
  }

  return <AthleteForm tenantSlug={tenantSlug} mode="create" />;
}