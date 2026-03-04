// filepath: frontend/app/[slug]/page.js

import SponsorZone from "../components/sponsorship/SponsorZone";

import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getPage(slug) {
  const res = await fetch(
    `${API_BASE}/api/pages/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function CustomPage({ params }) {
  const { slug } = await params;

  if (!slug) notFound();

  const page = await getPage(slug);

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {page.title}
          </h1>

          <div className="w-24 h-1 bg-accent mx-auto" />

          {page.heroSubtitle && (
            <p className="mx-auto text-white/90 text-lg font-normal lg:text-xl sm:px-16 xl:px-48">
              {page.heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        {page.isPlaceholder ? (
          <div className="flex items-center justify-center py-20 text-center">
            <p className="text-gray-600">
              This page is coming soon.
            </p>
          </div>
        ) : (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </section>

            {/* SPONSORS */}
            <section className="bg-white/90 py-4">
              <div className="max-w-7xl mx-auto px-4 space-y-6">
                <h2 className="text-2xl font-semibold text-center">
                  Thank You to Our Sponsors
                </h2>
      
                <div className="border-t-2 border-rose-700 w-20 mx-auto" />
      
               <SponsorZone
               contentType="ANNOUNCEMENT"
               contentId={null}
               levels={["PREMIER", "FEATURED"]}
               slots={4}
               />
              </div>
            </section>
      
    </main>
  );
}