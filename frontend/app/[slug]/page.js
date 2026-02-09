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
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

      {page.isPlaceholder ? (
        <div className="flex-1 flex items-center justify-center text-center">
          <p className="text-gray-600">This page is coming soon.</p>
        </div>
      ) : (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}
    </main>
  );
}
