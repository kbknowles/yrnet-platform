// filepath: frontend/components/home/HomeHero.js

import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="relative h-[60vh] w-full">
      <Image
        src="/images/hero.png"
        alt="Alabama High School Rodeo Association"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="px-4 text-white max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome
          </h1>
          <p className="mt-4 text-lg">
            Built on tradition. Powered by youth.
          </p>
        </div>
      </div>
    </section>
  );
}
