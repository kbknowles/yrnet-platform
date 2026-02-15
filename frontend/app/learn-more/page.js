// filepath: frontend/app/learn-more/page.js

import SponsorZone from "../../components/sponsorship/SponsorZone";

export default function LearnMorePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <section className="space-y-6">
        <h1 className="text-3xl font-bold text-ahsra-blue">
          Learn More About AHSRA
        </h1>

        <p className="text-lg text-gray-700">
          The Alabama High School Rodeo Association supports youth athletes,
          promotes sportsmanship, and creates opportunities through organized
          competition, education, and community involvement.
        </p>

        {/* Header Sponsor Zone */}
        <SponsorZone
          contentType={null}
          contentId={null}
          zone="HEADER"
          slots={1}
        />
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Members */}
        <section className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-ahsra-red">
            For Members
          </h2>
          <p className="text-gray-700">
            Information about membership, rodeo participation, seasons,
            eligibility, and athlete resources will be available here soon.
          </p>

          {/* Inline Sponsor Zone */}
          <SponsorZone
            contentType={null}
            contentId={null}
            zone="INLINE"
            slots={1}
          />
        </section>

        {/* Sponsors */}
        <section className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-ahsra-red">
            For Sponsors
          </h2>
          <p className="text-gray-700">
            Sponsorship opportunities, visibility options, and ways to support
            Alabama’s youth rodeo athletes will be outlined here.
          </p>
        </section>
      </div>

      {/* Footer Sponsor Zone */}
      <SponsorZone
        contentType={null}
        contentId={null}
        zone="FOOTER"
        slots={1}
      />

      <div className="pt-8 text-sm text-gray-500">
        More details coming soon.
      </div>
    </main>
  );
}
