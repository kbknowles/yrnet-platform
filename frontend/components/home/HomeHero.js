// filepath: frontend/components/home/HomeHero.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";
import { resolveTenantMedia } from "lib/media";
import { getBasePath } from "../../utils/getBasePath";

/*
  Split tenant name for hero display.
*/
function splitTenantName(name) {
  if (typeof name !== "string") {
    return { line1: "", line2: "" };
  }

  const match = name.match(/^(.*)\s(Rodeo Association)$/i);

  if (match) {
    return {
      line1: match[1],
      line2: match[2],
    };
  }

  return {
    line1: name,
    line2: "",
  };
}

export default function HomeHero({ tenant }) {
  const tenantSlug = useTenantSlug();
  const basePath = getBasePath(tenantSlug);

  if (!tenant?.heroEnabled) return null;

  const { line1, line2 } = splitTenantName(
    tenant?.heroTitle || tenant?.name || ""
  );

  const heroImage = resolveTenantMedia({
    tenantSlug,
    folder: "images",
    filename: tenant?.heroImageUrl,
  });

  const ctaHref = tenant?.heroCtaLink
    ? tenant.heroCtaLink
    : `${basePath}/learn-more`;

  return (
    <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh]">
      {heroImage && (
        <Image
          src={heroImage}
          alt={tenant?.name || ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      )}

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="hero px-4 sm:px-6 max-w-4xl">
          <h1 className="leading-tight">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-wide uppercase">
              {line1.toUpperCase()}
            </span>

            {line2 && (
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold mt-2">
                {line2}
              </span>
            )}
          </h1>

          {(tenant?.heroSubtitle || "Built on tradition. Powered by youth.") && (
            <p className="mt-3 sm:mt-4 text-md sm:text-lg md:text-xl lg:text-2xl font-normal text-white/90">
              {tenant?.heroSubtitle || "Built on tradition. Powered by youth."}
            </p>
          )}

          {(tenant?.heroCtaText || true) && (
            <div className="mt-6 sm:mt-8">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm sm:text-base font-medium text-gray-900 hover:bg-gray-100 transition"
              >
                {tenant?.heroCtaText || "Learn More"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}