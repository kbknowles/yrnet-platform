// filepath: frontend/app/[tenantSlug]/page.js

/*
  Tenant Homepage
  -------------------------------------------------------
  Loads homepage data from the backend aggregate route:

  GET /:tenantSlug/home

  That route returns:
  - tenant
  - announcements
  - upcomingRodeos
  - sponsors
  - featuredAthletes
*/

import { notFound } from "next/navigation";

import HomeHero from "../../components/home/HomeHero";
import HomeMission from "../../components/home/HomeMission";
import HomeHighlights from "../../components/home/HomeHighlights";
import RodeoGallery from "../../components/home/RodeoGallery";
import HomeCTA from "../../components/home/HomeCTA";
import SponsorZone from "../../components/sponsorship/SponsorZone";
import NoticeBar from "components/NoticeBar";

/*
  API base URL for backend requests
*/
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/* ---------------- */
/* SAFE FETCH */
/* ---------------- */

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

/* ---------------- */
/* HOMEPAGE */
/* ---------------- */

export default async function TenantHomePage(props) {
  const params = await props.params;
  const tenantSlug = params?.tenantSlug;

  if (!tenantSlug) {
    notFound();
  }

  /*
    Pull homepage aggregate data
  */

  const homeData = await safeFetch(`${API_BASE}/${tenantSlug}/home`);

  const tenant = homeData?.tenant || null;
  const announcements = homeData?.announcements || [];
  const rodeos = homeData?.upcomingRodeos || [];
  const galleryAlbums = homeData?.galleryAlbums || [];

  const nextThree = Array.isArray(rodeos) ? rodeos.slice(0, 3) : [];

  return (
    <>
      {/* HERO */}
      <HomeHero tenant={tenant} />

      {/* Notice Bar */}
      <NoticeBar
        message="Our new home on the web — we’re just getting started."
         isActive={true}
      />

      {/* HIGHLIGHTS */}
      <HomeHighlights rodeos={nextThree} announcements={announcements} />

      {/* MISSION */}
      <HomeMission tenantSlug={tenantSlug} />

      {/* GALLERY */}
      <RodeoGallery albums={galleryAlbums} tenantSlug={tenantSlug} />

      {/* SPONSORS */}
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

      {/* CTA */}
      <HomeCTA tenantSlug={tenantSlug} />
    </>
  );
}