// filepath: frontend/app/[tenantSlug]/admin/page.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminIndexPage() {
  const { tenantSlug } = useParams();

  const [stats, setStats] = useState({
    activeSeason: "—",
    upcomingEvent: "—",
    sponsors: 0,
    athletes: 0,
  });

  useEffect(() => {
    if (!tenantSlug) return;

    async function loadStats() {
      try {
        const res = await fetch(
          `${API_BASE}/${tenantSlug}/admin/dashboard`,
          { cache: "no-store" }
        );

        if (!res.ok) return;

        const data = await res.json();

        setStats({
          activeSeason: data.activeSeason || "—",
          upcomingEvent: data.upcomingEvent || "—",
          sponsors: data.sponsorCount || 0,
          athletes: data.athleteCount || 0,
        });
      } catch {
        // silent fail
      }
    }

    loadStats();
  }, [tenantSlug]);

  const base = `/${tenantSlug}/admin`;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-primary">
          Admin Dashboard
        </h1>
      </header>

      {/* Command Strip */}
      <section className="text-sm text-gray-700 border-b pb-4 flex flex-wrap gap-6">
        <div>
          <span className="font-semibold text-gray-900">Active Season:</span>{" "}
          {stats.activeSeason}
        </div>
        <div>
          <span className="font-semibold text-gray-900">Next Rodeo:</span>{" "}
          {stats.upcomingEvent}
        </div>
        <div>
          <span className="font-semibold text-gray-900">Athletes:</span>{" "}
          {stats.athletes}
        </div>
        <div>
          <span className="font-semibold text-gray-900">Sponsors:</span>{" "}
          {stats.sponsors}
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="grid md:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-8">

          <AdminGroup title="Season">
            <AdminItem href={`${base}/seasons`} label="Rodeo Season" />
            <AdminItem href={`${base}/rodeos`} label="Rodeos" />
            <AdminItem href={`${base}/locations`} label="Locations" />
          </AdminGroup>

          <AdminGroup title="People">
            <AdminItem href={`${base}/athletes`} label="Athletes" />
            <AdminItem href={`${base}/officers`} label="Officers" />
            <AdminItem href={`${base}/sponsors`} label="Sponsors" />
          </AdminGroup>

          <AdminGroup title="Website">
            <AdminItem href={`${base}/announcements`} label="Announcements" />
            <AdminItem href={`${base}/gallery`} label="Gallery" />
            <AdminItem href={`${base}/pages`} label="Pages" />
          </AdminGroup>

        </div>

        {/* RIGHT COLUMN */}
        <aside className="bg-gray-50 border rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            Quick Actions
          </h2>

          <div className="space-y-3 text-sm">
            <Link href={`/${tenantSlug}`} className="block text-primary hover:underline">
              View Website
            </Link>
            <Link href={`${base}/announcements/new`} className="block text-primary hover:underline">
              Add Announcement
            </Link>
            <Link href={`${base}/events/new`} className="block text-primary hover:underline">
              Add Event
            </Link>
            <Link href={`${base}/athletes/new`} className="block text-primary hover:underline">
              Add Athlete
            </Link>
            <Link href={`${base}/sponsors/new`} className="block text-primary hover:underline">
              Add Sponsor
            </Link>
          </div>
        </aside>
      </section>
    </main>
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