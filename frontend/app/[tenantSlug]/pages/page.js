// filepath: frontend/app/[tenantSlug]/pages/page.js


import Link from "next/link";
import SponsorZone from "components/sponsorship/SponsorZone";
import { getBasePath } from "../../../utils/getBasePath";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/*
  Fetch published pages for the tenant.
*/
async function getPages(tenantSlug) {
  try {
    const res = await fetch(`${API_BASE}/${tenantSlug}/pages`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();

    return (data || [])
      .filter((p) => p.status === "published")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  } catch {
    return [];
  }
}

export default async function PagesIndex({ params }) {
  const { tenantSlug } = await params;

  const basePath = getBasePath(tenantSlug);

  const pages = await getPages(tenantSlug);

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">

      {/* PAGE HEADER */}
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-primary">
          Pages
        </h1>

        <SponsorZone
          tenantSlug={tenantSlug}
          contentType={null}
          contentId={null}
          slots={1}
        />
      </section>

      {/* PAGE LIST */}
      {pages.length === 0 ? (
        <p className="text-gray-600">
          No pages available.
        </p>
      ) : (
        <ul className="space-y-4">
          {pages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`${basePath}/${page.slug}`}
                className="text-primary font-medium underline"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* SPONSOR SECTION */}
      <section className="bg-white/90 py-4">
        <div className="max-w-7xl mx-auto px-4 space-y-6">

          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Sponsors
          </h2>

          <div className="border-t-2 border-rose-700 w-20 mx-auto" />

          <SponsorZone
            tenantSlug={tenantSlug}
            contentType="SEASON"
            contentId={null}
            levels={["PREMIER", "FEATURED"]}
            slots={4}
          />

        </div>
      </section>

    </main>
  );
}