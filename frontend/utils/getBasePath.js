// filepath: frontend/utils/getBasePath.js

/**
 * Returns correct base path for multi-tenant routing
 *
 * - Dev / shared domain → includes /tenantSlug
 * - Custom domain → no tenantSlug in path
 */

export function getBasePath(tenantSlug) {
  if (!tenantSlug) return "";

  // SSR fallback (safe default for shared domain)
  if (typeof window === "undefined") {
    return `/${tenantSlug}`;
  }

  const host = window.location.hostname;

  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  const isSharedDomain =
    host.includes("onrender.com");

  // If using custom domain → no tenant in path
  if (!isLocal && !isSharedDomain) {
    return "";
  }

  // Otherwise include tenantSlug
  return `/${tenantSlug}`;
}