// filepath: frontend/app/[tenantSlug]/layout.js

import Header from "components/Header";
import Footer from "components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default async function TenantLayout({ children, params }) {
  const { tenantSlug } = await params;

  const res = await fetch(`${API_BASE}/api/${tenantSlug}/home`, {
    cache: "no-store",
  });

  const homeData = res.ok ? await res.json() : {};

  const tenant = {
    slug: tenantSlug,
    name: homeData?.tenant?.name || tenantSlug.toUpperCase(),
    primaryColor: homeData?.tenant?.primaryColor || "#0f172a",
    accentColor: homeData?.tenant?.accentColor || "#ffffff",
    logoUrl: homeData?.tenant?.logoUrl || null,
  };

  return (
    <>
      <Header tenant={tenant} />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
    </>
  );
}