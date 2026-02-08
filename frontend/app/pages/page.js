// filepath: frontend/app/pages/page.js

import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getPages() {
  try {
    const res = await fetch(`${API_BASE}/api/pages`, {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data
      .filter((p) => p.status === "published")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  } catch {
    return [];
  }
}

export default async function PagesIndex() {
  const pages = await getPages();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-ahsra-blue">
        Pages
      </h1>

      {pages.length === 0 ? (
        <p className="text-gray-600">No pages available.</p>
      ) : (
        <ul className="space-y-4">
          {pages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/${page.slug}`}
                className="text-ahsra-blue font-medium underline"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
