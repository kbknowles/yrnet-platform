// filepath: frontend/app/sponsors/page.js

import Image from "next/image";
import { headers } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getTenantSlugFromHost(host) {
  const hostname = (host || "").split(":")[0];
  const parts = hostname.split(".");
  if (parts.length >= 3) return parts[0];
  return "demo";
}

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

async function getSponsors(tenantSlug) {
  try {
    const res = await fetch(`${API_BASE}/${tenantSlug}/sponsors`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SponsorsPage() {
  const h = await headers();
  const tenantSlug = getTenantSlugFromHost(h.get("host"));

  const sponsors = await getSponsors(tenantSlug);

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="hero bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-heading md:text-5xl lg:text-6xl">
            Our Sponsors
          </h1>

          <div className="w-24 h-1 bg-accent mx-auto" />

          <p className="mx-auto text-white/90 mb-6 text-lg font-normal text-body lg:text-xl sm:px-16 xl:px-48">
            <span className="block">
              We are proud to be supported by businesses and organizations
            </span>
            <span className="block">
              that believe in youth, sportsmanship, and the western way of life.
            </span>
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <section>
          <h2 className="text-2xl font-semibold text-center text-primary mb-10">
            Support Our Sponsors
          </h2>

          {sponsors.length === 0 ? (
            <p className="text-center text-gray-600">
              Sponsor listings coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
              {sponsors.map((s) => {
                const imageSrc = resolveImage(s.logoUrl || s.bannerUrl);

                return (
                  <a
                    key={s.sponsorshipId || s.id}
                    href={s.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-28 rounded-lg border border-gray-200 bg-white flex items-center justify-center p-4 hover:shadow-md transition"
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={s.name}
                        width={256}
                        height={128}
                        unoptimized
                        className="max-h-28 object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-center text-primary">
                        {s.name}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="bg-white border rounded-xl p-12 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold text-primary">
            Become an AHSRA Sponsor
          </h2>
          <p className="max-w-xl mx-auto text-gray-700">
            Sponsorship opportunities are available for events, athletes, and
            statewide exposure throughout the rodeo season.
          </p>
          <a
            href="mailto:secretary@ahsra.org"
            className="inline-block mt-4 bg-primary text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Contact Us About Sponsorship
          </a>
        </section>
      </section>
    </main>
  );
}