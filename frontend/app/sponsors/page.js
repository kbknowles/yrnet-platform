export default function SponsorsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      {/* Page Header */}
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-ahsra-blue">
          Our Sponsors
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-700">
          The Alabama High School Rodeo Association is proud to be supported by
          businesses and organizations that believe in youth, sportsmanship,
          and the western way of life.
        </p>
      </section>

      {/* Sponsor Grid */}
      <section>
        <h2 className="text-xl font-semibold text-ahsra-blue mb-6 text-center">
          Thank You to Our Sponsors
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
          {/* Placeholder sponsor cards */}
          <div className="h-24 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-600">
            Sponsor Logo
          </div>
          <div className="h-24 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-600">
            Sponsor Logo
          </div>
          <div className="h-24 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-600">
            Sponsor Logo
          </div>
          <div className="h-24 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-600">
            Sponsor Logo
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-ahsra-blue text-white rounded-xl p-10 text-center">
        <h2 className="text-2xl font-bold">
          Become an AHSRA Sponsor
        </h2>
        <p className="mt-4 max-w-xl mx-auto">
          Sponsorship opportunities are available for events, athletes, and
          statewide exposure throughout the rodeo season.
        </p>
        <a
          href="mailto:secretary@ahsra.org"
          className="inline-block mt-6 bg-white text-ahsra-blue font-semibold px-6 py-3 rounded"
        >
          Contact Us About Sponsorship
        </a>
      </section>
    </main>
  );
}
