// filepath: frontend/components/home/HomeHero.js
"use client";

import Image from "next/image";
import Link from "next/link";
import useTenantSlug from "hooks/useTenantSlug";

function formatTenantName(slug) {
  if (!slug) return "Association";

  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function HomeHero() {
  const tenantSlug = useTenantSlug();
  const tenantName = formatTenantName(tenantSlug);

  return (
    <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh]">
      <Image
        src="/images/hero.png"
        alt={tenantName}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="px-4 sm:px-6 max-w-4xl text-white">
          <h1 className="leading-tight">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-wide uppercase">
              {tenantName.toUpperCase()}
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold mt-2">
              Rodeo Association
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 text-md sm:text-lg md:text-xl lg:text-2xl font-normal text-white/90">
            Built on tradition. Powered by youth.
          </p>

          <div className="mt-6 sm:mt-8">
            <Link
              href="/learn-more"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm sm:text-base font-medium text-gray-900 hover:bg-gray-100 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}