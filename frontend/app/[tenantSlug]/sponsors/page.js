// filepath: frontend/app/[tenantSlug]/sponsors/page.js

import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveImage(filename, tenantSlug) {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;

  const clean = filename.replace(/^\/+/, "");
  return `${API_BASE}/uploads/tenants/${tenantSlug}/sponsors/${clean}`;
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

export default async function SponsorsPage({ params }) {
  const { tenantSlug } = await params;

  const sponsors = await getSponsors(tenantSlug);
  const safeSponsors = Array.isArray(sponsors) ? sponsors : [];

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
        <h2 className="text-2xl font-semibold text-center text-primary mb-10">
          Support Our Sponsors
        </h2>

        {safeSponsors.length === 0 ? (
          <p className="text-center text-gray-600">
            Sponsor listings coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
            {safeSponsors.map((s) => {
              const imageSrc = resolveImage(
                s.logoUrl || s.bannerUrl,
                tenantSlug
              );

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
                      alt={s.name || "Sponsor"}
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

      {/* CALL TO ACTION */}
      <section className="bg-white/90 py-12 text-center">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-primary">
            Become a Sponsor
          </h2>

          <p className="max-w-xl mx-auto text-gray-700">
            Sponsorship opportunities are available for events, athletes, and
            statewide exposure throughout the rodeo season.
          </p>

          <a
            href="mailto:info@yrnet.org"
            className="inline-block mt-4 bg-primary text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Contact Us About Sponsorship
          </a>
        </div>
      </section>
    </main>
  );
}