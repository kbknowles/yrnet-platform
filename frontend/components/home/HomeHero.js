// filepath: frontend/components/home/HomeHero.js

import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh]">
      <Image
        src="/images/hero.png"
        alt="Alabama High School Rodeo Association"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="px-4 sm:px-6 max-w-4xl text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight">
            Alabama High School Rodeo Association
          </h1>

          <p className="mt-3 sm:mt-4 text-md sm:text-lg md:text-xl lg:text-2xl font-normal text-white/90">
            Built on tradition. Powered by youth.
          </p>

          <div className="mt-6 sm:mt-8">
            <button className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm sm:text-base font-medium text-gray-900 hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
