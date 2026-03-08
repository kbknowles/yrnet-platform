// filepath: frontend/lib/media.js

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function resolveTenantMedia({
  tenantSlug,
  folder,
  filename,
  recordId = null,
}) {
  if (!filename) return "";
  if (filename.startsWith("http")) return filename;

  const clean = filename.replace(/^\/+/, "");

  if (recordId) {
    return `${API_BASE}/uploads/tenants/${tenantSlug}/${folder}/${recordId}/${clean}`;
  }

  return `${API_BASE}/uploads/tenants/${tenantSlug}/${folder}/${clean}`;
}