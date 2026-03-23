// filepath: frontend/app/[tenantSlug]/admin/page.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import authFetch from "../../../utils/authFetch";
import { getBasePath } from "../../../utils/getBasePath";

export default function AdminIndexPage() {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const basePath = getBasePath(tenantSlug);
  const adminBase = `${basePath}/admin`;

  const [authorized, setAuthorized] = useState(false);

  const [stats, setStats] = useState({
    activeSeason: "—",
    upcomingRodeo: "—",
    sponsors: 0,
    athletes: 0,
    locations: 0,
    officers: 0,
    pages: 0,
    galleryAlbums: 0,
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push(basePath || "/");
      return;
    }

    setAuthorized(true);
  }, [tenantSlug, router, basePath]);

  useEffect(() => {
    if (!tenantSlug || !authorized) return;

    async function loadStats() {
      try {
        const [
          seasonsRes,
          rodeosRes,
          sponsorsRes,
          athletesRes,
          locationsRes,
          officersRes,
          pagesRes,
          galleryRes,
        ] = await Promise.all([
          authFetch(`/${tenantSlug}/admin/seasons`, { cache: "no-store" }),
          authFetch(`/${tenantSlug}/admin/rodeos`, { cache: "no-store" }),
          authFetch(`/${tenantSlug}/admin/sponsors`, { cache: "no-store" }),
          authFetch(`/${tenantSlug}/admin/athletes`, { cache: "no-store" }),
          authFetch(`/${tenantSlug}/admin/locations`, { cache: "no-store" }),
          authFetch(`/${tenantSlug}/admin/officers`, { cache: "no-store" }),
          authFetch(`/${tenantSlug}/admin/pages`, { cache: "no-store" }),
          authFetch(`/${tenantSlug}/admin/gallery`, { cache: "no-store" }),
        ]);

        if (
          [seasonsRes, rodeosRes, sponsorsRes, athletesRes].some(
            (res) => res.status === 401 || res.status === 403
          )
        ) {
          router.push(basePath || "/");
          return;
        }

        const [
          seasonsData,
          rodeosData,
          sponsorsData,
          athletesData,
          locationsData,
          officersData,
          pagesData,
          galleryData,
        ] = await Promise.all([
          seasonsRes.ok ? seasonsRes.json() : [],
          rodeosRes.ok ? rodeosRes.json() : [],
          sponsorsRes.ok ? sponsorsRes.json() : [],
          athletesRes.ok ? athletesRes.json() : [],
          locationsRes.ok ? locationsRes.json() : [],
          officersRes.ok ? officersRes.json() : [],
          pagesRes.ok ? pagesRes.json() : [],
          galleryRes.ok ? galleryRes.json() : [],
        ]);

        const seasons = Array.isArray(seasonsData) ? seasonsData : [];
        const rodeos = Array.isArray(rodeosData) ? rodeosData : [];
        const sponsors = Array.isArray(sponsorsData) ? sponsorsData : [];
        const athletes = Array.isArray(athletesData) ? athletesData : [];
        const locations = Array.isArray(locationsData) ? locationsData : [];
        const officers = Array.isArray(officersData) ? officersData : [];
        const pages = Array.isArray(pagesData) ? pagesData : [];
        const galleryAlbums = Array.isArray(galleryData) ? galleryData : [];

        const activeSeason =
          seasons.find((season) => season.active)?.year || "—";

        const now = new Date();

        const upcomingRodeo =
          rodeos
            .filter((rodeo) => rodeo?.startDate)
            .sort(
              (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()
            )
            .find((rodeo) => new Date(rodeo.startDate) >= now)?.name || "—";

        setStats({
          activeSeason,
          upcomingRodeo,
          sponsors: sponsors.length,
          athletes: athletes.length,
          locations: locations.length,
          officers: officers.length,
          pages: pages.length,
          galleryAlbums: galleryAlbums.length,
        });
      } catch {
        setStats({
          activeSeason: "—",
          upcomingRodeo: "—",
          sponsors: 0,
          athletes: 0,
          locations: 0,
          officers: 0,
          pages: 0,
          galleryAlbums: 0,
        });
      }
    }

    loadStats();
  }, [tenantSlug, authorized, router, basePath]);

  if (!authorized) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary">
          Admin Dashboard
        </h1>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Season" value={stats.activeSeason} />
        <StatCard label="Next Rodeo" value={stats.upcomingRodeo} />
        <StatCard label="Athletes" value={stats.athletes} />
        <StatCard label="Sponsors" value={stats.sponsors} />
        <StatCard label="Locations" value={stats.locations} />
        <StatCard label="Officers" value={stats.officers} />
        <StatCard label="Pages" value={stats.pages} />
        <StatCard label="Albums" value={stats.galleryAlbums} />
      </section>

      <section className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <AdminGroup title="Season">
            <AdminItem href={`${adminBase}/seasons`} label="Rodeo Season" />
            <AdminItem href={`${adminBase}/rodeos`} label="Rodeos" />
            <AdminItem href={`${adminBase}/locations`} label="Locations" />
          </AdminGroup>

          <AdminGroup title="People">
            <AdminItem href={`${adminBase}/athletes`} label="Athletes" />
            <AdminItem href={`${adminBase}/officers`} label="Officers" />
            <AdminItem href={`${adminBase}/sponsors`} label="Sponsors" />
            <AdminItem href={`${adminBase}/sponsorships`} label="Sponsorships" />
          </AdminGroup>

          <AdminGroup title="Website">
            <AdminItem href={`${adminBase}/announcements`} label="Announcements" />
            <AdminItem href={`${adminBase}/gallery`} label="Gallery" />
            <AdminItem href={`${adminBase}/pages`} label="Pages" />
          </AdminGroup>
        </div>

        <aside className="bg-gray-50 border rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            Quick Actions
          </h2>

          <div className="space-y-3 text-sm">
            <Link
              href={basePath || "/"}
              className="block text-primary hover:underline"
            >
              View Website
            </Link>

            <Link
              href={`${adminBase}/announcements`}
              className="block text-primary hover:underline"
            >
              Manage Announcements
            </Link>

            <Link
              href={`${adminBase}/rodeos`}
              className="block text-primary hover:underline"
            >
              Manage Rodeos
            </Link>

            <Link
              href={`${adminBase}/athletes/new`}
              className="block text-primary hover:underline"
            >
              Add Athlete
            </Link>

            <Link
              href={`${adminBase}/sponsors`}
              className="block text-primary hover:underline"
            >
              Manage Sponsors
            </Link>

            <Link
              href={`${adminBase}/pages/new`}
              className="block text-primary hover:underline"
            >
              Add Page
            </Link>

            <Link
              href={`${adminBase}/gallery`}
              className="block text-primary hover:underline"
            >
              Manage Gallery
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}

function AdminGroup({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-primary mb-3">
        {title}
      </h2>
      <div className="space-y-2 text-sm border-l pl-4">
        {children}
      </div>
    </div>
  );
}

function AdminItem({ href, label }) {
  return (
    <Link
      href={href}
      className="block text-gray-800 hover:text-primary transition"
    >
      {label}
    </Link>
  );
}