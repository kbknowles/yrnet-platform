// filepath: frontend/app/learn-more/page.js

export default function LearnMorePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-ahsra-blue mb-6">
        Learn More About AHSRA
      </h1>

      <p className="text-lg text-gray-700 mb-10">
        The Alabama High School Rodeo Association supports youth athletes,
        promotes sportsmanship, and creates opportunities through organized
        competition, education, and community involvement.
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Members */}
        <section className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-ahsra-red mb-3">
            For Members
          </h2>
          <p className="text-gray-700">
            Information about membership, rodeo participation, seasons,
            eligibility, and athlete resources will be available here soon.
          </p>
        </section>

        {/* Sponsors */}
        <section className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-ahsra-red mb-3">
            For Sponsors
          </h2>
          <p className="text-gray-700">
            Sponsorship opportunities, visibility options, and ways to support
            Alabama’s youth rodeo athletes will be outlined here.
          </p>
        </section>
      </div>

      <div className="mt-16 text-sm text-gray-500">
        More details coming soon.
      </div>
    </main>
  );
}
