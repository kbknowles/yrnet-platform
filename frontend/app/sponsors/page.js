// filepath: frontend/app/sponsors/page.js

import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

async function getSponsors() {
  try {
    const res = await fetch(`${API_BASE}/api/sponsors`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors();

  const activeSponsors = sponsors.filter((s) => s.active);

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      {/* Page Header */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-ahsra-blue">
          Our Sponsors
        </h1>
        <p className="max-w-2xl mx-auto text-gray-700">
          The Alabama High School Rodeo Association is proud to be supported by
          businesses and organizations that believe in youth, sportsmanship,
          and the western way of life.
        </p>
      </section>

      {/* Sponsors Grid */}
      <section>
        <h2 className="text-xl font-semibold text-ahsra-blue mb-8 text-center">
          Support Our Sponsors
        </h2>

        {activeSponsors.length === 0 ? (
          <p className="text-center text-gray-600">
            Sponsor listings coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
            {activeSponsors.map((s) => {
              const imageSrc = resolveImage(s.logoUrl || s.bannerUrl);

              return (
                <a
                  key={s.id}
                  href={s.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-28 rounded border border-gray-200 bg-white flex items-center justify-center p-4 hover:shadow-md transition"
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={s.name}
                      width={240}
                      height={120}
                      unoptimized
                      className="max-h-20 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-center text-ahsra-blue">
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
      <section className="bg-ahsra-blue text-white rounded-xl p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold">
          Become an AHSRA Sponsor
        </h2>
        <p className="max-w-xl mx-auto">
          Sponsorship opportunities are available for events, athletes, and
          statewide exposure throughout the rodeo season.
        </p>
        <a
          href="mailto:secretary@ahsra.org"
          className="inline-block mt-4 bg-white text-ahsra-blue font-semibold px-6 py-3 rounded"
        >
          Contact Us About Sponsorship
        </a>
      </section>
    </main>
  );
}
