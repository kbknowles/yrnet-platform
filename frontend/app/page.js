import Link from "next/link";

async function getNextThreeRodeos() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/schedule`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const events = await res.json();
  const today = new Date();

  return events
    .filter(e => new Date(e.startDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);
}

export default async function HomePage() {
  const upcoming = await getNextThreeRodeos();

  return (
    <main className="bg-gray-100 text-gray-900 flex flex-col min-h-screen">

      {/* Hero Section */}
      <header
        className="relative text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Alabama High School Rodeo Association
          </h1>
          <p className="mt-4 text-lg">
            Promoting youth, sportsmanship, and the western way of life
          </p>
          <a
            href="#join"
            className="inline-block mt-6 border border-white px-6 py-3 text-lg hover:bg-white hover:text-black transition"
          >
            Join Now
          </a>
        </div>
      </header>

      {/* Intro */}
      <section className="bg-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="inline-block border-b-4 border-red-700 pb-1 text-2xl font-semibold text-blue-900">
            What We Do
          </h2>
          <p className="mt-6 text-gray-700">
            AHSRA provides student athletes in Alabama the opportunity to compete
            in professional-style rodeo events while building character,
            confidence, and connections that last a lifetime.
          </p>
        </div>
      </section>

      {/* Upcoming Rodeos */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="inline-block border-b-4 border-red-700 pb-1 mb-10 text-2xl font-semibold text-blue-900">
            Upcoming Rodeos
          </h2>

          {upcoming.length === 0 ? (
            <div className="rounded-lg border bg-white p-6 text-center">
              <p className="text-gray-700">
                Upcoming rodeos will be posted soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {upcoming.map(event => (
                <div
                  key={event.id}
                  className="border rounded-xl bg-white p-5 shadow-sm hover:scale-[1.02] transition"
                >
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startDate).toLocaleDateString()} –{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm">
                    {event.location?.city}, {event.location?.state}
                  </p>
                  <Link
                    href={`/schedule/${event.slug}`}
                    className="inline-block mt-3 text-sm text-blue-700 underline"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Athlete Spotlight */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="inline-block border-b-4 border-red-700 pb-1 mb-10 text-2xl font-semibold text-blue-900">
            Athlete Spotlight
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-gray-300" />
              <h5 className="font-semibold">Chanlee Turner</h5>
              <p className="text-sm text-gray-600">
                Barrel Racing | Class of 2025
              </p>
              <a
                href="#"
                className="inline-block mt-3 text-sm text-blue-700 underline"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="bg-gray-100 py-16 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="inline-block border-b-4 border-red-700 pb-1 text-2xl font-semibold text-blue-900">
            Thank You to Our Sponsors
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="h-16 w-40 bg-gray-300 rounded" />
            <div className="h-16 w-40 bg-gray-300 rounded" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="join"
        className="py-16 text-center text-white"
        style={{ backgroundColor: "#3c3b6e" }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Ready to Ride?</h2>
          <p className="mt-4 text-lg">
            Become a member of the Alabama High School Rodeo Association today.
          </p>
          <a
            href="/membership"
            className="inline-block mt-6 bg-white text-blue-900 px-6 py-3 text-lg font-semibold"
          >
            Join AHSRA
          </a>
        </div>
      </section>

    </main>
  );
}
