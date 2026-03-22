// filepath: frontend/app/page.js

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col">

      {/* HERO */}
      <section className="relative h-[70vh] md:h-[75vh] flex items-center justify-center text-center overflow-hidden">

        {/* background image (no logo) */}
        <img
          src="/yrnet-hero.png"
          alt="Youth Rodeo"
          className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

        {/* logo (larger) */}
        <div className="absolute top-14 md:top-20 left-1/2 -translate-x-1/2 z-10">
          <img
            src="/yrnet-logo.png"
            alt="YRNet"
            className="h-24 md:h-36 object-contain"
          />
        </div>

        {/* content */}
        <div className="relative z-10 max-w-4xl px-4 text-white flex flex-col items-center justify-end h-full pb-24 md:pb-32">

          <div className="bg-black/30 backdrop-blur-sm px-4 py-3 rounded">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight text-white">
              <span className="block md:hidden">
                Modern Websites for
                <br />
                Youth Rodeo Associations
              </span>
              <span className="hidden md:block">
                Modern Websites for Youth Rodeo Associations
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-6 text-white">
              Showcase your athletes. Highlight your events. Elevate your association.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link
              href="/demo"
              className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded font-semibold text-white"
            >
              View Demo
            </Link>

            <Link
              href="/contact"
              className="border border-white hover:bg-white hover:text-black px-6 py-3 rounded font-semibold text-white"
            >
              Request Info
            </Link>
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