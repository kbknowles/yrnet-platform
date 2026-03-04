// filepath: frontend/app/[tenantSlug]/layout.js

import Header from "components/Header";
import Footer from "components/Footer";

export default async function TenantLayout({ children, params }) {
  const { tenantSlug } = params;

  const tenant = {
    slug: tenantSlug,
    name: tenantSlug.toUpperCase(),
  };

  return (
    <>
      <Header tenant={tenant} />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
    </>
  );
}