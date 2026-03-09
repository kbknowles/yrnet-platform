// filepath: frontend/app/[tenantSlug]/layout.js

import Header from "components/Header";
import Footer from "components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveLogo(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const clean = url.replace(/^\/+/, "");
  return `${API_BASE}/${clean}`;
}

export default async function TenantLayout({ children, params }) {
  const { tenantSlug } = await params;

  let homeData = {};

  if (tenantSlug) {
    try {
      const res = await fetch(`${API_BASE}/${tenantSlug}/home`, {
        cache: "no-store",
      });

      if (res.ok) {
        homeData = await res.json();
      }
    } catch {
      homeData = {};
    }
  }

  const tenant = {
    slug: tenantSlug,
    name:
      homeData?.tenant?.name ||
      (tenantSlug ? tenantSlug.toUpperCase() : "Association"),
    primaryColor: homeData?.tenant?.primaryColor || "#3C3B6E",
    secondaryColor: homeData?.tenant?.secondaryColor || "#B22234",
    accentColor: homeData?.tenant?.accentColor || "#D4AF37",
    logoUrl: homeData?.tenant?.logoUrl || null,
  };

  const logoSrc = resolveLogo(tenant.logoUrl);

  const style = {
    "--primary": tenant.primaryColor,
    "--secondary": tenant.secondaryColor,
    "--accent": tenant.accentColor,
  };

  return (
    <>
      {logoSrc && <link rel="icon" href={logoSrc} />}

      <div style={style} className="flex flex-col min-h-screen">
        <Header tenant={tenant} />
        <main className="flex-1">{children}</main>
        <Footer tenant={tenant} />
      </div>
    </>
  );
}