// filepath: frontend/lib/media.js

/*
  KBDev Engine Media Resolver
  -------------------------------------------------------
  Standard media path resolver used across all KBDev
  vertical platforms (YRNet · LocalPulse · TravelLocal · GuideLocal).

  Media architecture standard:

  /uploads/tenants/{tenantSlug}/{folder}/{filename}

  Examples:

  /uploads/tenants/ahsra/announcements/1719943321-poster.png
  /uploads/tenants/ahsra/gallery/1719944500-barrel.jpg
  /uploads/tenants/ahsra/sponsors/1719945011-logo.png
  /uploads/tenants/ahsra/images/hero.png

  Design rules:

  • Database stores filename only
  • Upload middleware generates unique filenames
  • No recordId folders are used
  • Media folders are flat per tenant
  • All frontend media should resolve through this helper
*/

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

/*
  resolveTenantMedia

  Builds a full URL to tenant media.

  Params:
    tenantSlug  - tenant identifier
    folder      - media folder (announcements, gallery, sponsors, athletes, images, etc.)
    filename    - stored filename from database

  Returns:
    Fully resolved media URL
*/

export function resolveTenantMedia({ tenantSlug, folder, filename }) {
  if (!filename) return "";

  // allow absolute URLs
  if (filename.startsWith("http")) {
    return filename;
  }

  const clean = filename.replace(/^\/+/, "");

  return `${API_BASE}/uploads/tenants/${tenantSlug}/${folder}/${clean}`;
}