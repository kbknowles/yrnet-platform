// filepath: frontend/utils/getBasePath.js

export function getBasePath(tenantSlug) {
  if (!tenantSlug) return "";

  // DEV (multi-tenant path)
  if (typeof window !== "undefined") {
    if (window.location.hostname.includes("onrender.com")) {
      return `/${tenantSlug}`;
    }
  }

  // SERVER SIDE (Next SSR)
  if (process.env.NEXT_PUBLIC_SITE_MODE === "dev") {
    return `/${tenantSlug}`;
  }

  // PRODUCTION (custom domain)
  return "";
}