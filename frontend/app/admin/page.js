// filepath: frontend/app/admin/page.js

"use client";

import Link from "next/link";

export default function AdminIndexPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-ahsra-blue">
          AHSRA Admin Dashboard
        </h1>
        <p className="text-gray-700">
          Manage site content, schedules, and association data.
        </p>
      </header>

      {/* CONTENT MANAGEMENT */}
      <AdminSection title="Content">
        <AdminCard
          title="Pages & Navigation"
          href="/admin/pages"
          description="Control menu items, order, and placeholder pages"
        />
        <AdminCard
          title="Announcements"
          href="/admin/announcements"
          description="Post important notices and updates"
        />
        <AdminCard
          title="Gallery"
          href="/admin/gallery"
          description="Albums and photo uploads"
        />
      </AdminSection>

      {/* EVENTS & SCHEDULE */}
      <AdminSection title="Schedule">
        <AdminCard
          title="Seasons"
          href="/admin/seasons"
          description="Manage active rodeo seasons"
        />
        <AdminCard
          title="Events & Rodeos"
          href="/admin/events"
          description="Public schedule and event details"
        />
        <AdminCard
          title="Locations"
          href="/admin/locations"
          description="Rodeo venues and facilities"
        />
      </AdminSection>

      {/* PEOPLE */}
      <AdminSection title="People">
        <AdminCard
          title="Officers"
          href="/admin/officers"
          description="Board members and leadership"
        />
        <AdminCard
          title="Sponsors"
          href="/admin/sponsors"
          description="Sponsors and partners"
        />
      </AdminSection>
    </main>
  );
}

function AdminSection({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

function AdminCard({ title, href, description }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border bg-white p-6 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-ahsra-blue">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        {description}
      </p>
    </Link>
  );
}
