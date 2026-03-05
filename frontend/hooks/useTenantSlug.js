"use client";

import { useParams } from "next/navigation";

export function useTenantSlug() {
  const params = useParams();
  return params?.tenantSlug || "";
}