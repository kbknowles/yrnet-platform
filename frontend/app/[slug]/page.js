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
  const { slug } = await params; // ✅ REQUIRED IN NEXT 15

  const page = await getPage(slug);
  if (!page || page.status !== "published") notFound();

  if (page.isPlaceholder) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold text-ahsra-blue">
          {page.title}
        </h1>
        <p className="text-gray-600 text-lg">
          This section is coming soon.
        </p>
        <p className="text-gray-500">
          Check back during the season for updates.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-ahsra-blue mb-6">
        {page.title}
      </h1>
      <article className="prose max-w-none">
        {page.content}
      </article>
    </main>
  );
}
