import HomeHero from "../components/home/HomeHero";
import HomeMission from "../components/home/HomeMission";
import UpcomingRodeos from "../components/home/UpcomingRodeos";
import LatestAnnouncements from "../components/home/LatestAnnouncements";
import EventGallery from "../components/home/EventGallery";
import SponsorStrip from "../components/home/SponsorStrip";
import HomeCTA from "../components/home/HomeCTA";



export default async function HomePage() {
const API = process.env.NEXT_PUBLIC_API_URL;

const [events, announcements, sponsors, galleryAlbums] = await Promise.all([
    fetch(`${API}/api/events?status=published`, {
      cache: "no-store",
    }).then((r) => r.json()),

    fetch(`${API}/api/announcements?published=true`, {
      cache: "no-store",
    }).then((r) => r.json()),

    fetch(`${API}/api/sponsors?active=true`, {
      cache: "no-store",
    }).then((r) => r.json()),

    fetch(`${API}/api/gallery`, {
      cache: "no-store",
    }).then((r) => r.json()),
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
