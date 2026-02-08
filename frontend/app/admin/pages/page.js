// filepath: frontend/app/admin/pages/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPagesPage() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/pages`)
      .then((res) => res.json())
      .then(setPages);
  }, []);

  const menuPages = pages
    .filter((p) => p.showInMenu)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const footerPages = pages
    .filter((p) => p.showInFooter)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-ahsra-blue">
          Pages & Navigation
        </h1>
        <Link href="/admin/pages/new" className="btn-primary">
          Add Page
        </Link>
      </header>

      {/* MENU PREVIEW */}
      <section className="grid md:grid-cols-2 gap-6">
        <MenuPreview
          title="Main Menu Preview"
          pages={menuPages}
        />
        <MenuPreview
          title="Footer Menu Preview"
          pages={footerPages}
        />
      </section>

      {/* PAGE LIST */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          All Pages
        </h2>

        <div className="border rounded-lg divide-y bg-white">
          {pages.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <div className="font-medium">
                  {p.title}
                </div>
                <div className="text-xs text-gray-500">
                  /{p.slug}
                  {p.isPlaceholder && " • Placeholder"}
                  {p.status !== "published" && " • Draft"}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {p.showInMenu && (
                  <span className="badge">Menu</span>
                )}
                {p.showInFooter && (
                  <span className="badge">Footer</span>
                )}

                <Link
                  href={`/admin/pages/${p.id}`}
                  className="text-ahsra-blue font-medium underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function MenuPreview({ title, pages }) {
  return (
    <div className="border rounded-lg bg-white p-4">
      <h3 className="font-semibold mb-3">
        {title}
      </h3>

      {pages.length === 0 ? (
        <p className="text-sm text-gray-500">
          No pages assigned.
        </p>
      ) : (
        <ol className="space-y-2 text-sm">
          {pages.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center"
            >
              <span>
                {p.title}
                {p.isPlaceholder && (
                  <span className="text-xs text-gray-500">
                    {" "} (coming soon)
                  </span>
                )}
              </span>
              <span className="text-gray-400">
                {p.sortOrder}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
