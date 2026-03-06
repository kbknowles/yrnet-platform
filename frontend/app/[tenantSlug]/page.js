// filepath: frontend/app/[tenantSlug]/page.js

import { notFound } from "next/navigation";

import HomeHero from "../../components/home/HomeHero";
import HomeMission from "../../components/home/HomeMission";
import HomeHighlights from "../../components/home/HomeHighlights";
import RodeoGallery from "../../components/home/RodeoGallery";
import HomeCTA from "../../components/home/HomeCTA";
import SponsorZone from "../../components/sponsorship/SponsorZone";

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

export default async function TenantHomePage(props) {
  const params = await props.params;
  const tenantSlug = params?.tenantSlug;

  if (!tenantSlug) {
    notFound();
  }

  const [homeData, announcements, galleryAlbums] = await Promise.all([
    safeFetch(`${API_BASE}/${tenantSlug}/home`),
    safeFetch(`${API_BASE}/${tenantSlug}/announcements?published=true`),
    softFetch(`${API_BASE}/${tenantSlug}/gallery`, []),
  ]);

  const tenantName = homeData?.tenant?.name || "";

  const rodeosRaw = homeData?.upcomingRodeos || homeData?.rodeos || [];
  const rodeos = Array.isArray(rodeosRaw) ? rodeosRaw : [];

  const sortedRodeos = [...rodeos]
    .filter((r) => r?.startDate)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  return (
    <>
      <HomeHero tenantName={tenantName} />

      <HomeHighlights rodeos={sortedRodeos} announcements={announcements} />

      <HomeMission tenantSlug={tenantSlug} />

      <RodeoGallery albums={galleryAlbums} tenantSlug={tenantSlug} />

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Thank you, Sponsors!
          </h2>

          <p className="text-center text-xl">
            Hit a banner to learn more about a sponsor
          </p>

          <SponsorZone
            tenantSlug={tenantSlug}
            contentType="GLOBAL"
            contentId={null}
            levels={["PREMIER", "FEATURED"]}
            slots={4}
          />
        </div>
      </section>

      <HomeCTA tenantSlug={tenantSlug} />
    </>
  );
}