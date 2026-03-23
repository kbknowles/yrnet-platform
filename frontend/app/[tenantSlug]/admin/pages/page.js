// filepath: frontend/app/[tenantSlug]/admin/pages/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import authFetch from "../../../../utils/authFetch";
import { getBasePath } from "../../../../utils/getBasePath";

export default function AdminPagesPage() {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const basePath = getBasePath(tenantSlug);
  const adminBase = `${basePath}/admin`;

  const [authorized, setAuthorized] = useState(false);
  const [pages, setPages] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push(basePath || "/");
      return;
    }
    setAuthorized(true);
  }, [router, basePath]);

  useEffect(() => {
    if (!tenantSlug || !authorized) return;

    authFetch(`/${tenantSlug}/admin/pages`)
      .then((res) => {
        if (!res.ok) {
          router.push(basePath || "/");
          return [];
        }
        return res.json();
      })
      .then((data) => {
        setPages(Array.isArray(data) ? data : []);
      })
      .catch(() => setPages([]));
  }, [tenantSlug, authorized, router, basePath]);

  const menuPages = pages
    .filter((p) => p.showInMenu)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const footerPages = pages
    .filter((p) => p.showInFooter)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function updatePage(id, field, value) {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  async function savePage(page) {
    setSavingId(page.id);

    await authFetch(`/${tenantSlug}/admin/pages/${page.id}`, {
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

  if (!authorized) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          Pages & Navigation
        </h1>

        <Link href={`${adminBase}/pages/new`} className="btn-primary">
          Add Page
        </Link>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <MenuPreview title="Main Menu Preview" pages={menuPages} />
        <MenuPreview title="Footer Menu Preview" pages={footerPages} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">All Pages</h2>

        <div className="border rounded-lg divide-y bg-white">
          {pages.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 items-center"
            >
              <div className="md:col-span-2">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-500">
                  /{p.slug}
                  {p.isPlaceholder && " • Placeholder"}
                  {p.status !== "published" && " • Draft"}
                </div>
              </div>

              <Toggle
                label="Menu"
                checked={p.showInMenu}
                onChange={(v) => updatePage(p.id, "showInMenu", v)}
              />

              <Toggle
                label="Footer"
                checked={p.showInFooter}
                onChange={(v) => updatePage(p.id, "showInFooter", v)}
              />

              <Toggle
                label="Placeholder"
                checked={p.isPlaceholder}
                onChange={(v) => updatePage(p.id, "isPlaceholder", v)}
              />

              <input
                type="number"
                className="w-20 border rounded px-2 py-1 text-sm"
                value={p.sortOrder}
                onChange={(e) =>
                  updatePage(p.id, "sortOrder", e.target.value)
                }
              />

              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => savePage(p)}
                  disabled={savingId === p.id}
                  className="text-primary font-medium underline disabled:opacity-50"
                >
                  {savingId === p.id ? "Saving…" : "Save"}
                </button>

                <Link
                  href={`${adminBase}/pages/${p.id}`}
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
      <h3 className="font-semibold mb-3">{title}</h3>

      {pages.length === 0 ? (
        <p className="text-sm text-gray-500">No pages assigned.</p>
      ) : (
        <ol className="space-y-2 text-sm">
          {pages.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center"
            >
              <span>
                {p.slug?.charAt(0).toUpperCase() + p.slug?.slice(1)}
                {p.isPlaceholder && (
                  <span className="text-xs text-gray-500">
                    {" "} (coming soon)
                  </span>
                )}
              </span>
              <span className="text-gray-400">{p.sortOrder}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}