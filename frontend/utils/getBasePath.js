// filepath: frontend/utils/getBasePath.js

/**
 * Returns correct base path for multi-tenant routing
 *
 * - Dev / shared domain → includes /tenantSlug
 * - Custom domain → no tenantSlug
 *
 * Priority:
 * 1. ENV override (recommended for production)
 * 2. Hostname fallback (safe default)
 */

export function getBasePath(tenantSlug) {
  if (!tenantSlug) return "";

  // ✅ ENV override (use this in production)
  const mode = process.env.NEXT_PUBLIC_TENANT_MODE;
  // "path" | "domain"

  if (mode === "domain") return "";
  if (mode === "path") return `/${tenantSlug}`;

  // ⚠️ SSR fallback
  if (typeof window === "undefined") {
    return `/${tenantSlug}`;
  }

  const host = window.location.hostname;

  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  const isSharedDomain =
    host.includes("onrender.com");

  // Custom domain → no tenant in path
  if (!isLocal && !isSharedDomain) {
    return "";
  }

  // Shared / dev → include tenantSlug
  return `/${tenantSlug}`;
}