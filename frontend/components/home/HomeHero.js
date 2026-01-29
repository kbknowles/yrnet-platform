// filepath: frontend/components/home/HomeHero.js

import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="relative w-full h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh]">
      <Image
        src="/images/hero.png"
        alt="Alabama High School Rodeo Association"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="px-4 sm:px-6 max-w-3xl text-white">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
            Welcome
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/90">
            Built on tradition. Powered by youth.
          </p>
        </div>
      </div>
    </section>
  );
}
