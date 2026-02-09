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
  // ✅ MUST unwrap params in Next 16
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const page = await getPage(slug);

  if (!page || page.status !== "published") {
    notFound();
  }

  if (page.isPlaceholder) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        <p className="text-gray-600">This page is coming soon.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">{page.title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  );
}
