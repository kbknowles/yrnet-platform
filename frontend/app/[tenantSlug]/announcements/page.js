function resolveMedia(url, tenantSlug) {
  if (!url) return null;

  if (url.startsWith("http")) return url;

  if (url.startsWith("/uploads")) {
    return `${API_BASE}${url}`;
  }

  return `${API_BASE}/uploads/tenants/${tenantSlug}/announcements/${url}`;
}