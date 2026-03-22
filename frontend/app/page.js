// filepath: frontend/app/page.js

import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --- FETCH DEMO DATA ---
async function getDemoData() {
  try {
    const [athletesRes, rodeosRes, sponsorsRes] = await Promise.all([
      fetch(`${API_BASE}/ahsra/athletes`, { cache: "no-store" }),
      fetch(`${API_BASE}/ahsra/rodeos`, { cache: "no-store" }),
      fetch(`${API_BASE}/ahsra/sponsors`, { cache: "no-store" }),
    ]);

    const athletes = athletesRes.ok ? await athletesRes.json() : [];
    const rodeos = rodeosRes.ok ? await rodeosRes.json() : [];
    const sponsors = sponsorsRes.ok ? await sponsorsRes.json() : [];

    return {
      athletes: athletes.slice(0, 3),
      rodeos: rodeos.slice(0, 3),
      sponsors: sponsors.slice(0, 4),
    };
  } catch (err) {
    return { athletes: [], rodeos: [], sponsors: [] };
  }
}

export default async function HomePage() {
  const { athletes, rodeos, sponsors } = await getDemoData();

  return (
    <main className="flex flex-col">

      {/* HERO */}
      <section className="hero relative h-[70vh] md:h-[75vh] flex items-center justify-center text-center overflow-hidden">

        <img
          src="/yrnet-hero.png"
          alt="Youth Rodeo"
          className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

        <div className="absolute top-14 md:top-20 left-1/2 -translate-x-1/2 z-10">
          <img
            src="/yrnet-logo.png"
            alt="YRNet"
            className="h-24 md:h-36 object-contain"
          />
        </div>

        <div className="relative z-10 max-w-4xl px-4 flex flex-col items-center justify-end h-full pb-24 md:pb-32">

          <div className="bg-black/30 backdrop-blur-sm px-4 py-3 rounded">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              <span className="block md:hidden">
                Modern Websites for
                <br />
                Youth Rodeo Associations
              </span>
              <span className="hidden md:block">
                Modern Websites for Youth Rodeo Associations
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-6">
              Showcase your athletes. Keep your community informed.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link
              href="/demo"
              className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded font-semibold"
            >
              View Demo
            </Link>

            <Link
              href="/contact"
              className="border border-white hover:bg-white hover:text-black px-6 py-3 rounded font-semibold"
            >
              Request Info
            </Link>
          </div>

        </div>
      </section>

      {/* SEE IT IN ACTION */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            See It In Action
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-left">

            {/* Athletes */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Athlete Profiles
              </h3>
              {athletes.length ? (
                athletes.map((a) => (
                  <p key={a.id} className="text-sm text-gray-600">
                    {a.firstName} {a.lastName}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-500">Loading...</p>
              )}
            </div>

            {/* Rodeos */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Rodeo Schedule
              </h3>
              {rodeos.length ? (
                rodeos.map((r) => (
                  <p key={r.id} className="text-sm text-gray-600">
                    {r.name}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-500">Loading...</p>
              )}
            </div>

            {/* Sponsors */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Sponsors
              </h3>
              {sponsors.length ? (
                sponsors.map((s) => (
                  <p key={s.id} className="text-sm text-gray-600">
                    {s.name}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-500">Loading...</p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* BUILT FOR YOU */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Built for Youth Rodeo Associations
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              "Showcase athletes and their accomplishments",
              "Keep schedules clear and up to date",
              "Share announcements with your community",
              "Highlight sponsors professionally",
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded shadow">
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT CHANGES */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            What Changes Day One
          </h2>

          <ul className="space-y-3 text-gray-700">
            <li>Your website looks modern and professional</li>
            <li>Athletes get visibility</li>
            <li>Parents stay informed</li>
            <li>Sponsors get real exposure</li>
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Ready to Modernize Your Association?
        </h2>

        <Link
          href="/demo"
          className="bg-gray-800 text-white px-6 py-3 rounded font-semibold hover:bg-black"
        >
          View Live Demo
        </Link>
      </section>

    </main>
  );
}