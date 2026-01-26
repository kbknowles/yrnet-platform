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

export default function HomePage() {
  return (
    <main className="bg-gray-100 text-gray-900">

      {/* HERO */}
      <header
        className="relative text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Alabama High School Rodeo Association
          </h1>
          <p className="max-w-2xl mx-auto text-gray-100">
            Promoting youth, sportsmanship, and the western way of life through
            competitive high school rodeo.
          </p>
        </div>
      </header>

      {/* WHAT IS AHSRA */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-ahsra-blue">
            What Is AHSRA & Why It Matters
          </h2>

          <p>
            The Alabama High School Rodeo Association exists to give student
            athletes the opportunity to compete, grow, and represent the western
            way of life through high school rodeo.
          </p>

          <p>
            Rodeo builds more than skills in the arena. It teaches honesty,
            integrity, humility, and respect — values carried far beyond the
            competition.
          </p>

          <p>
            Win or lose, every rodeo helps shape confident, responsible young
            leaders prepared for life.
          </p>
        </div>
      </section>

      {/* UPCOMING + ANNOUNCEMENTS */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-2">

          {/* UPCOMING RODEOS */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-ahsra-blue">
              Upcoming Rodeos
            </h3>

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-white p-4"
              >
                <p className="font-medium">Rodeo Name</p>
                <p className="text-sm text-gray-600">
                  Location • Date Range
                </p>
              </div>
            ))}

            <a href="/schedule" className="text-sm text-ahsra-blue underline">
              View full schedule →
            </a>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-ahsra-blue">
              Announcements
            </h3>

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-white p-4"
              >
                <p className="font-medium">Announcement Title</p>
                <p className="text-sm text-gray-600">
                  Short announcement summary…
                </p>
              </div>
            ))}

            <a href="/announcements" className="text-sm text-ahsra-blue underline">
              See all announcements →
            </a>
          </div>
        </div>
      </section>

      {/* CURRENT SEASON GALLERY */}
      <section className="bg-white py-16 text-center">
        <h3 className="text-xl font-semibold text-ahsra-blue mb-6">
          Current Season Highlights
        </h3>

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </section>

      {/* SPONSORS */}
      <section className="bg-gray-100 py-16 text-center">
        <h3 className="text-xl font-semibold text-ahsra-blue mb-6">
          Our Sponsors
        </h3>

        <div className="flex justify-center gap-6 flex-wrap">
          <div className="h-16 w-40 bg-gray-300 rounded" />
          <div className="h-16 w-40 bg-gray-300 rounded" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center text-white bg-ahsra-blue">
        <h3 className="text-2xl font-bold">Ready to Ride?</h3>
        <p className="mt-3">
          Learn more about membership, competition, and the season ahead.
        </p>

        <a
          href="/about"
          className="inline-block mt-6 bg-white text-ahsra-blue px-6 py-3 font-semibold"
        >
          Learn More
        </a>
      </section>

    </main>
  );
}

