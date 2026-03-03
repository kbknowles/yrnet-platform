// filepath: frontend/app/page.js

import HomeHero from "../components/home/HomeHero";
import HomeMission from "../components/home/HomeMission";
import HomeHighlights from "../components/home/HomeHighlights";
import RodeoGallery from "../components/home/RodeoGallery";
import HomeCTA from "../components/home/HomeCTA";

import SponsorZone from "../components/sponsorship/SponsorZone";

export default async function HomePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  async function safeFetch(url) {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      let errText = "";
      try {
        errText = await res.text();
      } catch {}
      throw new Error(`Fetch failed ${res.status}: ${errText}`);
    }

    return res.json();
  }

  async function softFetch(url, fallback) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return fallback;
      return await res.json();
    } catch {
      return fallback;
    }
  }

  const [homeData, announcements, galleryAlbums] =
    await Promise.all([
      safeFetch(`${API_BASE}/api/home`),
      safeFetch(`${API_BASE}/api/announcements?published=true`),
      softFetch(`${API_BASE}/api/gallery`, []),
    ]);

  const { rodeos } = homeData;

  return (
    <>
      <HomeHero />

      <HomeHighlights
        rodeos={rodeos}
        announcements={announcements}
      />

      <HomeMission />

      <RodeoGallery albums={galleryAlbums} />

      {/* Sponsors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Thank you, Sponsors!
            
          </h2>
            <p className="text-center text-xl">Hit a banner to learn more about a sponsor</p> 
            
          <SponsorZone
            contentType="GLOBAL"
            contentId={null}
            levels={["PREMIER", "FEATURED"]}
            slots={4}
          />
        </div>
      </section>

      <HomeCTA />
    </>
  );
}
