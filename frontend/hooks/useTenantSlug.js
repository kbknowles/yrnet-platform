// filepath: frontend/hooks/useTenantSlug.js
"use client";

import { usePathname } from "next/navigation";

export default function useTenantSlug() {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);

  // First segment is tenant slug
  return segments.length > 0 ? segments[0] : null;
}