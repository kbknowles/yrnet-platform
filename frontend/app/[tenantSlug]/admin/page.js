// filepath: frontend/app/admin/page.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminIndexPage() {
  const [stats, setStats] = useState({
    activeSeason: "—",
    upcomingEvent: "—",
    sponsors: 0,
    athletes: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
          cache: "no-store",
        });
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
  }, []);

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
            <AdminItem href="/admin/seasons" label="Rodeo Season" />
            <AdminItem href="/admin/rodeos" label="Rodeos" />
            <AdminItem href="/admin/locations" label="Locations" />
          </AdminGroup>

          <AdminGroup title="People">
            <AdminItem href="/admin/athletes" label="Athletes" />
            <AdminItem href="/admin/officers" label="Officers" />
            <AdminItem href="/admin/sponsors" label="Sponsors" />
          </AdminGroup>

          <AdminGroup title="Website">
            <AdminItem href="/admin/announcements" label="Announcements" />
            <AdminItem href="/admin/gallery" label="Gallery" />
            <AdminItem href="/admin/pages" label="Pages" />
          </AdminGroup>

        </div>

        {/* RIGHT COLUMN */}
        <aside className="bg-gray-50 border rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            Quick Actions
          </h2>

          <div className="space-y-3 text-sm">
            <Link href="/" className="block text-primary hover:underline">
              View Website
            </Link>
            <Link href="/admin/announcements/new" className="block text-primary hover:underline">
              Add Announcement
            </Link>
            <Link href="/admin/events/new" className="block text-primary hover:underline">
              Add Event
            </Link>
            <Link href="/admin/athletes/new" className="block text-primary hover:underline">
              Add Athlete
            </Link>
            <Link href="/admin/sponsors/new" className="block text-primary hover:underline">
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