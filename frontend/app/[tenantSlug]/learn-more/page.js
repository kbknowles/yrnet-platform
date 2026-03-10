// filepath: frontend/app/[tenantSlug]/learn-more/page.js

import SponsorZone from "components/sponsorship/SponsorZone";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getHomeData(tenantSlug) {
  const res = await fetch(`${API_BASE}/${tenantSlug}/home`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { tenant: null };
  }

  return res.json();
}

export default async function LearnMorePage({ params }) {
  const { tenantSlug } = await params;

  const homeData = await getHomeData(tenantSlug);
  const tenant = homeData?.tenant;

  const associationName = tenant?.name || "Our Association";

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <section className="space-y-6">
        <h1 className="text-3xl font-semibold text-primary">
          Learn More About {associationName}
        </h1>

        <p className="text-lg text-gray-700">
          {associationName} supports youth athletes, promotes sportsmanship,
          and creates opportunities through organized competition, education,
          and community involvement.
        </p>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Members */}
        <section className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-accent">
            For Members
          </h2>
          <p className="text-gray-700">
            Information about membership, rodeo participation, seasons,
            eligibility, and athlete resources will be available here soon.
          </p>
        </section>

        {/* Sponsors */}
        <section className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-accent">
            For Sponsors
          </h2>
          <p className="text-gray-700">
            Sponsorship opportunities, visibility options, and ways to support
            youth rodeo athletes will be outlined here.
          </p>
        </section>
      </div>

      <div className="pt-8 text-sm text-gray-500">
        More details coming soon.
      </div>

      {/* SPONSORS */}
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