// filepath: frontend/app/page.js

import HomeHero from "../components/home/HomeHero";
import HomeMission from "../components/home/HomeMission";
import HomeHighlights from "../components/home/HomeHighlights";
import EventGallery from "../components/home/EventGallery";
import SponsorStrip from "../components/home/SponsorStrip";
import HomeCTA from "../components/home/HomeCTA";

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

  const [homeData, announcements, sponsors, galleryAlbums] =
    await Promise.all([
      safeFetch(`${API_BASE}/api/home`),
      safeFetch(`${API_BASE}/api/announcements?published=true`),
      safeFetch(`${API_BASE}/api/sponsors?active=true`),
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

      <EventGallery albums={galleryAlbums} />

      <SponsorStrip sponsors={sponsors} />

      <HomeCTA />
    </>
  );
}
