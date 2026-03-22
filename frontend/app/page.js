// filepath: frontend/app/page.js

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col">

<section className="relative h-[70vh] flex items-center justify-center text-center">

  {/* background image */}
  <img
    src="/yrnet-hero.png"
    alt="Youth Rodeo"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* dark overlay */}
  <div className="absolute inset-0 bg-black/60" />

  {/* content */}
  <div className="backdrop-blur-sm relative z-10 max-w-3xl px-4 text-white flex flex-col items-center">

    {/* spacer so text sits below logo */}
    <div className="h-32 md:h-40" />

    <h1 className="text-3xl md:text-5xl font-bold mb-4">
      Modern Websites for Youth Rodeo Associations
    </h1>

    <p className="text-lg md:text-xl mb-6">
      Showcase your athletes. Highlight your events. Elevate your association.
    </p>

    {/* CTA buttons */}
    <div className="flex flex-wrap justify-center gap-4">
      <a
        href="/demo"
        className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded font-semibold"
      >
        View Demo
      </a>

      <a
        href="/contact"
        className="border border-white hover:bg-white hover:text-black px-6 py-3 rounded font-semibold"
      >
        Request Info
      </a>
    </div>

  </div>
</section>

      {/* WHAT YOU GET */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Everything Your Association Needs
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              "Athlete Profiles",
              "Rodeo Schedule",
              "Results & Standings",
              "Announcements",
              "Photo Galleries",
              "Sponsor Display System",
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold text-lg text-gray-800">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATHLETE SPOTLIGHT */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Athlete Spotlight
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded shadow p-4">
                <div className="h-48 bg-gray-200 mb-4" />
                <h3 className="font-semibold text-gray-800">Athlete Name</h3>
                <p className="text-sm text-gray-600">
                  Bio preview with achievements and goals.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Built-In Sponsor Visibility
          </h2>

          <p className="text-gray-600 mb-8">
            Showcase your sponsors with structured placement across your site.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-white shadow rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* ADMIN PREVIEW */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Simple to Manage
          </h2>

          <p className="text-gray-600 mb-8">
            Update athletes, schedules, and content without technical skills.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-12 px-4 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Simple Pricing
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            Starting at $5,000 setup + $1,000/year
          </p>

          <p className="text-gray-600 mb-6">
            No revenue sharing. You keep all sponsorships and athlete-related income.
          </p>

          <Link
            href="/contact"
            className="bg-red-700 text-white px-6 py-3 rounded font-semibold hover:bg-red-800"
          >
            Schedule a Demo
          </Link>
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