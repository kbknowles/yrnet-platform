import HomeHero from "../components/home/HomeHero";
import HomeMission from "../components/home/HomeMission";
import UpcomingRodeos from "../components/home/UpcomingRodeos";
import LatestAnnouncements from "../components/home/LatestAnnouncements";
import EventGallery from "../components/home/EventGallery";
import SponsorStrip from "../components/home/SponsorStrip";
import HomeCTA from "../components/home/HomeCTA";

export default async function HomePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  console.log("HOMEPAGE API_BASE:", API_BASE);

  async function safeFetch(url) {
    console.log("FETCHING:", url);

    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    console.log("RESPONSE STATUS:", res.status);
    console.log("RESPONSE PREVIEW:", text.slice(0, 200));

    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(`Invalid JSON from ${url}`);
    }
  }

  const [events, announcements, sponsors, galleryAlbums] = await Promise.all([
    safeFetch(`${API_BASE}/api/events?status=published`),
    safeFetch(`${API_BASE}/api/announcements?published=true`),
    safeFetch(`${API_BASE}/api/sponsors?active=true`),
    safeFetch(`${API_BASE}/api/gallery`),
  ]);

  return (
    <>
      <HomeHero />

      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        <UpcomingRodeos events={events} />
        <LatestAnnouncements announcements={announcements} />
      </section>

      <HomeMission />

      <EventGallery albums={galleryAlbums} />

      <SponsorStrip sponsors={sponsors} />

      <HomeCTA />
    </>
  );
}
