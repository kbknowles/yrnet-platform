// filepath: frontend/app/[tenantSlug]/admin/pages/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPagesPage() {
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [pages, setPages] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!tenantSlug) return;

    fetch(`${API_BASE}/${tenantSlug}/admin/pages`)
      .then((res) => res.json())
      .then((data) => {
        setPages(Array.isArray(data) ? data : []);
      })
      .catch(() => setPages([]));
  }, [tenantSlug]);

  const menuPages = pages
    .filter((p) => p.showInMenu)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const footerPages = pages
    .filter((p) => p.showInFooter)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function updatePage(id, field, value) {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  }

  async function savePage(page) {
    setSavingId(page.id);

    await fetch(`${API_BASE}/${tenantSlug}/admin/pages/${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        showInMenu: page.showInMenu,
        showInFooter: page.showInFooter,
        isPlaceholder: page.isPlaceholder,
        sortOrder: Number(page.sortOrder),
      }),
    });

    setSavingId(null);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          Pages & Navigation
        </h1>

        <Link
          href={`/${tenantSlug}/admin/pages/new`}
          className="btn-primary"
        >
          Add Page
        </Link>
      </header>

      {/* MENU PREVIEW */}
      <section className="grid md:grid-cols-2 gap-6">
        <MenuPreview title="Main Menu Preview" pages={menuPages} />
        <MenuPreview title="Footer Menu Preview" pages={footerPages} />
      </section>

      {/* PAGE LIST + CONTROLS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          All Pages
        </h2>

        <div className="border rounded-lg divide-y bg-white">
          {pages.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 items-center"
            >
              {/* TITLE */}
              <div className="md:col-span-2">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-500">
                  /{p.slug}
                  {p.isPlaceholder && " • Placeholder"}
                  {p.status !== "published" && " • Draft"}
                </div>
              </div>

              {/* TOGGLES */}
              <Toggle
                label="Menu"
                checked={p.showInMenu}
                onChange={(v) =>
                  updatePage(p.id, "showInMenu", v)
                }
              />

              <Toggle
                label="Footer"
                checked={p.showInFooter}
                onChange={(v) =>
                  updatePage(p.id, "showInFooter", v)
                }
              />

              <Toggle
                label="Placeholder"
                checked={p.isPlaceholder}
                onChange={(v) =>
                  updatePage(p.id, "isPlaceholder", v)
                }
              />

              {/* SORT ORDER */}
              <input
                type="number"
                className="w-20 border rounded px-2 py-1 text-sm"
                value={p.sortOrder}
                onChange={(e) =>
                  updatePage(
                    p.id,
                    "sortOrder",
                    e.target.value
                  )
                }
              />

              {/* ACTIONS */}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => savePage(p)}
                  disabled={savingId === p.id}
                  className="text-primary font-medium underline disabled:opacity-50"
                >
                  {savingId === p.id ? "Saving…" : "Save"}
                </button>

                <Link
                  href={`/${tenantSlug}/admin/pages/${p.id}`}
                  className="text-gray-600 underline"
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

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
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
                {p.slug?.toUpperCase()}
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