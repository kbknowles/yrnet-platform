// filepath: frontend/app/admin/page.js

"use client";

import Link from "next/link";

export default function AdminIndexPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-ahsra-blue">
        AHSRA Admin
      </h1>

      <p className="text-gray-700">
        Manage schedules, updates, and site content.
      </p>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <AdminCard
          title="Seasons"
          href="/admin/seasons"
          description="Manage rodeo seasons and active year"
        />

        <AdminCard
          title="Events & Schedule"
          href="/admin/events"
          description="Add and update rodeos on the public schedule"
        />

        <AdminCard
          title="Locations"
          href="/admin/locations"
          description="Rodeo venues and facility information"
        />

        <AdminCard
          title="Announcements"
          href="/admin/announcements"
          description="Post important updates and notices"
        />

        <AdminCard
          title="Gallery"
          href="/admin/gallery"
          description="Create albums and upload photos"
        />

        <AdminCard
          title="Pages"
          href="/admin/pages"
          description="Edit About, Contact, Rules, and other pages"
        />

        <AdminCard
          title="Officers"
          href="/admin/officers"
          description="Manage board members and contacts"
        />

        <AdminCard
          title="Sponsors"
          href="/admin/sponsors"
          description="Sponsors and partner listings"
        />
      </section>
    </main>
  );
}

function AdminCard({ title, href, description }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border bg-white p-6 hover:shadow-md transition"
    >
      <h2 className="text-lg font-semibold text-ahsra-blue">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {description}
      </p>
    </Link>
  );
}
