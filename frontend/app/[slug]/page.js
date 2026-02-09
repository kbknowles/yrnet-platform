// filepath: frontend/app/[slug]/page.js

import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getPage(slug) {
  const res = await fetch(`${API_BASE}/api/pages/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function CustomPage({ params }) {
  const { slug } = await params;

  if (!slug) notFound();

  const page = await getPage(slug);

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{page.title}</h1>

      {page.isPlaceholder ? (
        <p className="text-gray-600 text-center">
          This page is coming soon.
        </p>
      ) : (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}
    </main>
  );
}
